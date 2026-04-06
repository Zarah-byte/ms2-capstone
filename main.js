/* ═══════════════════════════════════════════════════════════════
   THE LIVING ARCHIVE — Onboarding Controller
   Vanilla JS only. No frameworks. No inline styles.
   State is a plain object; UI is driven entirely by class toggling.
   ═══════════════════════════════════════════════════════════════ */


/* ─── Configuration ─────────────────────────────────────────── */

const STORAGE_KEY  = 'living-archive-onboarding';
const TOTAL_STEPS  = 9;   // Steps 0–8

// The five steps that collect data — used to drive progress dots
// and decide when to show the progress nav.
const QUESTION_STEPS = [2, 3, 4, 5, 6];


/* ─── State ──────────────────────────────────────────────────── */
// Single source of truth. All form answers live here.
// Persisted to localStorage on every change.

let state = {
  step:      0,      // which step is currently active
  name:      '',
  archive:   '',
  preserve:  '',     // what they want to document
  audience:  '',     // who it's for
  firstStep: '',     // where they want to start
  completed: false,  // true once they click "Enter the archive"
};


/* ─── DOM References ─────────────────────────────────────────── */
// Grabbed once at startup — avoids repeated querySelector calls.

const onboardingEl   = document.getElementById('onboarding');
const dashboardEl    = document.getElementById('dashboard');
const allSteps       = document.querySelectorAll('.step');
const progressEl     = document.getElementById('progress');
const progressDots   = document.querySelectorAll('.progress-dot');


/* ══════════════════════════════════════════════════════════════
   CORE NAVIGATION
   ══════════════════════════════════════════════════════════════ */

/**
 * showStep(n)
 * Hides the current step and reveals step n.
 * Also updates the progress dots, dynamic copy, and localStorage.
 */
function showStep(n) {
  // Clamp to valid range
  n = Math.max(0, Math.min(n, TOTAL_STEPS - 1));

  // Hide every step
  allSteps.forEach(function(s) {
    s.classList.remove('active');
  });

  // Show the target step
  const target = document.getElementById('step-' + n);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update state and persist
  state.step = n;
  updateProgress(n);
  updateDynamicContent(n);
  saveState();
}

/**
 * goNext()
 * Validates the current step. If valid, collects its data and
 * advances to the next step.
 */
function goNext() {
  if (!validateStep(state.step)) return;
  collectStepData(state.step);
  showStep(state.step + 1);
}

/**
 * goBack()
 * Returns to the previous step. No validation needed.
 */
function goBack() {
  showStep(state.step - 1);
}


/* ══════════════════════════════════════════════════════════════
   VALIDATION
   ══════════════════════════════════════════════════════════════ */

/**
 * validateStep(n)
 * Checks whether the current step's requirements are met.
 * Shows an inline error if not. Returns true/false.
 */
function validateStep(n) {
  // Clear all errors before re-checking
  document.querySelectorAll('.form-error').forEach(function(el) {
    el.textContent = '';
  });

  switch (n) {

    case 2: {
      // Name must not be blank
      var val = document.getElementById('input-name').value.trim();
      if (!val) {
        showError('error-name', 'Please enter your first name.');
        return false;
      }
      state.name = val;
      return true;
    }

    case 3: {
      // Archive name must not be blank
      var val = document.getElementById('input-archive').value.trim();
      if (!val) {
        showError('error-archive', 'Please give your archive a name.');
        return false;
      }
      state.archive = val;
      return true;
    }

    case 4: {
      // A choice must be selected
      if (!state.preserve) {
        showError('error-preserve', 'Please choose one to continue.');
        return false;
      }
      return true;
    }

    case 5: {
      if (!state.audience) {
        showError('error-audience', 'Please choose one to continue.');
        return false;
      }
      return true;
    }

    case 6: {
      if (!state.firstStep) {
        showError('error-firstStep', 'Please choose one to continue.');
        return false;
      }
      return true;
    }

    default:
      return true;
  }
}

/**
 * showError(id, message)
 * Writes an error message into the element with the given id.
 */
function showError(id, message) {
  var el = document.getElementById(id);
  if (el) el.textContent = message;
}


/* ══════════════════════════════════════════════════════════════
   DATA COLLECTION
   ══════════════════════════════════════════════════════════════ */

/**
 * collectStepData(n)
 * Reads text inputs into state for steps that have them.
 * Choice steps (4–6) save directly in handleChoiceClick.
 */
function collectStepData(n) {
  if (n === 2) {
    state.name = document.getElementById('input-name').value.trim();
  }
  if (n === 3) {
    state.archive = document.getElementById('input-archive').value.trim();
  }
}


