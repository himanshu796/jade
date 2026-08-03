import { useEffect, useState } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);
    const exitTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for exit animation before unmount
    }, duration);

    return () => {
      clearTimeout(enter);
      clearTimeout(exitTimer);
    };
  }, [duration, onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-6 left-1/2 z-50 flex items-center gap-3 min-w-70 max-w-sm px-5 py-4 rounded-lg shadow-lg border transition-all duration-300 ${
        visible
          ? "-translate-x-1/2 -translate-y-1/2 opacity-100 scale-100"
          : "-translate-x-1/2 -translate-y-1/2 opacity-0 scale-95"
      } ${
        isSuccess ? "bg-[#1a3c2e] border-[#d4af6e]" : "bg-white border-red-200"
      }`}
    >
      <span
        className={`text-lg ${isSuccess ? "text-[#d4af6e]" : "text-red-500"}`}
      >
        {isSuccess ? "✓" : "✕"}
      </span>
      <p
        className={`text-sm font-medium flex-1 ${
          isSuccess ? "text-white" : "text-red-700"
        }`}
      >
        {message}
      </p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className={`text-sm opacity-70 hover:opacity-100 ${
          isSuccess ? "text-white" : "text-red-700"
        }`}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
