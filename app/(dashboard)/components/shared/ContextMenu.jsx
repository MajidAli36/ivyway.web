import { useEffect, useRef } from "react";

export default function ContextMenu({ x, y, onClose, options }) {
  const menuRef = useRef(null);

  // Position menu to prevent it from going off-screen
  const adjustPosition = () => {
    const position = { x, y };

    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Adjust horizontal position if menu would go off-screen
      if (x + rect.width > windowWidth) {
        position.x = windowWidth - rect.width - 10;
      }

      // Adjust vertical position if menu would go off-screen
      if (y + rect.height > windowHeight) {
        position.y = windowHeight - rect.height - 10;
      }
    }

    return position;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Close on escape key
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  // Calculate adjusted position
  const position = adjustPosition();

  return (
    <div
      ref={menuRef}
      className="fixed bg-white shadow-lg rounded-md py-1 z-[1000] min-w-[160px]"
      style={{
        top: position.y,
        left: position.x,
        maxWidth: "200px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => {
            if (!option.disabled && typeof option.onClick === "function") {
              option.onClick();
              onClose();
            }
          }}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 ${
            option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={option.disabled}
        >
          <span className="w-5 text-center">{option.icon}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
