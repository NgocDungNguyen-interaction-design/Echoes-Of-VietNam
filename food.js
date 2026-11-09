
const landing = document.getElementById('regionLanding');
const menuPage = document.getElementById('regionMenu');
const regionCards = document.getElementById('regionCards');
const menuTitle = document.getElementById('menuTitle');
const menuTagline = document.getElementById('menuTagline');
const menuIntro = document.getElementById('menuIntro');
const dishList = document.getElementById('dishList');

const numerals = ['01','02','03'];
const esc = (value) => String(value).replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
}[char]));

function renderRegionCards(){
  regionCards.innerHTML = foodRegions.map((region,index) => `
    <button class="region-card" type="button" data-region="${esc(region.key)}">
      <div>
        <span class="region-number">${numerals[index]} / REGION</span>
        <h2>${esc(region.region)}</h2>
        <p>${esc(region.tagline)}</p>
      </div>
      <span class="region-arrow" aria-hidden="true">→</span>
    </button>
  `).join('');
  regionCards.querySelectorAll('[data-region]').forEach(button => {
    button.addEventListener('click', () => openRegion(button.dataset.region));
  });
}

function openRegion(key){
  const region = foodRegions.find(item => item.key === key);
  if(!region) return;
  menuTitle.textContent = region.region;
  menuTagline.textContent = region.tagline;
  menuIntro.textContent = region.intro;
  const dishSlugs = {'Phở Bò':'pho-bo','Bún Chả':'bun-cha','Chả Cá Lã Vọng':'cha-ca-la-vong','Bún Bò Huế':'bun-bo-hue','Mì Quảng':'mi-quang','Cao Lầu':'cao-lau','Cơm Tấm':'com-tam','Hủ Tiếu':'hu-tieu','Bánh Xèo':'banh-xeo'};
  dishList.innerHTML = region.dishes.map((dish,index) => `
    <article class="dish-card" id="${dishSlugs[dish.name] || ''}">
      <div class="dish-image">
        <img src="assets/food/${esc(dish.image)}" alt="${esc(dish.name)}" loading="lazy">
      </div>
      <div class="dish-content">
        <span class="dish-number">${String(index+1).padStart(2,'0')} / ${esc(region.region.toUpperCase())}</span>
        <h2>${esc(dish.name)}</h2>
        <p class="dish-subtitle">${esc(dish.subtitle)}</p>
        <button class="item-save-button" type="button" data-save="food-${dishSlugs[dish.name] || index}" data-save-name="${esc(dish.name)}" data-save-category="Food · ${esc(region.region)}" data-save-tagline="${esc(dish.subtitle)}" data-save-image="assets/food/${esc(dish.image)}" data-save-url="food.html?region=${esc(region.key)}&dish=${dishSlugs[dish.name] || ''}" aria-pressed="false" aria-label="Save ${esc(dish.name)}">♡ <span>Save</span></button>
        <p class="origin"><strong>Origin:</strong> ${esc(dish.origin)}</p>
        <div class="dish-details">
          <h3>The Story Behind the Dish</h3>
          <p>${esc(dish.story)}</p>
          <h3>Main Ingredients</h3>
          <ul>${dish.ingredients.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
          <h3>How It Is Made</h3>
          <ol>${dish.method.map(item => `<li>${esc(item)}</li>`).join('')}</ol>
          <h3>Cultural Significance</h3>
          <p>${esc(dish.culture)}</p>
        </div>
      </div>
    </article>
  `).join('');
  landing.hidden = true;
  menuPage.hidden = false;
  window.scrollTo({top:0,behavior:'smooth'});
  const requestedDish = new URLSearchParams(window.location.search).get('dish');
  if (requestedDish) setTimeout(() => document.getElementById(requestedDish)?.scrollIntoView({behavior:'smooth', block:'start'}), 120);
}

function showRegions(){
  menuPage.hidden = true;
  landing.hidden = false;
  window.scrollTo({top:0,behavior:'smooth'});
}
document.getElementById('backToRegions').addEventListener('click',showRegions);
document.getElementById('backToRegionsBottom').addEventListener('click',showRegions);
renderRegionCards();
const params = new URLSearchParams(window.location.search);
const requestedRegion = params.get('region');
if (requestedRegion) openRegion(requestedRegion);
