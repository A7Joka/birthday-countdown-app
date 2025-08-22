// ====== CONFIG ======
// Set your Google Apps Script Web App URL here (we'll wire it later)
export const GAS_URL = ""; // e.g. "https://script.google.com/macros/s/AKfycbx.../exec"

// Optional: GitHub repo info for future Dashboard integration
export const GITHUB = {
  username: "",   // your GitHub username
  repo: "",       // repo name hosting the site
  branch: "main", // or 'gh-pages' depending on your setup
  token: ""       // we'll avoid using token client-side later; dashboard will use it
};