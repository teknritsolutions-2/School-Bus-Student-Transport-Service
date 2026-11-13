export const siteRoot = new URL("../../", import.meta.url);
export const pageUrl = (file) =>
  new URL(file === "index.html" ? file : `pages/${file}`, siteRoot).href;
export const assetUrl = (file) => new URL(`assets/${file}`, siteRoot).href;
export const BRAND = {
  name: "KinderRide Transit",
  message: "Safe journeys. Clear routes. Confident school mornings.",
};
export const storagePrefix = "kinderride:wayfinder:v1:";
export function storeGet(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(storagePrefix + key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function storeSet(key, value) {
  localStorage.setItem(storagePrefix + key, JSON.stringify(value));
}
export const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;
export const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
