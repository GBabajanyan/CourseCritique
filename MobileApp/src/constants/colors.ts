export const Colors = {
  // Light Mode (default)
  light: {
    NAVY: "#003A5D",
    SAFFRON: "#EEBC03",
    WHITE: "#FFFFFF",
    BACKGROUND: "#F8F9FA",
    SURFACE: "#FFFFFF",
    TEXT: "#1F2937",
    TEXT_SECONDARY: "#6B7280",
    BORDER: "#E5E7EB",
    CARD: "#FFFFFF",
    ERROR: "#DC2626",
    SUCCESS: "#10B981",
    WARNING: "#F59E0B",
  },

  // Dark Mode
  dark: {
    NAVY: "#5B8FB9", // Lighter blue for dark bg
    SAFFRON: "#EEBC03", // Keep same (contrasts well)
    WHITE: "#1E1E1E", // Dark bg instead of white
    BACKGROUND: "#121212", // Material dark background
    SURFACE: "#1E1E1E", // Card/surface color
    TEXT: "#FFFFFF", // White text on dark
    TEXT_SECONDARY: "#9CA3AF", // Gray text
    BORDER: "#333333", // Subtle border
    CARD: "#2C2C2C", // Card background
    ERROR: "#F87171", // Lighter red for dark
    SUCCESS: "#34D399", // Lighter green for dark
    WARNING: "#FBBF24", // Lighter yellow for dark
  },
};

export const feedbackColors = [
  "#FF6B35",
  "#007AFF",
  "#DC3545",
  "#28A745",
  "#6F42C1",
  "#FD7E14",
  "#20C997",
  "#000",
];

export const phaseColors: Record<string, string> = {
  addDrop: "#FF6B35",
  midterm: "#007AFF",
  finals: "#DC3545",
};

export const departmentColors: Record<string, string> = {
  BAB: "#8E44AD",
  CBE: "#D35400",
  CHSS: "#9B59B6",
  CS: "#003A5D",
  CSE: "#EEBC03",
  DS: "#F39C12",
  EC: "#E67E22",
  ECON: "#48C9B0",
  ENGS: "#3498DB",
  ESS: "#2ECC71",
  ENV: "#27AE60",
  EPIC: "#F1C40F",
  HRSJ: "#E74C3C",
  PG: "#8B4513",
  PH: "#16A085",
  default: "#95A5A6",
};
