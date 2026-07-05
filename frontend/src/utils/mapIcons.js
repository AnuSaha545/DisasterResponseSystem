import L from "leaflet";

function createSvgDataUrl(color, symbol, size) {
  const width = size[0];
  const height = size[1];
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const r = Math.floor(Math.min(width, height) / 2) - 6;
  const fontSize = Math.floor(Math.min(width, height) / 2.2);
  const textY = cy + Math.floor(fontSize / 3);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" stroke="#ffffff" stroke-width="2" />
      <text x="${cx}" y="${textY}" text-anchor="middle" font-size="${fontSize}" style="font-family:Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif">${symbol}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function createMarkerIcon(color, symbol, size = [40, 40]) {
  return new L.Icon({
    iconUrl: createSvgDataUrl(color, symbol, size),
    iconSize: size,
    iconAnchor: [Math.floor(size[0] / 2), size[1]],
    popupAnchor: [0, -size[1] + 6]
  });
}

export const resourceIcons = {
  fire: createMarkerIcon("#dc2626", "🔥"),
  medical: createMarkerIcon("#2563eb", "🩺"),
  rescue: createMarkerIcon("#7c3aed", "🚑"),
  flood: createMarkerIcon("#0f766e", "🌊"),
  food: createMarkerIcon("#16a34a", "🍲"),
  water: createMarkerIcon("#0891b2", "💧"),
  default: createMarkerIcon("#2563eb", "🩺")
};