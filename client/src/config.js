export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";
export const AUTH_STORAGE_KEY = "taskProAuth";

export const PRIORITY_COLORS = {
  none: "#8FA3D1",
  low: "#E09CB5",
  medium: "#F4C67C",
  high: "#EA3587",
};

export const LABELS = [
  { color: "#8FA1D0", name: "Low" },
  { color: "#E09CB5", name: "Medium" },
  { color: "#BEDBB0", name: "High" },
  { color: "#5C5C5C", name: "Without" },
];
