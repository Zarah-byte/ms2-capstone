/* ═══════════════════════════════════════════════════════════════
   src/storage.js — localStorage read / write
   All persistence goes through these three functions so the
   rest of the app never touches localStorage directly.
   ═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'living-archive-people';

/**
 * loadPeople(seedData)
 * Returns the people array from localStorage if one exists and
 * is valid; otherwise returns the seed data unchanged.
 */
export function loadPeople(seedData) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return seedData;

    const parsed = JSON.parse(stored);

    // Basic sanity check — must be a non-empty array
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return seedData;
  } catch {
    // JSON.parse failed — corrupt data, fall back to seed
    localStorage.removeItem(STORAGE_KEY);
    return seedData;
  }
}

/**
 * savePeople(people)
 * Serialises the full people array to localStorage.
 */
export function savePeople(people) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  } catch {
    // localStorage unavailable (private mode, quota exceeded, etc.)
    // The app keeps working; stories just won't persist.
  }
}

/**
 * addStory(people, personId, story)
 * Returns a new people array with the story appended to the
 * correct person, and immediately persists it to localStorage.
 *
 * Does NOT mutate the original array.
 */
export function addStory(people, personId, story) {
  const updated = people.map(function(person) {
    if (person.id !== personId) return person;
    // Spread to avoid mutating the original object
    return {
      ...person,
      stories: [...person.stories, story],
    };
  });

  savePeople(updated);
  return updated;
}