/* ══════════════════════════════════════════════════════════════
   PROGRESS INDICATOR
   ══════════════════════════════════════════════════════════════ */

/**
 * updateProgress(n)
 * Shows or hides the progress dots and marks the correct
 * dot as active / filled based on the current step.
 */
function updateProgress(n) {
  var isQuestionStep = QUESTION_STEPS.indexOf(n) !== -1;

  // Toggle visibility of the whole progress nav
  progressEl.classList.toggle('hidden', !isQuestionStep);

  if (!isQuestionStep) return;

  // Which question are we on? (0-indexed within QUESTION_STEPS)
  var idx = QUESTION_STEPS.indexOf(n);

  progressDots.forEach(function(dot, i) {
    // All dots up to and including current are "filled"
    dot.classList.toggle('filled', i <= idx);
    // Only the current dot gets the "active" (enlarged) style
    dot.classList.toggle('active', i === idx);
  });
}


/* ══════════════════════════════════════════════════════════════
   DYNAMIC CONTENT
   ══════════════════════════════════════════════════════════════ */

/**
 * updateDynamicContent(n)
 * Personalises copy and pre-fills inputs whenever the user
 * arrives at a step where their earlier answers are useful.
 */
function updateDynamicContent(n) {

  // Step 3: suggest an archive name based on what they told us
  if (n === 3) {
    var archiveInput = document.getElementById('input-archive');
    if (!state.archive && state.name) {
      archiveInput.placeholder = 'e.g. The ' + state.name + ' Family Archive';
    }
    if (state.archive) {
      archiveInput.value = state.archive; // restore saved value
    }
  }

  // Step 7: personalise "Hi [Name]" and build the summary card
  if (n === 7) {
    if (state.name) {
      document.getElementById('headline-hi').textContent = 'Hi ' + state.name;
    }
    renderSummary();
  }

  // Step 8: personalise the completion "Hi [Name]" headline
  if (n === 8 && state.name) {
    document.getElementById('headline-done').textContent = 'Hi ' + state.name;
    document.getElementById('body-done').innerHTML =
      'Your archive is ready.<br>Everything is waiting for you inside.';
  }
}

/**
 * renderSummary()
 * Builds the summary card HTML from the current state and
 * injects it into #summary-card.
 */
function renderSummary() {
  var card = document.getElementById('summary-card');
  if (!card) return;

  // Human-readable labels for each saved value
  var labels = {
    preserve: {
      stories: 'Stories & memories',
      people:  'People & relationships',
      photos:  'Photos & objects',
      all:     'All of these',
    },
    audience: {
      myself:  'Myself',
      family:  'My family, now',
      future:  'Future generations',
      all:     'All of the above',
    },
    firstStep: {
      person:  'Add a person',
      story:   'Write a story',
      photo:   'Upload a photo',
      explore: "I'll explore first",
    },
  };

  var rows = [
    { label: 'Your name',     value: state.name },
    { label: 'Archive name',  value: state.archive },
    { label: 'Focus',         value: labels.preserve[state.preserve]   || '—' },
    { label: 'Keeping for',   value: labels.audience[state.audience]   || '—' },
    { label: 'Starting with', value: labels.firstStep[state.firstStep] || '—' },
  ];

  // Build HTML — template literals kept simple for readability
  card.innerHTML = rows.map(function(row) {
    return (
      '<div class="summary-row">' +
        '<span class="summary-label">' + row.label + '</span>' +
        '<span class="summary-value">' + row.value + '</span>' +
      '</div>'
    );
  }).join('');
}


/* ══════════════════════════════════════════════════════════════
   CHOICE BUTTON INTERACTION
   ══════════════════════════════════════════════════════════════ */

/**
 * handleChoiceClick(e)
 * Event-delegated handler attached to the document.
 * Selects the clicked choice and deselects its siblings.
 */
function handleChoiceClick(e) {
  // Find the nearest button with data-field (the choice button)
  var btn = e.target.closest('[data-field]');
  if (!btn) return;

  var field = btn.dataset.field;   // e.g. "preserve"
  var value = btn.dataset.value;   // e.g. "stories"

  // Deselect all buttons in this group
  document.querySelectorAll('[data-field="' + field + '"]').forEach(function(b) {
    b.classList.remove('selected');
    b.setAttribute('aria-checked', 'false');
  });

  // Mark this button as selected
  btn.classList.add('selected');
  btn.setAttribute('aria-checked', 'true');

  // Save the chosen value into state
  state[field] = value;

  // Clear the error for this group if one was showing
  var errorEl = document.getElementById('error-' + field);
  if (errorEl) errorEl.textContent = '';

  saveState();
}


