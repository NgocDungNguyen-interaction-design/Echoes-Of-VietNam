const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('search-results');
const emptyMessage = document.getElementById('search-empty');
const resultTitle = document.getElementById('results-title');
const resultCount = document.getElementById('result-count');

const normalise = value => String(value || '').toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim();
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const searchItems = [
  // Clothing
  {title:'Áo Dài',category:'Clothing',tagline:'The timeless symbol of Vietnam',description:'Discover the history, elegant silhouette, materials and cultural significance of Vietnam’s best-known traditional garment.',image:'assets/clothing/ao-dai.png',url:'clothing.html#ao-dai',keywords:'ao dai ao ngũ thân vietnamese dress long tunic silk traditional clothing'},
  {title:'Áo Tứ Thân',category:'Clothing',tagline:'The traditional dress of Northern Vietnam',description:'Explore the four-panel garment associated with rural women, the Red River Delta and Quan họ folk culture.',image:'assets/clothing/ao-tu-than.png',url:'clothing.html#ao-tu-than',keywords:'ao tu than ao yem quan ho northern vietnam folk dress'},
  {title:'Áo Giao Lĩnh',category:'Clothing',tagline:'An early form of Vietnamese traditional dress',description:'Learn about the crossed-collar garment and its place in the history of Vietnamese cổ phục.',image:'assets/clothing/ao-giao-linh.png',url:'clothing.html#ao-giao-linh',keywords:'ao giao linh co phuc crossed collar historical clothing'},
  {title:'Áo Bà Ba',category:'Clothing',tagline:'The everyday charm of Southern Vietnam',description:'Discover the practical shirt-and-trousers outfit associated with everyday life in the Mekong Delta.',image:'assets/clothing/ao-ba-ba.png',url:'clothing.html#ao-ba-ba',keywords:'ao ba ba southern vietnam mekong delta rural clothing'},
  // Food
  {title:'Phở Bò',category:'Food · Northern Vietnam',tagline:'The soul of Vietnamese noodle soup',description:'A Hanoi-associated beef noodle soup known for its aromatic broth, rice noodles and balance of herbs and spices.',image:'assets/food/pho-bo.jpg',url:'food.html?region=north&dish=pho-bo',keywords:'pho pho bo beef noodle soup hanoi northern food rice noodles'},
  {title:'Bún Chả',category:'Food · Northern Vietnam',tagline:'The taste of Hanoi’s streets',description:'Grilled pork served with rice vermicelli, fresh herbs and a sweet-and-sour dipping sauce.',image:'assets/food/bun-cha.jpg',url:'food.html?region=north&dish=bun-cha',keywords:'bun cha grilled pork vermicelli hanoi northern food'},
  {title:'Chả Cá Lã Vọng',category:'Food · Northern Vietnam',tagline:'A tradition of flavour and heritage',description:'A Hanoi speciality of turmeric-marinated fish finished with dill, spring onions and aromatic accompaniments.',image:'assets/food/cha-ca-la-vong.jpg',url:'food.html?region=north&dish=cha-ca-la-vong',keywords:'cha ca la vong fish dill hanoi northern food'},
  {title:'Bún Bò Huế',category:'Food · Central Vietnam',tagline:'A bold and aromatic noodle soup',description:'A Central Vietnamese noodle soup recognised for its rich, fragrant broth and distinctive seasoning.',image:'assets/food/bun-bo-hue.jpg',url:'food.html?region=central&dish=bun-bo-hue',keywords:'bun bo hue beef noodle soup central vietnam food'},
  {title:'Mì Quảng',category:'Food · Central Vietnam',tagline:'A colourful taste of Quảng Nam',description:'A regional noodle dish served with a small amount of richly seasoned broth, herbs and crisp toppings.',image:'assets/food/mi-quang.jpg',url:'food.html?region=central&dish=mi-quang',keywords:'mi quang quang nam central vietnam noodles food'},
  {title:'Cao Lầu',category:'Food · Central Vietnam',tagline:'A signature dish of Hội An',description:'A distinctive Hội An noodle dish combining chewy noodles, sliced pork, herbs and crunchy toppings.',image:'assets/food/cao-lau.jpg',url:'food.html?region=central&dish=cao-lau',keywords:'cao lau hoi an noodles central vietnam food'},
  {title:'Cơm Tấm',category:'Food · Southern Vietnam',tagline:'A favourite of Southern street food',description:'Broken rice commonly served with grilled pork and a selection of savoury accompaniments.',image:'assets/food/com-tam.jpg',url:'food.html?region=south&dish=com-tam',keywords:'com tam broken rice grilled pork saigon southern food'},
  {title:'Hủ Tiếu',category:'Food · Southern Vietnam',tagline:'A comforting bowl from the South',description:'A versatile Southern noodle soup with regional variations and a range of toppings and broths.',image:'assets/food/hu-tieu.jpg',url:'food.html?region=south&dish=hu-tieu',keywords:'hu tieu noodle soup southern vietnam food'},
  {title:'Bánh Xèo',category:'Food · Southern Vietnam',tagline:'A crispy savoury Vietnamese pancake',description:'A golden rice-flour pancake filled with savoury ingredients and served with fresh greens and dipping sauce.',image:'assets/food/banh-xeo.jpg',url:'food.html?region=south&dish=banh-xeo',keywords:'banh xeo pancake southern vietnam food'},
  // Stories
  {title:'Lạc Long Quân & Âu Cơ',category:'Stories',tagline:'The legend of the Vietnamese people',description:'An origin legend about the Dragon Lord, the Mountain Fairy and the shared ancestry of the Vietnamese people.',image:'assets/stories/lac-long-quan-au-co.png',url:'story-reader.html?id=lac-long-quan-au-co',keywords:'lac long quan au co dragon fairy con rong chau tien origin legend'},
  {title:'Bánh Chưng & Bánh Dày',category:'Stories',tagline:'The legend of the traditional rice cakes',description:'The story of Lang Liêu and the symbolic rice cakes associated with gratitude, ancestors and Tết.',image:'assets/stories/banh-chung-banh-day.png',url:'story-reader.html?id=banh-chung-banh-day',keywords:'banh chung banh day lang lieu tet rice cake legend'},
  {title:'Sơn Tinh & Thủy Tinh',category:'Stories',tagline:'The legend of the mountain and water gods',description:'A folk tale often understood as reflecting seasonal floods and the relationship between people and nature.',image:'assets/stories/son-tinh-thuy-tinh.png',url:'story-reader.html?id=son-tinh-thuy-tinh',keywords:'son tinh thuy tinh mountain water gods flood legend'},
  // Craft
  {title:'Nón Lá',category:'Craft',tagline:'The art of the Vietnamese conical hat',description:'Discover the palm leaves, bamboo frame and careful hand-stitching behind this familiar Vietnamese object.',image:'assets/craft/non-la.jpg',url:'craft.html#non-la',keywords:'non la conical hat palm leaf chuong van the non bai tho'},
  {title:'Tranh Dân Gian · Đông Hồ',category:'Craft',tagline:'Stories and beliefs printed in colour',description:'Explore Vietnamese folk woodblock prints, giấy điệp, carved blocks and the Đông Hồ tradition.',image:'assets/craft/dong-ho.jpg',url:'craft.html#tranh-dan-gian',keywords:'tranh dan gian dong ho folk painting woodblock print bac ninh giay diep'},
  {title:'Gốm Bát Tràng',category:'Craft',tagline:'Shaping the earth into everyday beauty',description:'Learn how artisans shape, decorate, glaze and fire ceramics in the well-known pottery village near Hà Nội.',image:'assets/craft/pottery.jpg',url:'craft.html#gom',keywords:'gom bat trang pottery ceramics clay kiln vase'},
  {title:'Dệt May & Thổ Cẩm',category:'Craft',tagline:'Threads that carry culture and identity',description:'Discover silk-making and the diverse weaving traditions and patterns of Vietnam’s communities.',image:'assets/craft/textiles.jpg',url:'craft.html#det-may',keywords:'det may textile weaving van phuc silk tho cam brocade loom'},
  // Heritage
  {title:'Imperial City of Huế',category:'Heritage',tagline:'The legacy of Vietnam’s last imperial dynasty',description:'Explore the Nguyễn Dynasty capital, royal ceremonies, palaces, temples and the Forbidden Purple City.',image:'assets/heritage/hue-imperial-city.jpg',url:'heritage.html#hue',keywords:'hue imperial city citadel nguyen dynasty ngo mon thai hoa forbidden purple city'},
  {title:'Hội An Ancient Town',category:'Heritage',tagline:'Where cultures meet and history remains',description:'Discover the historic trading port shaped by Vietnamese, Japanese and Chinese communities.',image:'assets/heritage/hoi-an.jpg',url:'heritage.html#hoi-an',keywords:'hoi an ancient town trading port japanese covered bridge merchant houses lantern'},
  {title:'Mỹ Sơn Sanctuary',category:'Heritage',tagline:'The sacred remains of Champa civilisation',description:'Explore the temple complex associated with the Champa civilisation and Hindu worship, particularly Shiva.',image:'assets/heritage/my-son.jpg',url:'heritage.html#my-son',keywords:'my son sanctuary champa cham hindu shiva temple towers quang nam'},
  {title:'Thăng Long Imperial Citadel',category:'Heritage',tagline:'A thousand years of Vietnamese history',description:'Discover the historic political centre established in 1010 and its archaeological remains.',image:'assets/heritage/thang-long.jpg',url:'heritage.html#thang-long',keywords:'thang long imperial citadel hanoi ly dynasty 1010 doan mon archaeological'},
  {title:'Hạ Long Bay',category:'Heritage',tagline:'A natural wonder shaped by time',description:'Explore limestone karsts, caves, islands and the cultural stories connected to the bay.',image:'assets/heritage/ha-long-bay.jpg',url:'heritage.html#ha-long',keywords:'ha long bay limestone karsts cat ba descending dragon quang ninh'},
  // Architecture
  {title:'Chùa Một Cột · One Pillar Pagoda',category:'Architecture',tagline:'A temple rising from a single stone pillar',description:'Discover the lotus-inspired Buddhist pavilion commissioned during the Lý Dynasty in 1049.',image:'assets/architecture/one-pillar-pagoda.jpg',url:'architecture.html#one-pillar',keywords:'chua mot cot one pillar pagoda ly dynasty lotus buddhist temple'},
  {title:'Imperial Architecture of Huế',category:'Architecture',tagline:'The elegance and authority of a royal dynasty',description:'Explore the symmetry, courtyards, timber structures and symbolic decoration of Nguyễn royal architecture.',image:'assets/architecture/imperial-architecture-hue.jpg',url:'architecture.html#hue',keywords:'imperial architecture hue palace nguyen dynasty royal timber dragon phoenix'},
  {title:'Ancient Houses of Hội An',category:'Architecture',tagline:'Wooden architecture shaped by cultural exchange',description:'Discover narrow timber-frame merchant houses, internal courtyards and traditional tiled roofs.',image:'assets/architecture/ancient-houses-hoi-an.jpg',url:'architecture.html#hoi-an',keywords:'ancient houses hoi an tan ky wooden architecture merchant house courtyard'},
  {title:'Phát Diệm Cathedral',category:'Architecture',tagline:'Vietnamese architecture meets European influences',description:'Explore the distinctive fusion of Vietnamese roof forms, stone craftsmanship and Catholic church design.',image:'assets/architecture/phat-diem-cathedral.jpg',url:'architecture.html#phat-diem',keywords:'phat diem cathedral ninh binh stone church catholic architecture gothic'},
  {title:'Independence Palace',category:'Architecture',tagline:'A modern landmark shaped by Vietnamese identity',description:'Discover the modernist design by architect Ngô Viết Thụ, completed in 1966.',image:'assets/architecture/independence-palace.jpg',url:'architecture.html#independence',keywords:'independence palace reunification palace ngo viet thu modernist architecture saigon'},
];

