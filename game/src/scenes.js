// Hand-built SVG scenes. Each builder takes a Set of active difference ids
// and a prefix `p` for def ids (the two panels share one document, so ids
// must not collide). The left panel renders with an empty set, the right
// panel with all seven ids of its level. Everything is drawn in code — no
// images, no external files, no network.

const has = (diffs, id) => diffs.has(id);

function starField(points) {
  return points.map(([x, y, r, o]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${o}"/>`).join("");
}

function fish(x, y, s, color, flip) {
  const dir = flip ? -1 : 1;
  return `<g transform="translate(${x} ${y}) scale(${dir * s} ${s})">`
    + `<polygon points="-13,0 -23,-8 -23,8" fill="${color}"/>`
    + `<ellipse rx="16" ry="9" fill="${color}"/>`
    + `<path d="M-2,-8 Q2,-14 8,-8" stroke="${color}" stroke-width="3" fill="none"/>`
    + `<circle cx="8" cy="-2" r="2.2" fill="#10202e"/>`
    + `<circle cx="8.8" cy="-2.8" r="0.8" fill="#ffffff"/>`
    + `</g>`;
}

function lantern(x, y, color) {
  return `<g>`
    + `<line x1="${x}" y1="${y - 26}" x2="${x}" y2="${y - 14}" stroke="#8a6d3b" stroke-width="2"/>`
    + `<rect x="${x - 6}" y="${y - 18}" width="12" height="5" rx="2" fill="#7a4a21"/>`
    + `<rect x="${x - 13}" y="${y - 13}" width="26" height="28" rx="11" fill="${color}"/>`
    + `<line x1="${x - 13}" y1="${y + 1}" x2="${x + 13}" y2="${y + 1}" stroke="#00000033" stroke-width="2"/>`
    + `<line x1="${x - 9}" y1="${y - 10}" x2="${x - 9}" y2="${y + 12}" stroke="#00000022" stroke-width="2"/>`
    + `<line x1="${x + 9}" y1="${y - 10}" x2="${x + 9}" y2="${y + 12}" stroke="#00000022" stroke-width="2"/>`
    + `<rect x="${x - 6}" y="${y + 15}" width="12" height="4" rx="2" fill="#7a4a21"/>`
    + `<line x1="${x}" y1="${y + 19}" x2="${x}" y2="${y + 27}" stroke="#ffd166" stroke-width="2"/>`
    + `</g>`;
}

function buildMarket(diffs, p) {
  const moon = has(diffs, "moon-shape")
    ? `<circle cx="558" cy="62" r="26" fill="#f5e9c8"/>`
      + `<circle cx="550" cy="56" r="5" fill="#e0cfa0"/><circle cx="566" cy="70" r="4" fill="#e0cfa0"/>`
      + `<polygon points="606,34 608,40 614,40 609,44 611,50 606,46 601,50 603,44 598,40 604,40" fill="#ffd166"/>`
    : `<circle cx="558" cy="62" r="26" fill="#f5e9c8"/>`
      + `<circle cx="570" cy="54" r="22" fill="#241a4d"/>`;
  const balloon = has(diffs, "balloon-gone") ? "" :
    `<ellipse cx="122" cy="92" rx="15" ry="19" fill="#e5484d"/>`
    + `<polygon points="122,111 117,118 127,118" fill="#e5484d"/>`
    + `<path d="M122,118 C118,132 126,146 122,160" stroke="#d8d8d8" stroke-width="1.5" fill="none"/>`;
  const cat = has(diffs, "cat-gone") ? "" :
    `<ellipse cx="468" cy="352" rx="16" ry="10" fill="#2b2b2b"/>`
    + `<circle cx="482" cy="344" r="8" fill="#2b2b2b"/>`
    + `<polygon points="476,338 478,330 483,337" fill="#2b2b2b"/>`
    + `<polygon points="486,338 489,331 491,338" fill="#2b2b2b"/>`
    + `<path d="M452,356 q-14,-4 -10,-16" stroke="#2b2b2b" stroke-width="4" fill="none"/>`;
  const dumplings = has(diffs, "dumpling-extra")
    ? `<circle cx="160" cy="296" r="7" fill="#f5e9d0"/><circle cx="174" cy="298" r="7" fill="#f5e9d0"/>`
      + `<circle cx="190" cy="296" r="7" fill="#f5e9d0"/><circle cx="204" cy="298" r="7" fill="#f5e9d0"/>`
      + `<circle cx="182" cy="288" r="7" fill="#f5e9d0"/>`
    : `<circle cx="160" cy="296" r="7" fill="#f5e9d0"/><circle cx="174" cy="298" r="7" fill="#f5e9d0"/>`
      + `<circle cx="190" cy="296" r="7" fill="#f5e9d0"/><circle cx="204" cy="298" r="7" fill="#f5e9d0"/>`;
  const win = has(diffs, "window-dark") ? "#241a4d" : "#ffd166";
  const hat = has(diffs, "hat-color") ? "#c0392b" : "#d9a441";
  const lanternMid = has(diffs, "lantern-color") ? "#2ec4b6" : "#ffb703";

  return `<defs><linearGradient id="${p}sky" x1="0" y1="0" x2="0" y2="1">`
    + `<stop offset="0" stop-color="#241a4d"/><stop offset="0.7" stop-color="#4a2a6b"/>`
    + `<stop offset="1" stop-color="#7a3b5e"/></linearGradient></defs>`
    + `<rect width="640" height="384" fill="url(#${p}sky)"/>`
    + `<ellipse cx="320" cy="384" rx="360" ry="70" fill="#ff9a5a" opacity="0.35"/>`
    + starField([[40,50,1.6,.9],[90,30,1.2,.7],[160,70,1.5,.8],[240,36,1.2,.7],[330,26,1.6,.9],
      [420,44,1.2,.7],[480,30,1.5,.8],[600,110,1.4,.8],[30,120,1.3,.7],[380,90,1.2,.6],
      [520,150,1.3,.7],[200,110,1.2,.6],[620,180,1.4,.7],[70,200,1.2,.6]])
    + moon + balloon
    + `<path d="M0,44 Q160,96 320,58 T640,64" stroke="#12092b" stroke-width="3" fill="none"/>`
    + [[60,62],[130,76],[200,72],[270,64],[340,60],[410,64],[480,70],[550,68],[610,64]].map(([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="5" fill="${["#ffd166", "#ff6b6b", "#7bd389", "#6bcBff"][i % 4]}"/>`).join("")
    + `<rect x="14" y="140" width="116" height="170" fill="#170f30"/>`
    + `<rect x="30" y="155" width="18" height="14" fill="#ffd166"/><rect x="62" y="155" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="94" y="155" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="73" y="175" width="18" height="14" fill="${win}"/>`
    + `<rect x="30" y="205" width="18" height="14" fill="#ffd166"/><rect x="62" y="205" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="94" y="205" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="30" y="255" width="18" height="14" fill="#ffd166"/><rect x="62" y="255" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="94" y="255" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="516" y="118" width="110" height="192" fill="#170f30"/>`
    + `<rect x="530" y="132" width="18" height="14" fill="#ffd166"/><rect x="562" y="132" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="594" y="132" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="530" y="182" width="18" height="14" fill="#ffd166"/><rect x="562" y="182" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="594" y="182" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="530" y="232" width="18" height="14" fill="#ffd166"/><rect x="562" y="232" width="18" height="14" fill="#ffd166"/>`
    + `<rect x="594" y="232" width="18" height="14" fill="#ffd166"/>`
    + lantern(180, 105, "#ffb703") + lantern(300, 118, lanternMid) + lantern(420, 105, "#ffb703")
    + `<rect x="140" y="212" width="100" height="20" fill="#2b1a4d" stroke="#ffd166" stroke-width="1.5"/>`
    + `<text x="190" y="227" text-anchor="middle" font-family="Verdana,sans-serif" font-size="12" font-weight="bold" fill="#ffd166">NOODLES</text>`
    + `<polygon points="110,240 270,240 260,272 120,272" fill="#e5484d"/>`
    + `<polygon points="134,240 146,240 140,272 128,272" fill="#fff7e6"/>`
    + `<polygon points="182,240 194,240 192,272 180,272" fill="#fff7e6"/>`
    + `<polygon points="230,240 242,240 244,272 232,272" fill="#fff7e6"/>`
    + `<rect x="120" y="280" width="140" height="96" fill="#7a4a21"/>`
    + `<rect x="114" y="272" width="152" height="12" fill="#a06a35"/>`
    + `<ellipse cx="150" cy="272" rx="22" ry="8" fill="#333333"/>`
    + `<path d="M145,268 q4,-12 0,-20 M155,268 q-4,-12 0,-20" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.35"/>`
    + `<ellipse cx="182" cy="300" rx="34" ry="10" fill="#d8c9a3"/>` + dumplings
    + `<rect x="420" y="212" width="100" height="20" fill="#123524" stroke="#7bd389" stroke-width="1.5"/>`
    + `<text x="470" y="227" text-anchor="middle" font-family="Verdana,sans-serif" font-size="12" font-weight="bold" fill="#7bd389">TEA HOUSE</text>`
    + `<polygon points="392,240 536,240 526,272 402,272" fill="#2ec4b6"/>`
    + `<polygon points="420,240 432,240 426,272 414,272" fill="#fff7e6"/>`
    + `<polygon points="470,240 482,240 480,272 468,272" fill="#fff7e6"/>`
    + `<rect x="400" y="280" width="150" height="96" fill="#2f6b4f"/>`
    + `<rect x="394" y="272" width="162" height="12" fill="#3f8b66"/>`
    + `<circle cx="430" cy="268" r="9" fill="#8a5a2b"/><circle cx="470" cy="268" r="9" fill="#8a5a2b"/><circle cx="510" cy="268" r="9" fill="#8a5a2b"/>`
    + `<rect x="440" y="340" width="56" height="44" fill="#8a5a2b"/>`
    + `<line x1="440" y1="362" x2="496" y2="362" stroke="#6b4226" stroke-width="2"/>`
    + `<line x1="468" y1="340" x2="468" y2="384" stroke="#6b4226" stroke-width="2"/>` + cat
    + `<line x1="326" y1="268" x2="318" y2="296" stroke="#f0c8a0" stroke-width="6" stroke-linecap="round"/>`
    + `<line x1="350" y1="268" x2="358" y2="296" stroke="#f0c8a0" stroke-width="6" stroke-linecap="round"/>`
    + `<rect x="322" y="262" width="32" height="46" rx="8" fill="#e8e0d0"/>`
    + `<rect x="322" y="262" width="32" height="46" rx="8" fill="none" stroke="#b8a88a" stroke-width="1.5"/>`
    + `<circle cx="338" cy="240" r="12" fill="#f0c8a0"/>`
    + `<ellipse cx="338" cy="232" rx="20" ry="7" fill="${hat}"/>`
    + `<path d="M320,232 a18,10 0 0 1 36,0 z" fill="${hat}"/>`
    + `<rect x="0" y="384" width="640" height="76" fill="#2e2140"/>`
    + `<ellipse cx="120" cy="404" rx="46" ry="7" fill="#3a2b52"/><ellipse cx="330" cy="424" rx="60" ry="8" fill="#3a2b52"/>`
    + `<ellipse cx="520" cy="408" rx="52" ry="7" fill="#3a2b52"/>`
    + `<ellipse cx="200" cy="430" rx="70" ry="9" fill="#6b5a8a" opacity="0.5"/>`;
}

function coralCluster(x, baseY, color, lean) {
  return `<g stroke="${color}" stroke-width="7" stroke-linecap="round" fill="none">`
    + `<path d="M${x},${baseY} C${x - 8 * lean},${baseY - 28} ${x - 18 * lean},${baseY - 38} ${x - 22 * lean},${baseY - 58}"/>`
    + `<path d="M${x},${baseY} C${x + 6 * lean},${baseY - 30} ${x + 16 * lean},${baseY - 42} ${x + 20 * lean},${baseY - 62}"/>`
    + `<path d="M${x},${baseY} C${x},${baseY - 34} ${x - 2 * lean},${baseY - 48} ${x},${baseY - 66}"/>`
    + `</g><g fill="${color}">`
    + `<circle cx="${x - 22 * lean}" cy="${baseY - 58}" r="5"/><circle cx="${x + 20 * lean}" cy="${baseY - 62}" r="5"/>`
    + `<circle cx="${x}" cy="${baseY - 66}" r="5"/></g>`;
}

function buildReef(diffs, p) {
  const fishColor = has(diffs, "fish-color") ? "#9b5de5" : "#ff8c42";
  const starfish = has(diffs, "starfish-gone") ? "" :
    `<polygon points="518,378 523,392 538,392 526,401 530,415 518,407 506,415 510,401 494,392 509,392" fill="#ff9f43"/>`;
  const bubbles = has(diffs, "bubbles-extra")
    ? `<circle cx="400" cy="95" r="4" fill="#cfeeff" opacity="0.8"/><circle cx="410" cy="80" r="5" fill="#cfeeff" opacity="0.8"/>`
      + `<circle cx="420" cy="66" r="4" fill="#cfeeff" opacity="0.8"/><circle cx="430" cy="55" r="5" fill="#cfeeff" opacity="0.8"/>`
      + `<circle cx="440" cy="42" r="4" fill="#cfeeff" opacity="0.8"/><circle cx="398" cy="108" r="3" fill="#cfeeff" opacity="0.8"/>`
    : `<circle cx="400" cy="95" r="4" fill="#cfeeff" opacity="0.8"/><circle cx="410" cy="80" r="5" fill="#cfeeff" opacity="0.8"/>`
      + `<circle cx="420" cy="66" r="4" fill="#cfeeff" opacity="0.8"/>`;
  const coralColor = has(diffs, "coral-color") ? "#4cc9f0" : "#ff7b9c";
  const chest = has(diffs, "chest-open")
    ? `<rect x="272" y="388" width="52" height="30" fill="#6b4226"/>`
      + `<ellipse cx="298" cy="384" rx="30" ry="10" fill="#ffd166" opacity="0.45"/>`
      + `<circle cx="285" cy="382" r="5" fill="#ffd166"/><circle cx="300" cy="378" r="5" fill="#ffd166"/>`
      + `<circle cx="312" cy="384" r="5" fill="#ffd166"/>`
      + `<rect x="272" y="366" width="52" height="12" rx="4" fill="#7a4a21" transform="rotate(-32 272 378)"/>`
    : `<rect x="272" y="388" width="52" height="30" fill="#6b4226"/>`
      + `<rect x="272" y="378" width="52" height="12" rx="4" fill="#7a4a21"/>`
      + `<line x1="272" y1="394" x2="324" y2="394" stroke="#4a2c14" stroke-width="2"/>`;
  const shell = has(diffs, "shell-gone") ? "" :
    `<path d="M80,424 a12,10 0 0 1 24,0 z" fill="#f5e9d0"/>`
    + `<line x1="86" y1="424" x2="86" y2="414" stroke="#c9b48a" stroke-width="1.5"/>`
    + `<line x1="92" y1="424" x2="92" y2="412" stroke="#c9b48a" stroke-width="1.5"/>`
    + `<line x1="98" y1="424" x2="98" y2="414" stroke="#c9b48a" stroke-width="1.5"/>`;
  const turtle = has(diffs, "turtle-flip")
    ? `<g transform="translate(904 0) scale(-1 1)">`
      + `<ellipse cx="452" cy="218" rx="24" ry="16" fill="#2e8b57"/>`
      + `<circle cx="478" cy="214" r="7" fill="#3aa76d"/>`
      + `<ellipse cx="436" cy="206" rx="9" ry="5" fill="#3aa76d" transform="rotate(-30 436 206)"/>`
      + `<ellipse cx="436" cy="230" rx="9" ry="5" fill="#3aa76d" transform="rotate(30 436 230)"/>`
      + `<ellipse cx="468" cy="206" rx="9" ry="5" fill="#3aa76d" transform="rotate(30 468 206)"/>`
      + `<ellipse cx="468" cy="230" rx="9" ry="5" fill="#3aa76d" transform="rotate(-30 468 230)"/>`
      + `<circle cx="448" cy="214" r="3" fill="#1d5c38"/><circle cx="458" cy="222" r="3" fill="#1d5c38"/>`
      + `<circle cx="480" cy="212" r="1.6" fill="#10202e"/></g>`
    : `<ellipse cx="452" cy="218" rx="24" ry="16" fill="#2e8b57"/>`
      + `<circle cx="478" cy="214" r="7" fill="#3aa76d"/>`
      + `<ellipse cx="436" cy="206" rx="9" ry="5" fill="#3aa76d" transform="rotate(-30 436 206)"/>`
      + `<ellipse cx="436" cy="230" rx="9" ry="5" fill="#3aa76d" transform="rotate(30 436 230)"/>`
      + `<ellipse cx="468" cy="206" rx="9" ry="5" fill="#3aa76d" transform="rotate(30 468 206)"/>`
      + `<ellipse cx="468" cy="230" rx="9" ry="5" fill="#3aa76d" transform="rotate(-30 468 230)"/>`
      + `<circle cx="448" cy="214" r="3" fill="#1d5c38"/><circle cx="458" cy="222" r="3" fill="#1d5c38"/>`
      + `<circle cx="480" cy="212" r="1.6" fill="#10202e"/>`;

  return `<defs><linearGradient id="${p}sea" x1="0" y1="0" x2="0" y2="1">`
    + `<stop offset="0" stop-color="#0b3d66"/><stop offset="0.6" stop-color="#0e5a6b"/>`
    + `<stop offset="1" stop-color="#0e7a6b"/></linearGradient></defs>`
    + `<rect width="640" height="460" fill="url(#${p}sea)"/>`
    + `<polygon points="80,0 140,0 100,380 60,380" fill="#ffffff" opacity="0.06"/>`
    + `<polygon points="300,0 340,0 310,380 280,380" fill="#ffffff" opacity="0.06"/>`
    + `<polygon points="520,0 560,0 540,380 510,380" fill="#ffffff" opacity="0.05"/>`
    + `<path d="M40,384 q6,-40 -4,-70 q-8,-30 4,-58" stroke="#2e8b57" stroke-width="5" fill="none"/>`
    + `<path d="M600,384 q-6,-36 4,-64 q8,-28 -2,-52" stroke="#2e8b57" stroke-width="5" fill="none"/>`
    + `<path d="M52,384 q4,-26 -2,-48" stroke="#3aa76d" stroke-width="4" fill="none"/>`
    + coralCluster(118, 384, coralColor, 1) + coralCluster(520, 384, "#ff8c42", -1)
    + coralCluster(300, 390, "#9b5de5", 1)
    + `<ellipse cx="200" cy="404" rx="52" ry="16" fill="#6b5a4a"/>`
    + `<ellipse cx="420" cy="408" rx="46" ry="14" fill="#6b5a4a"/>`
    + `<rect width="640" height="76" y="384" fill="#d9c08a"/>`
    + `<circle cx="60" cy="410" r="3" fill="#b89a5e"/><circle cx="150" cy="430" r="3" fill="#b89a5e"/>`
    + `<circle cx="250" cy="415" r="3" fill="#b89a5e"/><circle cx="360" cy="435" r="3" fill="#b89a5e"/>`
    + `<circle cx="470" cy="420" r="3" fill="#b89a5e"/><circle cx="580" cy="435" r="3" fill="#b89a5e"/>`
    + fish(198, 148, 1, fishColor, false) + fish(350, 100, 0.9, "#ffd166", true)
    + fish(480, 180, 1.1, "#4cc9f0", false) + fish(90, 220, 0.8, "#ff7b9c", true)
    + fish(520, 90, 0.9, "#7bd389", false)
    + `<g transform="rotate(-25 382 118)">`
    + `<ellipse cx="382" cy="118" rx="26" ry="12" fill="#ff6b6b"/>`
    + `<rect x="356" y="104" width="20" height="10" rx="4" fill="#cbd5e0"/>`
    + `<circle cx="404" cy="112" r="8" fill="#f0c8a0"/>`
    + `<rect x="400" y="108" width="10" height="6" rx="2" fill="#1e3a5f"/>`
    + `<polygon points="358,118 340,108 344,122" fill="#e5484d"/>`
    + `<polygon points="358,122 340,132 346,120" fill="#e5484d"/>`
    + `</g>` + bubbles + turtle + starfish + chest + shell
    + `<circle cx="240" cy="60" r="3" fill="#cfeeff" opacity="0.5"/><circle cx="560" cy="240" r="3" fill="#cfeeff" opacity="0.5"/>`
    + `<circle cx="150" cy="330" r="2.5" fill="#cfeeff" opacity="0.5"/>`;
}

function buildStation(diffs, p) {
  const ring = has(diffs, "ring-gone") ? "" :
    `<ellipse cx="182" cy="138" rx="88" ry="20" fill="none" stroke="#e8d5a3" stroke-width="5" transform="rotate(-18 182 138)"/>`;
  const patch = has(diffs, "patch-color") ? "#3a86ff" : "#e5484d";
  const button = has(diffs, "button-red") ? "#ef4444" : "#22c55e";
  const satellite = has(diffs, "satellite-extra")
    ? `<rect x="548" y="90" width="20" height="12" fill="#cbd5e0"/>`
    + `<rect x="528" y="94" width="18" height="5" fill="#3a86ff"/><rect x="570" y="94" width="18" height="5" fill="#3a86ff"/>`
    + `<line x1="558" y1="90" x2="558" y2="78" stroke="#cbd5e0" stroke-width="2"/>`
    + `<circle cx="558" cy="76" r="2.5" fill="#ffd166"/>`
    : "";
  const coffee = has(diffs, "coffee-gone") ? "" :
    `<rect x="232" y="290" width="20" height="16" rx="3" fill="#f5f5f5"/>`
    + `<path d="M252,294 q10,2 0,8" stroke="#f5f5f5" stroke-width="3" fill="none"/>`
    + `<ellipse cx="242" cy="292" rx="8" ry="2" fill="#6b4226"/>`
    + `<circle cx="258" cy="282" r="2.5" fill="#6b4226"/><circle cx="228" cy="280" r="2" fill="#6b4226"/>`;
  const plant = has(diffs, "plant-gone") ? "" :
    `<polygon points="82,378 102,378 98,394 86,394" fill="#c05621"/>`
    + `<ellipse cx="88" cy="366" rx="5" ry="12" fill="#38a169" transform="rotate(-24 88 366)"/>`
    + `<ellipse cx="96" cy="362" rx="5" ry="13" fill="#2e8b57"/>`
    + `<ellipse cx="102" cy="368" rx="5" ry="11" fill="#38a169" transform="rotate(22 102 368)"/>`;
  const cloud = has(diffs, "cloud-added")
    ? `<ellipse cx="470" cy="118" rx="20" ry="8" fill="#ffffff" opacity="0.9"/>`
    + `<ellipse cx="486" cy="124" rx="14" ry="6" fill="#ffffff" opacity="0.9"/>`
    : `<ellipse cx="500" cy="140" rx="14" ry="5" fill="#ffffff" opacity="0.55"/>`;

  return `<rect width="640" height="460" fill="#050914"/>`
    + starField([[30,40,1.5,.9],[80,90,1.2,.7],[150,30,1.4,.8],[230,70,1.2,.7],[300,40,1.6,.9],
      [390,60,1.2,.7],[450,30,1.5,.8],[540,60,1.3,.7],[610,40,1.5,.9],[40,180,1.2,.6],
      [620,220,1.3,.7],[20,260,1.2,.6],[600,300,1.2,.6],[260,120,1.2,.5],[420,180,1.4,.7]])
    + `<rect x="60" y="60" width="300" height="220" rx="12" fill="#0a1230" stroke="#3a4a6b" stroke-width="6"/>`
    + `<circle cx="182" cy="138" r="55" fill="#c98f4e"/>`
    + `<ellipse cx="182" cy="122" rx="55" ry="10" fill="#a06a35" opacity="0.7"/>`
    + `<ellipse cx="182" cy="152" rx="55" ry="8" fill="#a06a35" opacity="0.7"/>`
    + `<ellipse cx="182" cy="138" rx="30" ry="55" fill="#b57e3e" opacity="0.5"/>` + ring
    + `<circle cx="300" cy="90" r="10" fill="#e2e8f0"/>`
    + `<circle cx="482" cy="128" r="48" fill="#0a1230" stroke="#3a4a6b" stroke-width="5"/>`
    + `<circle cx="482" cy="128" r="38" fill="#2b6cb0"/>`
    + `<path d="M462,112 q12,-8 22,0 q8,8 -2,14 q-14,4 -20,-4 z" fill="#38a169"/>`
    + `<path d="M488,138 q14,-4 16,8 q0,10 -12,10 q-10,-2 -4,-18 z" fill="#38a169"/>` + cloud
    + satellite
    + `<rect x="0" y="300" width="640" height="160" fill="#1a2436"/>`
    + `<rect x="0" y="300" width="640" height="4" fill="#2d3a52"/>`
    + `<rect x="30" y="330" width="90" height="60" fill="#232f45" stroke="#3a4a6b" stroke-width="2"/>`
    + `<line x1="40" y1="345" x2="110" y2="345" stroke="#3a4a6b" stroke-width="2"/>`
    + `<line x1="40" y1="360" x2="110" y2="360" stroke="#3a4a6b" stroke-width="2"/>`
    + `<line x1="40" y1="375" x2="110" y2="375" stroke="#3a4a6b" stroke-width="2"/>`
    + `<rect x="470" y="260" width="150" height="110" fill="#232f45" stroke="#3a4a6b" stroke-width="2"/>`
    + `<rect x="480" y="270" width="60" height="30" fill="#0e7490"/>`
    + `<path d="M484,288 l8,-10 l8,12 l8,-14 l8,10 l8,-6" stroke="#7dd3fc" stroke-width="2" fill="none"/>`
    + `<circle cx="505" cy="322" r="6" fill="#f59e0b"/><circle cx="522" cy="322" r="6" fill="${button}"/>`
    + `<circle cx="539" cy="322" r="6" fill="#3b82f6"/><circle cx="556" cy="322" r="6" fill="#a855f7"/>`
    + `<circle cx="505" cy="344" r="6" fill="#64748b"/><circle cx="522" cy="344" r="6" fill="#64748b"/>`
    + `<circle cx="539" cy="344" r="6" fill="#22c55e"/><circle cx="556" cy="344" r="6" fill="#64748b"/>`
    + `<path d="M332,240 C300,260 260,280 240,296" stroke="#94a3b8" stroke-width="2" fill="none" stroke-dasharray="5 4"/>`
    + coffee
    + `<line x1="320" y1="196" x2="292" y2="222" stroke="#e2e8f0" stroke-width="9" stroke-linecap="round"/>`
    + `<line x1="344" y1="196" x2="372" y2="222" stroke="#e2e8f0" stroke-width="9" stroke-linecap="round"/>`
    + `<line x1="324" y1="230" x2="312" y2="262" stroke="#e2e8f0" stroke-width="9" stroke-linecap="round"/>`
    + `<line x1="340" y1="230" x2="352" y2="262" stroke="#e2e8f0" stroke-width="9" stroke-linecap="round"/>`
    + `<rect x="312" y="180" width="40" height="52" rx="16" fill="#e2e8f0"/>`
    + `<rect x="352" y="190" width="12" height="30" rx="4" fill="#94a3b8"/>`
    + `<rect x="324" y="206" width="16" height="10" rx="2" fill="${patch}"/>`
    + `<circle cx="332" cy="168" r="16" fill="#e2e8f0"/>`
    + `<circle cx="332" cy="168" r="11" fill="#1e3a5f"/>`
    + `<circle cx="328" cy="164" r="3" fill="#7dd3fc" opacity="0.8"/>`
    + plant
    + `<path d="M150,320 q20,10 40,0" stroke="#334155" stroke-width="3" fill="none"/>`
    + `<path d="M150,340 q20,10 40,0" stroke="#334155" stroke-width="3" fill="none"/>`;
}

export const SCENES = { market: buildMarket, reef: buildReef, station: buildStation };
