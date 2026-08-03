const StepsIndicator = ({ step }) => {
  return (
    <div className="w-full bg-white border-b border-gray-100 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
        {["Select Dates", "Choose Room", "Payment"].map((label, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step > index + 1
                  ? "bg-[#d4af6e] text-[#1a3c2e]"
                  : step === index + 1
                    ? "bg-[#1a3c2e] text-white"
                    : "bg-gray-200 text-gray-400"
              }`}
            >
              {step > index + 1 ? "✓" : index + 1}
            </div>
            <span
              className={`text-xs sm:text-sm font-semibold tracking-wide hidden sm:block ${
                step === index + 1 
                ? "text-[#1a3c2e]" 
                : "text-gray-400"
              }`}
            >
              {label}
            </span>
            {index < 2 && (
              <div
                className={`w-8 sm:w-16 h-px ${
                  step > index + 1 
                  ? "bg-[#d4af6e]" 
                  : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsIndicator;
