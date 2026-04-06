/* ═══════════════════════════════════════════════════════════════
   src/data.js — Seed data
   Six people across three generations of the Chen family.
   Each person has an id, name, birthYear, parentId (for the D3
   hierarchy), photoUrl, and an array of stories.

   parentId is null for the root (Harold). Everyone else points
   to their parent's id. D3's stratify() converts this flat list
   into a hierarchy automatically.
   ═══════════════════════════════════════════════════════════════ */

export const people = [

  /* ── Generation 1 ── */
  {
    id: 'harold',
    name: 'Harold Chen',
    birthYear: 1918,
    parentId: null,        // root of the tree
    photoUrl: null,
    stories: [
      {
        id: 'harold-1',
        title: 'The Journey from Guangzhou',
        body: 'He never spoke of the crossing. We found the ticket stub in the lining of his coat, folded so many times the crease had become the paper.',
        era: '1930s',
        contributor: 'Ruth Chen',
      },
      {
        id: 'harold-2',
        title: 'The Laundry on Mott Street',
        body: 'Six days a week, fourteen hours a day. On Sundays he read. We were not allowed to interrupt the reading.',
        era: '1940s',
        contributor: 'James Chen',
      },
    ],
  },

  /* ── Generation 2 ── */
  {
    id: 'ruth',
    name: 'Ruth Chen',
    birthYear: 1945,
    parentId: 'harold',
    photoUrl: null,
    stories: [
      {
        id: 'ruth-1',
        title: 'Berkeley, 1963',
        body: 'She kept the pamphlets under her mattress. My grandmother found them and didn\'t say a word. She just slid them back.',
        era: '1960s',
        contributor: 'Lily Webb',
      },
      {
        id: 'ruth-2',
        title: 'The Piano That Nobody Played',
        body: 'It sat in the parlor for thirty years. After she died we found sheet music tucked behind the fallboard — all in her handwriting.',
        era: '1980s',
        contributor: 'Lily Webb',
      },
      {
        id: 'ruth-3',
        title: 'Letters Never Sent',
        body: 'A bundle of twelve letters, addressed to someone named M.V. in Portland. The stamps were never canceled.',
        era: '1970s',
        contributor: 'Daniel Chen',
      },
    ],
  },
  {
    id: 'james',
    name: 'James Chen',
    birthYear: 1948,
    parentId: 'harold',
    photoUrl: null,
    stories: [
      {
        id: 'james-1',
        title: 'The Fishing Trips',
        body: 'He drove four hours each way. We never caught anything. I think that was the point.',
        era: '1970s',
        contributor: 'Daniel Chen',
      },
    ],
  },
  {
    id: 'clara',
    name: 'Clara Chen',
    birthYear: 1951,
    parentId: 'harold',
    photoUrl: null,
    stories: [
      {
        id: 'clara-1',
        title: 'The Red Dress',
        body: 'There is a photograph. She is laughing at something outside the frame. The dress was apparently a scandal at the time.',
        era: '1960s',
        contributor: 'Lily Webb',
      },
    ],
  },

  /* ── Generation 3 ── */
  {
    id: 'lily',
    name: 'Lily Webb',
    birthYear: 1972,
    parentId: 'ruth',
    photoUrl: null,
    stories: [
      {
        id: 'lily-1',
        title: 'What I Inherited',
        body: 'A cast iron pan. A tendency toward silence. An inability to throw anything away.',
        era: '2000s',
        contributor: 'Lily Webb',
      },
    ],
  },
  {
    id: 'daniel',
    name: 'Daniel Chen',
    birthYear: 1975,
    parentId: 'james',
    photoUrl: null,
    stories: [
      {
        id: 'daniel-1',
        title: 'The Apartment on Canal',
        body: 'We found two leases in his name for the same year. Two apartments, two neighbourhoods, two sets of neighbours who remembered him fondly. We still don\'t know.',
        era: '1990s',
        contributor: 'Daniel Chen',
      },
    ],
  },

];
