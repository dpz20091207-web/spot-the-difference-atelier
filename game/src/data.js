// Level definitions for "Three Worlds — Spot the Difference".
// Every level is one hand-built scene shown twice, side by side, with
// exactly seven differences between the panels. Coordinates are in the
// 640 x 460 viewBox shared by both panels, so one (x, y, r) zone works
// for a click on either side. `label` is the text a hint shows.

export const PANEL_W = 640;
export const PANEL_H = 460;
export const DIFFS_PER_LEVEL = 7;

export const LEVELS = [
  {
    id: "market",
    name: "Neon Night Market",
    tagline: "Dusk over the old street — lanterns, noodles and one sleepy cat.",
    scene: "market",
    diffs: [
      { id: "lantern-color", x: 300, y: 118, r: 26, label: "One lantern changed colour" },
      { id: "cat-gone", x: 468, y: 358, r: 30, label: "Something small is missing from the crate" },
      { id: "dumpling-extra", x: 178, y: 298, r: 22, label: "Count the dumplings on the tray" },
      { id: "moon-shape", x: 558, y: 62, r: 28, label: "Look up at the moon" },
      { id: "window-dark", x: 82, y: 182, r: 24, label: "A window went dark" },
      { id: "balloon-gone", x: 122, y: 92, r: 26, label: "Something floated away" },
      { id: "hat-color", x: 338, y: 248, r: 24, label: "The vendor's hat changed" },
    ],
  },
  {
    id: "reef",
    name: "Coral Reef",
    tagline: "Sixty feet down — fish, coral and a treasure chest with a secret.",
    scene: "reef",
    diffs: [
      { id: "fish-color", x: 198, y: 148, r: 26, label: "One fish changed colour" },
      { id: "starfish-gone", x: 518, y: 398, r: 26, label: "Something vanished from the sand" },
      { id: "bubbles-extra", x: 382, y: 118, r: 24, label: "More bubbles near the diver" },
      { id: "coral-color", x: 118, y: 318, r: 28, label: "One coral changed colour" },
      { id: "chest-open", x: 298, y: 388, r: 30, label: "The treasure chest moved" },
      { id: "turtle-flip", x: 452, y: 218, r: 28, label: "The turtle turned around" },
      { id: "shell-gone", x: 92, y: 418, r: 22, label: "A shell is missing from the sand" },
    ],
  },
  {
    id: "station",
    name: "Orbital Station",
    tagline: "Two hundred miles up — Earth below, coffee floating free.",
    scene: "station",
    diffs: [
      { id: "ring-gone", x: 182, y: 138, r: 30, label: "The ringed planet lost something" },
      { id: "patch-color", x: 332, y: 198, r: 22, label: "The astronaut's patch changed" },
      { id: "button-red", x: 522, y: 298, r: 20, label: "One console button changed colour" },
      { id: "satellite-extra", x: 558, y: 98, r: 24, label: "Something new is flying past" },
      { id: "coffee-gone", x: 242, y: 298, r: 22, label: "The floating coffee is gone" },
      { id: "cloud-added", x: 482, y: 128, r: 26, label: "A cloud drifted over Earth" },
      { id: "plant-gone", x: 92, y: 378, r: 24, label: "The little plant disappeared" },
    ],
  },
];
