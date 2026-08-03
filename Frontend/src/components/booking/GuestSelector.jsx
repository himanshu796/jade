import { useEffect, useRef, useState } from "react";

const GuestSelector = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { adults, children } = value;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  const update = (field, delta) => {
    const next = { ...value };
    if (field === "adults") {
      next.adults = clamp(adults + delta, 1, 20);
    } else if (field === "children") {
      next.children = clamp(children + delta, 0, 10);
    }
    onChange(next);
  };

  const summaryLabel = `${adults} Adult${adults > 1 ? "s" : ""} · ${children} Child${
    children !== 1 ? "ren" : ""
  }`;

  const Counter = ({ label, field, min, val }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[#1a3c2e] font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update(field, -1)}
          disabled={val <= min}
          className="w-8 h-8 rounded-full border border-[#1a3c2e]/30 text-[#1a3c2e] flex items-center justify-center hover:bg-[#1a3c2e]/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          -
        </button>
        <span className="w-6 text-center text-sm font-semibold text-[#1a3c2e]">
          {val}
        </span>
        <button
          type="button"
          onClick={() => update(field, 1)}
          className="w-8 h-8 rounded-full border border-[#1a3c2e]/30 text-[#1a3c2e] flex items-center justify-center hover:bg-[#1a3c2e]/5 transition"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-12 px-4 border border-gray-300 rounded-md bg-white text-left text-sm text-[#1a3c2e] flex items-center justify-between hover:border-[#1a3c2e]/50 transition"
      >
        <span>{summaryLabel}</span>
        <svg
          className={`w-4 h-4 text-[#1a3c2e] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-20 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-center text-xs tracking-widest uppercase text-[#d4af6e] font-semibold mb-2">
            Guests
          </p>

          <Counter label="Adults" field="adults" min={1} val={adults} />
          <div className="h-px bg-gray-200" />
          <Counter label="Children" field="children" min={0} val={children} />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-4 w-full h-10 rounded-md bg-[#1a3c2e] text-white text-sm font-semibold hover:bg-[#1a3c2e]/90 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;
