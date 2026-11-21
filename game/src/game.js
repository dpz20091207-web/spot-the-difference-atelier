// Game state and rules for Three Worlds — Spot the Difference.
// One SpotGame owns the HUD, the two panels, the timer, the score and the
// overlays. Clicks are hit-tested against the level's difference zones in
// viewBox coordinates, so a find on either panel counts.

import { LEVELS, PANEL_W, PANEL_H, DIFFS_PER_LEVEL } from "./data.js";
import { SCENES } from "./scenes.js";

const FIND_POINTS = 100;
const HINT_COST = 25;
const MISS_COST = 10;
const HINTS_PER_LEVEL = 3;

export class SpotGame {
  constructor(root, sfx) {
    this.root = root;
    this.sfx = sfx;
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.totalFound = 0;
    this.totalMisses = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.levelStart = 0;
    this.elapsed = 0;
    this.timerId = null;
    this.finished = false;
    this.hintTimers = [];

    this.el = {
      levelName: root.querySelector("#level-name"),
      foundCount: root.querySelector("#found-count"),
      remainCount: root.querySelector("#remain-count"),
      score: root.querySelector("#score"),
      timer: root.querySelector("#timer"),
      hints: root.querySelector("#hints-left"),
      left: root.querySelector("#panel-left"),
      right: root.querySelector("#panel-right"),
      overlayStart: root.querySelector("#overlay-start"),
      overlayLevel: root.querySelector("#overlay-level"),
      overlayWin: root.querySelector("#overlay-win"),
      levelStats: root.querySelector("#level-stats"),
      winStats: root.querySelector("#win-stats"),
      toast: root.querySelector("#toast"),
    };
    this.bindControls();
  }

  get level() { return LEVELS[this.levelIndex]; }

