import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import useAuth from "../context/useAuth";

let razorpayLoadPromise = null;

const loadRazorpayScript = () => {
    if (razorpayLoadPromise) return razorpayLoadPromise;

    razorpayLoadPromise = new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const existing = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );
        if (existing) {
            existing.addEventListener("load", () => resolve(true));
            existing.addEventListener("error", () => resolve(false));
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    return razorpayLoadPromise;
};

const usePayment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Load Razorpay SDK once when the hook is used
    useEffect(() => {
        loadRazorpayScript();
    }, []);

    // Starts payment for either:
    // 1. A newly created booking
    // 2. An existing pending booking
    const startPayment = async ({
        bookingId,
        setLoading,
        setError,
        onSuccess
    }) => {
        try {
            setLoading?.(true);
            setError?.("");

            const loaded = await loadRazorpayScript();
            if (!loaded || !window.Razorpay) {
                throw new Error("Razorpay SDK failed to load.");
            }

            if (!bookingId) {
                throw new Error("Booking information is incomplete.");
            }

            // No booking is created yet — the backend creates a Razorpay order and stashes the booking details server-side (keyed by order_id) until payment is verified.
            const orderRes = await axiosInstance.post("/payments/create-order", {
                booking_id: bookingId
            });

            const { order, key_id } = orderRes.data.data;

            const options = {
                key: key_id,
                amount: order.amount,
                currency: "INR",
                order_id: order.id,
                name: "Jade River Resort",
                description: "Room Booking",
                // Called after successful payment
                handler: async (response) => {
                    try {
                        // Booking + Payment rows are created inside this endpoint, only after signature verification passes.
                        await axiosInstance.post("/payments/verify-payment", {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        if (onSuccess) {
                            onSuccess();
                        } else {
                            navigate("/booking-success");
                        }
                    } catch (err) {
                        setError?.(err.response?.data?.message || err.message || "Payment verification failed.");
                    }
                },
                // Autofill customer information
                prefill: {
                    name: user?.fullname,
                    email: user?.email,
                    contact: user?.mobile_number,
                },
                theme: {
                    color: "#1a3c2e",
                },
                // Triggered when user closes the payment popup
                modal: {
                    ondismiss: () => {
                        setLoading?.(false);
                        setError?.("Payment cancelled.");
                    },
                },
            };

            // Step 5: Open Razorpay Checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            setError?.(err.response?.data?.message || err.message || "Something went wrong.");
        } finally {
            setLoading?.(false);
        }
    };

    return { startPayment };
};

export default usePayment;