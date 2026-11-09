const savedGrid = document.getElementById("saved-grid");
const savedEmpty = document.getElementById("saved-empty");
const savedTotal = document.getElementById("saved-total");
const savedLabel = document.getElementById("saved-label");

function renderSaved() {
  const savedIds = JSON.parse(localStorage.getItem("echoesVietnamSaved") || "[]");
  const meta = JSON.parse(localStorage.getItem("echoesVietnamSavedMeta") || "{}");
  const categories = (window.ECHOES_CATEGORIES || []).filter(item => savedIds.includes(item.id)).map(item => ({...item, category:"Collection", url: item.id === 'stories' ? 'stories.html' : `${item.id}.html`}));
  const individual = savedIds.filter(id => meta[id]).map(id => meta[id]);
  const items = [...categories, ...individual];
  savedTotal.textContent = items.length;
  savedLabel.textContent = `${items.length} SAVED`;
  savedGrid.innerHTML = items.map(item => `
    <article class="saved-card">
      <img src="${item.image}" alt="${item.name}">
      <div class="saved-card-copy">
        <div class="saved-card-head"><h3>${item.name}</h3>
          <button class="remove-save" data-save="${item.id}" aria-label="Remove ${item.name} from saved collection">♥</button>
        </div>
        <p class="saved-item-category">${item.category || ''}</p>
        <p>${item.tagline || item.description || ''}</p>
        <a class="text-link" href="${item.url || 'index.html'}">EXPLORE <span>→</span></a>
      </div>
    </article>`).join("");
  savedEmpty.classList.toggle("hidden", items.length > 0);
  savedGrid.classList.toggle("hidden", items.length === 0);
  document.querySelectorAll("[data-saved-count]").forEach(el => el.textContent = items.length);
}
document.getElementById("clear-saved").addEventListener("click", () => {
  if (!confirm("Clear all saved items from this device?")) return;
  localStorage.setItem("echoesVietnamSaved", "[]");
  localStorage.setItem("echoesVietnamSavedMeta", "{}");
  renderSaved();
});
window.addEventListener("saved-updated", renderSaved);
renderSaved();
