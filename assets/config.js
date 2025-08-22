// ====== CONFIG ======
// Set your Google Apps Script Web App URL here (we'll wire it later)
export const GAS_URL = "https://script.google.com/macros/s/AKfycbz5QJYEFPFKcB7okLQX3Ea_OOm5vtiWJO5JN5JkGZCbUq705L4pzx1VbqyXSC38U_996Q/exec"; // e.g. "https://script.google.com/macros/s/AKfycbx.../exec"

// Optional: GitHub repo info for future Dashboard integration
export const GITHUB = {
  username: "",   // your GitHub username
  repo: "",       // repo name hosting the site
  branch: "main", // or 'gh-pages' depending on your setup
  token: ""       // we'll avoid using token client-side later; dashboard will use it
};