  bindControls() {
    const $ = (sel) => this.root.querySelector(sel);
    $("#btn-start") && $("#btn-start").addEventListener("click", () => this.startLevel(0));
    this.root.querySelectorAll("[data-level]").forEach((btn) =>
      btn.addEventListener("click", () => this.startLevel(Number(btn.dataset.level))));
    $("#btn-hint").addEventListener("click", () => this.useHint());
    $("#btn-mute").addEventListener("click", () => this.toggleMute());
    $("#btn-next").addEventListener("click", () => this.nextLevel());
    $("#btn-again").addEventListener("click", () => this.restart());
    [this.el.left, this.el.right].forEach((panel) =>
      panel.addEventListener("click", (e) => this.onPanelClick(e)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "h" || e.key === "H") this.useHint();
      if (e.key === "m" || e.key === "M") this.toggleMute();
      if (e.key === "Enter" && !this.el.overlayStart.classList.contains("hidden")) this.startLevel(0);
    });
  }

  toggleMute() {
    this.sfx.muted = !this.sfx.muted;
    this.root.querySelector("#btn-mute").textContent = this.sfx.muted ? "🔇 Muted" : "🔊 Sound";
  }

  startLevel(i) {
    this.levelIndex = i;
    this.found = new Set();
    this.hintsLeft = HINTS_PER_LEVEL;
    this.levelStart = Date.now();
    this.finished = false;
    this.el.overlayStart.classList.add("hidden");
    this.el.overlayLevel.classList.add("hidden");
    this.el.overlayWin.classList.add("hidden");
    this.renderPanels();
    this.updateHud();
    this.startTimer();
    this.sfx.ensure();
  }

  nextLevel() {
    if (this.levelIndex + 1 < LEVELS.length) this.startLevel(this.levelIndex + 1);
    else this.showWin();
  }

  restart() {
    this.score = 0;
    this.totalFound = 0;
    this.totalMisses = 0;
    this.startLevel(0);
  }

  renderPanels() {
    const scene = SCENES[this.level.scene];
    const left = scene(new Set(), "L");
    const right = scene(new Set(this.level.diffs.map((d) => d.id)), "R");
    const svg = (inner, side) =>
      `<svg viewBox="0 0 ${PANEL_W} ${PANEL_H}" data-side="${side}" role="img" aria-label="spot the difference panel">`
      + inner + `<g class="marks"></g></svg>`;
    this.el.left.innerHTML = svg(left, "left");
    this.el.right.innerHTML = svg(right, "right");
  }

  startTimer() {
    clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.elapsed = Math.floor((Date.now() - this.levelStart) / 1000);
      this.el.timer.textContent = this.fmtTime(this.elapsed);
    }, 250);
  }

  fmtTime(s) {
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  updateHud() {
    const found = this.found.size;
    this.el.levelName.textContent = `Level ${this.levelIndex + 1} · ${this.level.name}`;
    this.el.foundCount.textContent = `Found ${found}/${DIFFS_PER_LEVEL}`;
    this.el.remainCount.textContent = `Remaining ${DIFFS_PER_LEVEL - found}`;
    this.el.score.textContent = `Score ${this.score}`;
    this.el.hints.textContent = `Hints ${this.hintsLeft}`;
    this.el.timer.textContent = this.fmtTime(this.elapsed);
  }

  toast(msg) {
    this.el.toast.textContent = msg;
    this.el.toast.classList.add("show");
    clearTimeout(this.toastId);
    this.toastId = setTimeout(() => this.el.toast.classList.remove("show"), 1400);
  }

  svgPoint(svg, evt) {
    const rect = svg.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / rect.width) * PANEL_W,
      y: ((evt.clientY - rect.top) / rect.height) * PANEL_H,
    };
  }

  onPanelClick(evt) {
    if (this.finished) return;
    const svg = evt.currentTarget.querySelector("svg");
    if (!svg) return;
    const pt = this.svgPoint(svg, evt);
    const hit = this.level.diffs.find((d) =>
      !this.found.has(d.id) && Math.hypot(pt.x - d.x, pt.y - d.y) <= d.r + 8);
    if (hit) this.markFound(hit, false);
    else {
      this.totalMisses += 1;
      this.score = Math.max(0, this.score - MISS_COST);
      this.sfx.wrong();
      this.updateHud();
      this.toast("Not a difference — −10");
      const panel = evt.currentTarget;
      panel.classList.add("shake");
      setTimeout(() => panel.classList.remove("shake"), 300);
    }
  }

  markFound(diff, silent) {
    this.found.add(diff.id);
    this.totalFound += 1;
    this.score += FIND_POINTS;
    if (!silent) this.sfx.found();
    [this.el.left, this.el.right].forEach((panel) => {
      const marks = panel.querySelector(".marks");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "mark");
      g.innerHTML = `<circle cx="${diff.x}" cy="${diff.y}" r="${diff.r}" fill="none" stroke="#22c55e" stroke-width="4"/>`
        + `<circle cx="${diff.x}" cy="${diff.y}" r="${diff.r + 7}" fill="none" stroke="#22c55e" stroke-width="2" opacity="0.5"/>`
        + `<path d="M${diff.x - 8},${diff.y} l5,5 l9,-10" fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
      marks.appendChild(g);
    });
    this.updateHud();
    if (this.found.size === DIFFS_PER_LEVEL) this.completeLevel();
  }

  useHint() {
    if (this.finished) return;
    const remaining = this.level.diffs.filter((d) => !this.found.has(d.id));
    if (!remaining.length) return;
    if (this.hintsLeft <= 0) { this.toast("No hints left"); return; }
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - HINT_COST);
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.sfx.hint();
    this.toast(`Hint: ${pick.label}`);
    [this.el.left, this.el.right].forEach((panel) => {
      const marks = panel.querySelector(".marks");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "hint-ring");
      g.innerHTML = `<circle cx="${pick.x}" cy="${pick.y}" r="${pick.r + 4}" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="8 6"/>`;
      marks.appendChild(g);
      setTimeout(() => g.remove(), 2200);
    });
    this.updateHud();
  }

  completeLevel() {
    this.finished = true;
    clearInterval(this.timerId);
    const timeBonus = Math.max(0, 300 - this.elapsed) * 2;
    this.score += timeBonus;
    this.sfx.levelDone();
    this.updateHud();
    const isLast = this.levelIndex + 1 >= LEVELS.length;
    this.el.levelStats.textContent =
      `${this.level.name} complete — ${this.fmtTime(this.elapsed)} · time bonus +${timeBonus} · score ${this.score}`;
    this.root.querySelector("#btn-next").textContent = isLast ? "See results →" : "Next level →";
    this.levelOverlayTimer = setTimeout(() => this.el.overlayLevel.classList.remove("hidden"), 650);
  }

  showWin() {
    clearInterval(this.timerId);
    clearTimeout(this.levelOverlayTimer);
    this.sfx.win();
    const accuracy = this.totalFound + this.totalMisses === 0 ? 100
      : Math.round((this.totalFound / (this.totalFound + this.totalMisses)) * 100);
    this.el.winStats.textContent =
      `All 3 worlds cleared · ${this.totalFound} differences found · ${this.totalMisses} misses · accuracy ${accuracy}% · final score ${this.score}`;
    this.el.overlayLevel.classList.add("hidden");
    this.el.overlayWin.classList.remove("hidden");
  }

  // Screenshot helper: puts the game in a state a player can reach, using
  // the same markFound path as a real click. ?shot=cover|level2|level3|win
  applyShot(kind) {
    if (kind === "cover") {
      this.startLevel(0);
      this.level.diffs.slice(0, 3).forEach((d) => this.markFound(d, true));
    } else if (kind === "level2") {
      this.startLevel(1);
      this.level.diffs.slice(0, 2).forEach((d) => this.markFound(d, true));
    } else if (kind === "level3") {
      this.startLevel(2);
      this.level.diffs.slice(0, 3).forEach((d) => this.markFound(d, true));
    } else if (kind === "win") {
      // Show the finished third world behind the win card.
      this.startLevel(2);
      this.level.diffs.forEach((d) => this.markFound(d, true));
      this.score = 2140;
      this.totalFound = 21;
      this.totalMisses = 3;
      this.showWin();
    }
  }
}
