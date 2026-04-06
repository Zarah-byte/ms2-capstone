/* ═══════════════════════════════════════════════════════════════
   src/panel.js — Story side drawer
   Handles opening/closing the right-side panel, rendering the
   story list for a selected person, and the "Add story" form.
   ═══════════════════════════════════════════════════════════════ */

/* ── Module-level state ─────────────────────────────────────── */
let currentPersonId    = null;   // id of the person whose panel is open
let onSubmitCallback   = null;   // called when a story is saved

/* ── DOM references (resolved once in initPanel) ─────────────── */
let panelEl, overlayEl, nameEl, yearEl, listEl, formEl;

/**
 * initPanel()
 * Wires up close button, overlay, and form submit.
 * Must be called once after the DOM is ready.
 */
export function initPanel() {
  panelEl   = document.getElementById('story-panel');
  overlayEl = document.getElementById('panel-overlay');
  nameEl    = document.getElementById('panel-name');
  yearEl    = document.getElementById('panel-year');
  listEl    = document.getElementById('stories-list');
  formEl    = document.getElementById('add-story-form');

  document.getElementById('panel-close')
    .addEventListener('click', closePanel);

  overlayEl.addEventListener('click', closePanel);

  formEl.addEventListener('submit', handleFormSubmit);
}

/**
 * openPanel(person, onStorySaved)
 * Populates the panel with person data and slides it into view.
 *
 * @param {Object}   person       - the clicked person object
 * @param {Function} onStorySaved - called with (personId, story) after submit
 */
export function openPanel(person, onStorySaved) {
  currentPersonId  = person.id;
  onSubmitCallback = onStorySaved;

  // Fill header
  nameEl.textContent = person.name;
  yearEl.textContent = 'b. ' + person.birthYear;

  // Render stories
  renderStories(person.stories);

  // Reset the form (clear previous values)
  formEl.reset();

  // Open
  panelEl.classList.add('open');
  panelEl.setAttribute('aria-hidden', 'false');
  overlayEl.classList.add('visible');
}

/**
 * refreshPanelStories(stories)
 * Re-renders just the story list without re-opening the panel.
 * Called by main.js after a new story is saved.
 *
 * @param {Array} stories - the updated stories array
 */
export function refreshPanelStories(stories) {
  renderStories(stories);
}

/* ── Internal helpers ────────────────────────────────────────── */

function closePanel() {
  panelEl.classList.remove('open');
  panelEl.setAttribute('aria-hidden', 'true');
  overlayEl.classList.remove('visible');
}

/**
 * renderStories(stories)
 * Builds the list of .letter divs from the stories array.
 */
function renderStories(stories) {
  listEl.innerHTML = '';

  if (!stories || stories.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'no-stories';
    empty.textContent = 'No stories yet. Be the first to add one.';
    listEl.appendChild(empty);
    return;
  }

  stories.forEach(function(story) {
    const letter = document.createElement('div');
    letter.className = 'letter';

    // Title
    const titleEl = document.createElement('div');
    titleEl.className = 'letter-title';
    titleEl.textContent = story.title;
    letter.appendChild(titleEl);

    // Era (optional)
    if (story.era) {
      const eraEl = document.createElement('div');
      eraEl.className = 'letter-era';
      eraEl.textContent = story.era;
      letter.appendChild(eraEl);
    }

    // Body
    const bodyEl = document.createElement('div');
    bodyEl.className = 'letter-body';
    bodyEl.textContent = story.body;
    letter.appendChild(bodyEl);

    // Contributor (optional)
    if (story.contributor) {
      const contribEl = document.createElement('div');
      contribEl.className = 'letter-contributor';
      contribEl.textContent = '— ' + story.contributor;
      letter.appendChild(contribEl);
    }

    listEl.appendChild(letter);
  });
}

/**
 * handleFormSubmit(e)
 * Reads the form fields, builds a story object, and fires
 * the onSubmitCallback so main.js can persist it.
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const title       = document.getElementById('story-title').value.trim();
  const body        = document.getElementById('story-body').value.trim();
  const era         = document.getElementById('story-era').value;
  const contributor = document.getElementById('story-contributor').value.trim();

  // Simple validation — title and body are required
  if (!title || !body) return;

  const story = {
    id:          'story-' + Date.now(),
    title:       title,
    body:        body,
    era:         era,
    contributor: contributor,
  };

  if (onSubmitCallback) {
    onSubmitCallback(currentPersonId, story);
  }

  // Clear the form for the next entry
  formEl.reset();
}
