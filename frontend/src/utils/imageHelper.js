// Convert image paths to displayable URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image';

  // Strip out hidden unicode characters often added by Windows "Copy as path"
  const pathStr = String(imagePath).replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '').trim();

  // If it's a standard web URL, return it directly
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) {
    return pathStr;
  }

  // Otherwise, assume it's a local file path or filename and route through the backend proxy
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const base = backendUrl.replace(/\/api\/?$/, '');
  return `${base}/api/upload/local-image?path=${encodeURIComponent(pathStr)}`;
};
