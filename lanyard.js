// Live Discord / Spotify presence via Lanyard (https://github.com/Phineas/lanyard)
const USER_ID = "579327734052814858";
const POLL_MS = 15000;
const TIMEOUT_MS = 8000;
const FADE_MS = 200;

const STATUS_COLORS = {
  online: "#43b581",
  idle: "#faa61a",
  dnd: "#f04747",
  offline: "#747f8d"
};

const statusDot = document.getElementById("status-dot");

// Each card remembers what it currently shows, so unchanged data never re-fades.
const cards = {
  spotify: { icon: el("spotify-icon"), header: el("spotify-header"), detail: el("spotify-detail"), key: null, timer: 0 },
  game: { icon: el("game-icon"), header: el("game-header"), detail: el("game-detail"), key: null, timer: 0 }
};

function el(id) {
  return document.getElementById(id);
}

// Builds the detail line with textContent / createElement, never innerHTML,
// so song names, game names and custom statuses can't inject markup.
function buildDetail(text, href) {
  if (!href) return document.createTextNode(text);
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = text;
  return a;
}

function updateCard(card, { key, iconClass, color, header, text, href }) {
  if (card.key === key) return; // nothing changed
  card.key = key;

  clearTimeout(card.timer);
  card.header.style.opacity = 0;
  card.detail.style.opacity = 0;

  card.timer = setTimeout(() => {
    card.icon.className = `activity-icon ${iconClass}`;
    card.icon.style.color = color;
    card.header.textContent = header;
    card.detail.replaceChildren(buildDetail(text, href));
    card.header.style.opacity = 1;
    card.detail.style.opacity = 1;
  }, FADE_MS);
}

let hasLoaded = false;

function showUnavailable() {
  if (hasLoaded) return; // keep showing the last good data
  statusDot.style.backgroundColor = STATUS_COLORS.offline;
  updateCard(cards.spotify, {
    key: "unavailable",
    iconClass: "fas fa-ghost",
    color: "#FFFFFF",
    header: "Status unavailable",
    text: "Try again in a bit"
  });
  updateCard(cards.game, {
    key: "unavailable",
    iconClass: "fas fa-wand-magic-sparkles",
    color: "#888888",
    header: "Status unavailable",
    text: "Try again in a bit"
  });
}

async function fetchStatus() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`Lanyard responded ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data) throw new Error("Lanyard returned no data");
    const data = json.data;

    statusDot.style.backgroundColor = STATUS_COLORS[data.discord_status] || STATUS_COLORS.offline;
    statusDot.title = data.discord_status || "offline";

    const activities = data.activities || [];
    const custom = activities.find(a => a.type === 4);
    const game = activities.find(a => a.type === 0);
    const spotify = data.spotify;

    // Spotify
    if (spotify) {
      updateCard(cards.spotify, {
        key: `spotify:${spotify.track_id}`,
        iconClass: "fab fa-spotify",
        color: "#1ED760",
        header: "Now Listening",
        text: `${spotify.song} by ${spotify.artist}`,
        href: `https://open.spotify.com/track/${encodeURIComponent(spotify.track_id)}`
      });
    } else {
      updateCard(cards.spotify, {
        key: "spotify:none",
        iconClass: "fas fa-ghost",
        color: "#FFFFFF",
        header: "Nothing Playing",
        text: "Ghostly noises.."
      });
    }

    // Game, otherwise custom status
    if (game) {
      updateCard(cards.game, {
        key: `game:${game.name}`,
        iconClass: "fab fa-steam",
        color: "#00adee",
        header: "Playing",
        text: game.name,
        href: `https://store.steampowered.com/search/?term=${encodeURIComponent(game.name)}`
      });
    } else if (custom && custom.state) {
      updateCard(cards.game, {
        key: `status:${custom.state}`,
        iconClass: "fab fa-discord",
        color: "#5865F2",
        header: "Status",
        text: custom.state
      });
    } else {
      updateCard(cards.game, {
        key: "game:none",
        iconClass: "fas fa-wand-magic-sparkles",
        color: "#888888",
        header: "Oh no!",
        text: "Magically disappeared?"
      });
    }

    hasLoaded = true;
  } catch (err) {
    console.error("Failed to load Discord status", err);
    showUnavailable();
  } finally {
    clearTimeout(timeout);
  }
}

// Poll only while the tab is visible; refresh right away when it comes back.
let pollTimer = 0;

async function poll() {
  clearTimeout(pollTimer);
  if (document.hidden) return;
  await fetchStatus();
  pollTimer = setTimeout(poll, POLL_MS);
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) poll();
});

poll();
