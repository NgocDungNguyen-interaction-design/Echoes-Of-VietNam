const STORAGE_KEY = "echoesVietnamSaved";
const getSaved = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
};
const setSaved = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
const META_KEY = "echoesVietnamSavedMeta";
const getSavedMeta = () => { try { return JSON.parse(localStorage.getItem(META_KEY) || "{}"); } catch { return {}; } };

function updateSavedCount() {
  const count = getSaved().length;
  document.querySelectorAll("[data-saved-count]").forEach(el => el.textContent = count);
}

function syncSaveButtons() {
  const saved = getSaved();
  document.querySelectorAll("[data-save]").forEach(button => {
    const isSaved = saved.includes(button.dataset.save);
    button.classList.toggle("is-saved", isSaved);
    button.setAttribute("aria-pressed", String(isSaved));
    button.innerHTML = button.classList.contains("item-save-button") ? (isSaved ? "♥ <span>Saved</span>" : "♡ <span>Save</span>") : (isSaved ? "♥" : "♡");
    button.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${button.dataset.save} ${isSaved ? "from" : "to"} saved collection`);
  });
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-save]");
  if (!button) return;
  const id = button.dataset.save;
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
  setSaved(next);
  const meta = getSavedMeta();
  if (next.includes(id) && button.dataset.saveName) {
    meta[id] = { id, name: button.dataset.saveName, category: button.dataset.saveCategory || "Discovery", tagline: button.dataset.saveTagline || "", image: button.dataset.saveImage || "assets/logo.png", url: button.dataset.saveUrl || "index.html" };
  } else { delete meta[id]; }
  localStorage.setItem(META_KEY, JSON.stringify(meta));
  syncSaveButtons();
  updateSavedCount();
  window.dispatchEvent(new Event("saved-updated"));
});

document.querySelectorAll("[data-back-top]").forEach(button => {
  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});

updateSavedCount();
syncSaveButtons();
