/**
 * Get the URL of the current enviroment
 */

export const getUrl = () => {
  let url =
    process?.env?.NEXT_PUBLIC_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL ??
    "http://localhost:3000";

  // Include `https://` when not localhost
  url = url.includes("http") ? url : `https://${url}`;

  // append trailing '/' if not present
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

  return url;
};