function renderResults(query = '') {
  const raw = query.trim();
  const term = normalise(raw);
  const filtered = term ? searchItems.filter(item => {
    const haystack = normalise(`${item.title} ${item.category} ${item.tagline} ${item.description} ${item.keywords}`);
    return haystack.includes(term) || term.split(' ').every(word => haystack.includes(word));
  }) : [];

  resultTitle.textContent = raw ? `Search results for “${raw}”` : 'Explore the collections';
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'RESULT' : 'RESULTS'}`;
  resultsContainer.innerHTML = filtered.map(item => `
    <article class="search-item-card">
      <a class="search-item-image" href="${escapeHTML(item.url)}"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy"></a>
      <div class="search-item-copy"><span class="search-item-category">${escapeHTML(item.category)}</span><h3>${escapeHTML(item.title)}</h3><p class="search-item-tagline">${escapeHTML(item.tagline)}</p><p>${escapeHTML(item.description)}</p><button class="item-save-button" type="button" data-save="search-${normalise(item.title).replace(/\s+/g, '-')}" data-save-name="${escapeHTML(item.title)}" data-save-category="${escapeHTML(item.category)}" data-save-tagline="${escapeHTML(item.tagline)}" data-save-image="${escapeHTML(item.image)}" data-save-url="${escapeHTML(item.url)}" aria-pressed="false">♡ <span>Save</span></button></div>
      <a class="search-item-view" href="${escapeHTML(item.url)}">EXPLORE <span>→</span></a>
    </article>`).join('');
  emptyMessage.classList.toggle('hidden', !raw || filtered.length !== 0);
  resultsContainer.classList.toggle('hidden', filtered.length === 0);
  if (!raw) {
    emptyMessage.classList.add('hidden');
    resultsContainer.innerHTML = '<p class="search-prompt">Enter a name, place, dish or tradition to discover matching content across all six collections.</p>';
  }
}

document.getElementById('search-form').addEventListener('submit', event => {
  event.preventDefault();
  renderResults(searchInput.value);
});
document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
  searchInput.value = button.dataset.query;
  renderResults(button.dataset.query);
}));
searchInput.addEventListener('input', () => renderResults(searchInput.value));
const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
searchInput.value = initialQuery;
renderResults(initialQuery);
