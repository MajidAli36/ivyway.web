import Link from "next/link";

export default function Button({
  href,
  children,
  variant = "primary",
  size = "medium",
  icon,
  className = "",
  onClick,
}) {
  const baseStyles = "font-medium rounded-full transition-all";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md",
    secondary: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    outline: "border-2 border-blue-600 text-blue-700 hover:bg-blue-50",
    white: "bg-white text-blue-600 hover:bg-blue-50 shadow-lg",
    link: "text-blue-600 hover:underline",
  };

  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    medium: "px-5 py-2",
    large: "px-8 py-4 text-lg",
  };

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const buttonContent = (
    <>
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button className={buttonStyles} onClick={onClick}>
      {buttonContent}
    </button>
  );
}
