/* ═══════════════════════════════════════════════════════════════
   src/tree.js — D3 family tree canvas
   Renders a vertical tree layout where each node is a
   <foreignObject> containing a .person-card div.
   D3 is imported as an ES module directly from the CDN.
   ═══════════════════════════════════════════════════════════════ */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

/* ── Node dimensions (must match .person-card CSS) ── */
const NODE_W  = 160;
const NODE_H  = 110;
const MARGIN  = 48;    // padding around the whole tree
const SEP_X   = 200;   // horizontal gap between node centres
const SEP_Y   = 170;   // vertical gap between generations

/**
 * renderTree(container, people, onNodeClick)
 *
 * @param {HTMLElement} container  - the #tree-container div
 * @param {Array}       people     - flat people array from data/storage
 * @param {Function}    onNodeClick - called with the person object on click
 */
export function renderTree(container, people, onNodeClick) {

  /* 1 ─ Build hierarchy from the flat people array ───────────── */
  // d3.stratify reads id + parentId to construct a tree object.
  const stratify = d3.stratify()
    .id(d => d.id)
    .parentId(d => d.parentId);

  const root = stratify(people);

  /* 2 ─ Compute tree layout ──────────────────────────────────── */
  // nodeSize([dx, dy]) fixes each node to a constant cell size.
  // The resulting d.x / d.y are the centre-x and top-y of each node.
  const layout = d3.tree().nodeSize([SEP_X, SEP_Y]);
  layout(root);

  /* 3 ─ Find bounding box so we can size the SVG correctly ───── */
  let xMin = Infinity, xMax = -Infinity;
  let yMin = Infinity, yMax = -Infinity;

  root.each(function(d) {
    if (d.x < xMin) xMin = d.x;
    if (d.x > xMax) xMax = d.x;
    if (d.y < yMin) yMin = d.y;
    if (d.y > yMax) yMax = d.y;
  });

  const svgW = (xMax - xMin) + NODE_W + MARGIN * 2;
  const svgH = (yMax - yMin) + NODE_H + MARGIN * 2;

  // Translate so the leftmost node edge lands at MARGIN
  const tx = -xMin + MARGIN + NODE_W / 2;
  const ty = -yMin + MARGIN;

  /* 4 ─ Create SVG ───────────────────────────────────────────── */
  const svg = d3.select(container)
    .append('svg')
    .attr('width',  svgW)
    .attr('height', svgH);

  const g = svg.append('g')
    .attr('transform', `translate(${tx}, ${ty})`);

  /* 5 ─ Draw connector lines ─────────────────────────────────── */
  // Cubic Bézier from bottom-centre of parent to top-centre of child.
  g.selectAll('.link')
    .data(root.links())
    .join('path')
    .attr('class', 'link')
    .attr('d', function(d) {
      const sx  = d.source.x;
      const sy  = d.source.y + NODE_H;   // bottom of parent card
      const tx2 = d.target.x;
      const ty2 = d.target.y;            // top of child card
      const mid = (sy + ty2) / 2;
      return `M${sx},${sy} C${sx},${mid} ${tx2},${mid} ${tx2},${ty2}`;
    });

  /* 6 ─ Draw person nodes ─────────────────────────────────────── */
  // Each node is a <g> translated so its top-left is at (d.x - NODE_W/2, d.y).
  const node = g.selectAll('.node')
    .data(root.descendants())
    .join('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x - NODE_W / 2}, ${d.y})`);

  // Append a <foreignObject> and inject the .person-card HTML inside it.
  // We use the XHTML namespace so the browser renders it as HTML.
  node.append('foreignObject')
    .attr('width',  NODE_W)
    .attr('height', NODE_H)
    .each(function(d) {
      /* Build the card's DOM nodes manually (avoids innerHTML in SVG context) */
      const card = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      card.className = 'person-card';

      const nameEl = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      nameEl.className = 'person-name';
      nameEl.textContent = d.data.name;

      const yearEl = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      yearEl.className = 'person-year';
      yearEl.textContent = 'b. ' + d.data.birthYear;

      const count = d.data.stories.length;
      const badge = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      badge.className = 'story-badge';
      badge.textContent = count + (count === 1 ? ' story' : ' stories');

      card.appendChild(nameEl);
      card.appendChild(yearEl);
      card.appendChild(badge);

      // Click opens the story drawer
      card.addEventListener('click', function() {
        onNodeClick(d.data);
      });

      this.appendChild(card);
    });
}
