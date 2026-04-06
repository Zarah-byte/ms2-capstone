/* ═══════════════════════════════════════════════════════════════
   src/main.js — Entry point
   Imports all modules, wires them together, and starts the app.
   ═══════════════════════════════════════════════════════════════ */

import { people as seedData }           from './data.js';
import { loadPeople, addStory }         from './storage.js';
import { renderTree }                   from './tree.js';
import { initPanel, openPanel, refreshPanelStories } from './panel.js';

/* ── Live people array ──────────────────────────────────────── */
// Loaded from localStorage on startup; falls back to seed data.
let people = loadPeople(seedData);

/* ── Container reference ────────────────────────────────────── */
const container = document.getElementById('tree-container');

/* ── draw() ─────────────────────────────────────────────────── */
// Clears and re-renders the D3 tree from the current people array.
// Called on first load and again whenever a story is added
// (so badge counts stay in sync).
function draw() {
  container.innerHTML = '';
  renderTree(container, people, handleNodeClick);
}

/* ── handleNodeClick(person) ────────────────────────────────── */
// Called by tree.js when the user clicks a person card.
// Finds the freshest copy of the person in the people array
// (in case new stories were added) and opens the panel.
function handleNodeClick(person) {
  const current = people.find(function(p) {
    return p.id === person.id;
  });
  if (!current) return;

  openPanel(current, handleStorySaved);
}

/* ── handleStorySaved(personId, story) ──────────────────────── */
// Called by panel.js after the "Tuck in" form is submitted.
// Persists the story, updates the in-memory array, redraws the
// tree badges, and refreshes the panel's story list.
function handleStorySaved(personId, story) {
  people = addStory(people, personId, story);

  // Redraw so the badge count on the clicked node updates
  draw();

  // Update the panel list without closing/reopening it
  const updated = people.find(function(p) {
    return p.id === personId;
  });
  if (updated) {
    refreshPanelStories(updated.stories);
  }
}

/* ── Boot ───────────────────────────────────────────────────── */
initPanel();
draw();
