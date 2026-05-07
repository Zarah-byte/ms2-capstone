"use strict";

const STORAGE_KEY = "living-archive-static-flow";
const screens = {
  name: document.getElementById("name-screen"),
  email: document.getElementById("email-screen"),
  family: document.getElementById("family-screen"),
  pin: document.getElementById("pin-screen"),
  dashboard: document.getElementById("dashboard"),
};

const state = loadState();
const tree = {
  pan: { x: 0, y: 0 },
  scale: 1,
  nodes: [],
  anchors: [],
  links: [],
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState(nextState) {
  Object.assign(state, nextState);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage is optional for this prototype.
  }
}

function showScreen(next) {
  Object.values(screens).forEach((screen) => {
    screen.classList.add("screen--hidden");
    screen.classList.remove("screen--out");
  });
  screens[next].classList.remove("screen--hidden");
}

function markError(input) {
  const wrap = input.closest(".pill-input-wrap");
  if (!wrap) return;
  wrap.classList.add("error");
  input.focus();
}

function clearError(input) {
  const wrap = input.closest(".pill-input-wrap");
  if (wrap) wrap.classList.remove("error");
}

function setNames() {
  const name = state.name || "there";
  document.getElementById("email-screen-name").textContent = name;
  document.getElementById("family-screen-name").textContent = name;
  document.getElementById("pin-screen-name").textContent = name;
  const selfNode = tree.nodes.find((node) => node.id === "self");
  if (selfNode) selfNode.label = state.name || "name";
}

function enterDashboard() {
  setNames();
  showScreen("dashboard");
  initTree();
  document.getElementById("bottom-bar").classList.add("visible");
}

document.getElementById("name-input").value = state.name || "";
document.getElementById("email-input").value = state.email || "";
document.getElementById("pin-input").value = state.pin || "";
setNames();

document.querySelectorAll(".pill-input").forEach((input) => {
  input.addEventListener("input", () => clearError(input));
});

document.getElementById("name-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("name-input");
  const name = input.value.trim();
  if (!name) return markError(input);
  saveState({ name });
  setNames();
  showScreen("email");
});

document.getElementById("email-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("email-input");
  const email = input.value.trim();
  if (!email || !input.validity.valid) return markError(input);
  saveState({ email });
  showScreen("family");
});

document.getElementById("find-btn").addEventListener("click", () => {
  showScreen("pin");
});

document.getElementById("build-tree-btn").addEventListener("click", () => {
  saveState({ pin: "new-tree" });
  enterDashboard();
});

document.getElementById("pin-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("pin-input");
  const pin = input.value.trim();
  if (!pin) return markError(input);
  saveState({ pin });
  enterDashboard();
});

document.getElementById("email-back-btn").addEventListener("click", () => showScreen("name"));
document.getElementById("pin-back-btn").addEventListener("click", () => showScreen("family"));

const treeWorld = document.getElementById("tree-world");
const treeSvg = document.getElementById("tree-svg");
const relationshipLayer = document.getElementById("relationship-layer");
const nodeLayer = document.getElementById("node-layer");

function initTree() {
  positionTreeNodes();
  tree.pan = { x: 0, y: 0 };
  tree.scale = 1;
  renderTree();
  renderRelationshipLayer();
  renderNodeLayer();
  applyTreeTransform();
}

function positionTreeNodes() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  tree.nodes = [
    { id: "left", x: width * 0.12, y: height * 0.36, label: "name", kind: "person" },
    { id: "top", x: width * 0.34, y: height * 0.08, label: "name", kind: "person" },
    { id: "self", x: width * 0.5, y: height * 0.48, label: state.name || "name", kind: "person" },
    { id: "bottom", x: width * 0.2, y: height * 0.85, label: "name", kind: "person" },
  ];

  tree.anchors = [
    { id: "rightJunction", x: width * 0.62, y: height * 0.34 },
    { id: "topOffscreen", x: width * 0.8, y: height * -0.08 },
    { id: "rightOffscreen", x: width * 1.16, y: height * 0.34 },
    { id: "bottomRightOffscreen", x: width * 0.86, y: height * 1.12 },
  ];

  tree.links = [
    ["left", "top"],
    ["left", "bottom"],
    ["top", "self"],
    ["bottom", "self"],
    ["self", "rightJunction"],
    ["rightJunction", "topOffscreen"],
    ["rightJunction", "rightOffscreen"],
    ["self", "bottomRightOffscreen"],
  ];
}

function applyTreeTransform() {
  treeWorld.style.transform = `translate(${tree.pan.x}px, ${tree.pan.y}px) scale(${tree.scale})`;
}

