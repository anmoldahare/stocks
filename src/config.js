// Centralized API configuration
// In development, Vite proxy handles /api → localhost:5001
// In production, VITE_API_URL should point to your deployed backend
export const API_BASE = import.meta.env.VITE_API_URL || '';
