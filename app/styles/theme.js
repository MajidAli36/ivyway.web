/**
 * Theme utility to easily access our color scheme in JS when needed
 */
export const theme = {
  colors: {
    primary: {
      light: "bg-primary-400",
      main: "bg-primary-600",
      dark: "bg-primary-800",
      text: "text-primary-600",
      border: "border-primary-600",
      hover: "hover:bg-primary-700",
    },
    accent: {
      light: "bg-accent-400",
      main: "bg-accent-500",
      dark: "bg-accent-700",
      text: "text-accent-500",
      border: "border-accent-500",
      hover: "hover:bg-accent-600",
    },
    neutral: {
      light: "bg-neutral-100",
      main: "bg-neutral-200",
      dark: "bg-neutral-800",
      text: "text-neutral-700",
      border: "border-neutral-300",
    },
    gradient: {
      primary: "bg-gradient-to-r from-primary-700 to-primary-600",
      accent: "bg-gradient-to-r from-accent-600 to-accent-500",
      header: "bg-gradient-to-r from-slate-700 to-accent-500",
    },
  },
};