function renderTree() {
  treeSvg.innerHTML = "";
  treeSvg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
  treeSvg.setAttribute("preserveAspectRatio", "none");
}

function renderRelationshipLayer() {
  relationshipLayer.innerHTML = "";

  tree.links.forEach(([fromId, toId]) => {
    const from = getTreePoint(fromId);
    const to = getTreePoint(toId);
    if (!from || !to) return;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const line = document.createElement("span");
    line.className = "relationship-line";
    line.style.width = `${length}px`;
    line.style.transform = `translate(${from.x}px, ${from.y}px) rotate(${angle}deg)`;
    relationshipLayer.appendChild(line);
  });
}

function getTreePoint(id) {
  return tree.nodes.find((node) => node.id === id) || tree.anchors.find((anchor) => anchor.id === id);
}

function renderNodeLayer() {
  nodeLayer.innerHTML = "";

  tree.nodes.forEach((node) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `person-node${node.id === "self" ? " person-node--self" : ""}`;
    button.setAttribute("aria-label", node.label);
    button.style.left = `${node.x}px`;
    button.style.top = `${node.y}px`;
    button.innerHTML = "<span></span>";
    button.querySelector("span").textContent = node.label;
    nodeLayer.appendChild(button);
  });
}

const pointers = new Map();
let dragStart = null;
let panStart = null;
let pinchDistance = 0;

screens.dashboard.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, input, .modal-backdrop")) return;
  screens.dashboard.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (pointers.size === 1) {
    dragStart = { x: event.clientX, y: event.clientY };
    panStart = { ...tree.pan };
    screens.dashboard.classList.add("dragging");
  }

  if (pointers.size === 2) {
    pinchDistance = getPinchDistance();
  }
});

screens.dashboard.addEventListener("pointermove", (event) => {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (pointers.size === 1 && dragStart && panStart) {
    tree.pan.x = panStart.x + event.clientX - dragStart.x;
    tree.pan.y = panStart.y + event.clientY - dragStart.y;
    applyTreeTransform();
  }

  if (pointers.size === 2) {
    const nextDistance = getPinchDistance();
    if (pinchDistance > 0) {
      tree.scale = Math.min(2.8, Math.max(0.35, tree.scale * (nextDistance / pinchDistance)));
      applyTreeTransform();
    }
    pinchDistance = nextDistance;
  }
});

function releasePointer(event) {
  pointers.delete(event.pointerId);
  if (pointers.size === 0) {
    dragStart = null;
    panStart = null;
    pinchDistance = 0;
    screens.dashboard.classList.remove("dragging");
  }
}

screens.dashboard.addEventListener("pointerup", releasePointer);
screens.dashboard.addEventListener("pointercancel", releasePointer);

screens.dashboard.addEventListener("wheel", (event) => {
  event.preventDefault();
  const factor = Math.exp(-event.deltaY * 0.001);
  tree.scale = Math.min(2.8, Math.max(0.35, tree.scale * factor));
  applyTreeTransform();
}, { passive: false });

function getPinchDistance() {
  const [a, b] = [...pointers.values()];
  if (!a || !b) return 0;
  return Math.hypot(b.x - a.x, b.y - a.y);
}

const addBtn = document.getElementById("add-btn");
const actionRow = document.getElementById("action-row");
const modal = document.getElementById("member-modal");

addBtn.addEventListener("click", () => {
  const open = addBtn.getAttribute("aria-expanded") === "true";
  addBtn.setAttribute("aria-expanded", String(!open));
  actionRow.classList.toggle("open", !open);
  actionRow.setAttribute("aria-hidden", String(open));
});

document.querySelector('[aria-label="Add member"]').addEventListener("click", () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.getElementById("member-name").focus();
});

document.getElementById("modal-close-btn").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("member-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("member-name").value.trim();
  const relationship = document.getElementById("member-relationship").value.trim();
  if (!name || !relationship) return;

  const id = `member-${Date.now()}`;
  const angle = Math.PI + (tree.nodes.length - 3) * 0.52;
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.34;
  const self = getTreePoint("self");
  tree.nodes.push({
    id,
    x: self.x + Math.cos(angle) * radius,
    y: self.y + Math.sin(angle) * radius,
    label: name,
    kind: "person",
  });
  tree.links.push(["self", id]);
  renderTree();
  renderRelationshipLayer();
  renderNodeLayer();
  closeModal();
  event.target.reset();
});

window.addEventListener("resize", () => {
  if (!screens.dashboard.classList.contains("screen--hidden")) initTree();
});

if (state.name && state.email && state.pin) {
  enterDashboard();
} else if (state.name && state.email) {
  showScreen("family");
} else if (state.name) {
  showScreen("email");
} else {
  showScreen("name");
}
