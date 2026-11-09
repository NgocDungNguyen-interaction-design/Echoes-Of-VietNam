const params = new URLSearchParams(window.location.search);
const story = window.ECHOES_STORIES[params.get("id")];
const titleEl = document.getElementById("reader-title");
const subtitleEl = document.getElementById("reader-subtitle");
const numberEl = document.getElementById("reader-number");
const sectionLabelEl = document.getElementById("reader-section-label");
const counterEl = document.getElementById("reader-counter");
const progressEl = document.getElementById("reader-progress-fill");
const textEl = document.getElementById("reader-text");
const messageEl = document.getElementById("reader-message");
const nextButton = document.getElementById("reader-next");
const finishLink = document.getElementById("reader-finish");
const hintEl = document.getElementById("reader-hint");

if (!story) {
  window.location.replace("stories.html");
} else {
  document.title = `${story.title} — Echoes of Vietnam`;
  titleEl.textContent = story.title;
  const readerSave = document.getElementById("reader-save");
  if (readerSave) {
    readerSave.dataset.save = `story-${params.get("id")}`;
    readerSave.dataset.saveName = story.title;
    readerSave.dataset.saveCategory = "Stories";
    readerSave.dataset.saveTagline = story.subtitle || "A traditional Vietnamese story";
    readerSave.dataset.saveImage = "assets/card-stories.png";
    readerSave.dataset.saveUrl = `story-reader.html?id=${params.get("id")}`;
  }
  subtitleEl.textContent = story.subtitle;
  numberEl.textContent = story.number;

  const sequence = [];
  story.sections.forEach(section => {
    section.passages.forEach((passage, index) => {
      sequence.push({ section: section.title, text: passage, first: index === 0 });
    });
  });

  let current = 0;
  function renderPassage() {
    const item = sequence[current];
    sectionLabelEl.textContent = item.section;
    counterEl.textContent = `${String(current + 1).padStart(2, "0")} / ${String(sequence.length).padStart(2, "0")}`;
    textEl.textContent = item.text;
    progressEl.style.width = `${((current + 1) / sequence.length) * 100}%`;
    messageEl.classList.remove("message-enter");
    void messageEl.offsetWidth;
    messageEl.classList.add("message-enter");
    const isLast = current === sequence.length - 1;
    nextButton.classList.toggle("hidden", isLast);
    finishLink.classList.toggle("hidden", !isLast);
    hintEl.textContent = isLast ? "YOU HAVE REACHED THE END" : "TAP THE PASSAGE OR CONTINUE";
  }

  function nextPassage() {
    if (current < sequence.length - 1) {
      current += 1;
      renderPassage();
    }
  }

  nextButton.addEventListener("click", nextPassage);
  messageEl.addEventListener("click", nextPassage);
  messageEl.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      nextPassage();
    }
  });
  renderPassage();
  if (typeof syncSaveButtons === "function") syncSaveButtons();
}