/* ══════════════════════════════════════════════════════════════
   COMPLETION
   ══════════════════════════════════════════════════════════════ */

/**
 * completeOnboarding()
 * Marks onboarding as done, saves state, then transitions to
 * the dashboard with a short CSS fade.
 */
function completeOnboarding() {
  state.completed = true;
  saveState();

  // Fade out the onboarding, then swap to dashboard
  onboardingEl.classList.add('is-exiting');

  setTimeout(function() {
    onboardingEl.classList.add('hidden');
    onboardingEl.classList.remove('is-exiting');

    dashboardEl.classList.remove('hidden');
  }, 280);

  // Personalise the dashboard
  if (state.name) {
    document.getElementById('dash-title').textContent =
      'Welcome home, ' + state.name + '.';
  }
  if (state.archive) {
    document.getElementById('dash-archive').textContent = state.archive;
  }
}

/**
 * resetOnboarding()
 * Clears localStorage and reloads the page from the top.
 * Used by the "Start over" link on the dashboard.
 */
function resetOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}


/* ══════════════════════════════════════════════════════════════
   PERSISTENCE
   ══════════════════════════════════════════════════════════════ */

/**
 * saveState()
 * Serialises state to localStorage. Wrapped in try/catch in case
 * localStorage is unavailable (private browsing, storage full, etc).
 */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Silently fail — onboarding still works, just won't persist
  }
}

/**
 * loadState()
 * Reads saved state from localStorage and restores the UI.
 * Returns true if valid saved state was found, false otherwise.
 */
function loadState() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    var parsed = JSON.parse(stored);

    // Copy every saved property into the live state object
    Object.assign(state, parsed);

    // If the user already completed onboarding, skip to dashboard
    if (state.completed) {
      onboardingEl.classList.add('hidden');
      dashboardEl.classList.remove('hidden');

      if (state.name)    document.getElementById('dash-title').textContent   = 'Welcome home, ' + state.name + '.';
      if (state.archive) document.getElementById('dash-archive').textContent = state.archive;

      return true;
    }

    // Restore any previously typed or selected values
    restoreFormValues();
    return true;

  } catch (err) {
    // Corrupt data — wipe it and start fresh
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

/**
 * restoreFormValues()
 * After loadState(), fills inputs and re-selects choice buttons
 * to match the saved state so the user can continue where they left off.
 */
function restoreFormValues() {
  // Text inputs
  var nameInput    = document.getElementById('input-name');
  var archiveInput = document.getElementById('input-archive');
  if (nameInput    && state.name)    nameInput.value    = state.name;
  if (archiveInput && state.archive) archiveInput.value = state.archive;

  // Choice buttons
  ['preserve', 'audience', 'firstStep'].forEach(function(field) {
    if (!state[field]) return;
    var btn = document.querySelector(
      '[data-field="' + field + '"][data-value="' + state[field] + '"]'
    );
    if (btn) {
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
    }
  });
}


/* ══════════════════════════════════════════════════════════════
   INITIALISATION
   ══════════════════════════════════════════════════════════════ */

/**
 * init()
 * Wires up all event listeners and loads any saved state.
 * Called once when the page loads.
 */
function init() {

  // ── Next buttons ────────────────────────────────────────────
  document.querySelectorAll('[data-next]').forEach(function(btn) {
    btn.addEventListener('click', goNext);
  });

  // ── Back buttons ────────────────────────────────────────────
  document.querySelectorAll('[data-back]').forEach(function(btn) {
    btn.addEventListener('click', goBack);
  });

  // ── Choice buttons (delegated to document) ──────────────────
  // We use delegation so we only need one listener for all steps.
  document.addEventListener('click', handleChoiceClick);

  // ── Enter key on text inputs ────────────────────────────────
  document.querySelectorAll('.form-input').forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') goNext();
    });
  });

  // ── "Enter the archive" button ──────────────────────────────
  var enterBtn = document.getElementById('btn-enter');
  if (enterBtn) enterBtn.addEventListener('click', completeOnboarding);

  // ── "Start over" link on dashboard ──────────────────────────
  var resetBtn = document.getElementById('btn-reset');
  if (resetBtn) resetBtn.addEventListener('click', resetOnboarding);

  // ── Restore saved progress ──────────────────────────────────
  var restored = loadState();

  // If nothing was saved (or state was corrupt), start at step 0.
  // Otherwise, jump to wherever they left off.
  if (!restored || state.completed) {
    // completed case is handled inside loadState() already
    if (!restored) showStep(0);
  } else {
    showStep(state.step || 0);
  }
}

// Kick everything off
init();
