// Bootstrap: build the game, wire the start screen, and honour the
// ?shot= helper used to take the entry's screenshots (cover, level2,
// level3, win). The helper only reaches states a player can reach by
// playing — it calls the same startLevel/markFound code as real clicks.

import { LEVELS } from "./data.js";
import { SoundFX } from "./audio.js";
import { SpotGame } from "./game.js";

const sfx = new SoundFX();
const game = new SpotGame(document.getElementById("app"), sfx);

// Level cards on the start screen.
document.querySelectorAll(".level-card").forEach((card) => {
  const i = Number(card.dataset.level);
  card.querySelector(".card-name").textContent = LEVELS[i].name;
  card.querySelector(".card-tag").textContent = LEVELS[i].tagline;
});

const shot = new URLSearchParams(window.location.search).get("shot");
if (shot) {
  game.applyShot(shot);
}
