/**
 * Kaushal Setu - Centralized API Configuration
 *
 * In deployed environments (Vercel, Netlify, Render, etc.), set:
 *   VITE_API_BASE_URL=https://<your-backend-app>.onrender.com/api
 * (or https://<your-backend-app>.onrender.com)
 *
 * In local development, falls back automatically to http://127.0.0.1:8000/api
 */

const envUrl = (
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (import.meta as any).env?.VITE_API_BASE ||
  ''
).trim().replace(/\/+$/, '');

export const API_BASE: string = envUrl
  ? (envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`)
  : 'http://127.0.0.1:8000/api';
