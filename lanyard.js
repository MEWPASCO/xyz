const userId = "579327734052814858";
const statusDot = document.getElementById("status-dot");

// Spotify Card updates
function updateSpotify(iconClass, color, headerText, detailHtml) {
  const icon = document.getElementById("spotify-icon");
  const header = document.getElementById("spotify-header");
  const detail = document.getElementById("spotify-detail");

  if (header.textContent === headerText && detail.innerHTML === detailHtml) return;

  icon.className = `activity-icon ${iconClass}`;
  icon.style.color = color;
  header.style.opacity = 0;
  detail.style.opacity = 0;

  setTimeout(() => {
    header.textContent = headerText;
    detail.innerHTML = detailHtml;
    header.style.opacity = 1;
    detail.style.opacity = 1;
  }, 200);
}

// Game Card updates
function updateGame(iconClass, color, headerText, detailHtml) {
  const icon = document.getElementById("game-icon");
  const header = document.getElementById("game-header");
  const detail = document.getElementById("game-detail");

  if (header.textContent === headerText && detail.innerHTML === detailHtml) return;

  icon.className = `activity-icon ${iconClass}`;
  icon.style.color = color;
  header.style.opacity = 0;
  detail.style.opacity = 0;

  setTimeout(() => {
    header.textContent = headerText;
    detail.innerHTML = detailHtml;
    header.style.opacity = 1;
    detail.style.opacity = 1;
  }, 200);
}

// Fetch Discord Status
async function fetchStatus() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const { data } = await res.json();

    // Status colors
    const statusColors = {
      online: "#43b581",
      idle: "#faa61a",
      dnd: "#f04747",
      offline: "#747f8d"
    };
    statusDot.style.backgroundColor = statusColors[data.discord_status] || "#747f8d";

    const activities = data.activities;
    const custom = activities.find(act => act.type === 4);
    const game = activities.find(act => act.type === 0);
    const spotify = data.spotify;

    // Spotify
    if (spotify) {
      updateSpotify(
        "fab fa-spotify",
        "#1ED760",
        "Now Listening",
        `<a href="https://open.spotify.com/track/${spotify.track_id}" target="_blank" rel="noopener noreferrer">${spotify.song} by ${spotify.artist}</a>`
      );
    } else {
      updateSpotify(
        "fas fa-ghost",
        "#FFFFFF",
        "Nothing Playing",
        "Ghostly noises.."
      );
    }

    // Game or custom status
    if (game) {
      const gameSearch = encodeURIComponent(game.name);
      updateGame(
        "fab fa-steam",
        "#00adee",
        "Playing",
        `<a href="https://store.steampowered.com/search/?term=${gameSearch}" target="_blank" rel="noopener noreferrer">${game.name}</a>`
      );
    } else if (custom && custom.state) {
      updateGame(
        "fab fa-discord",
        "#5865F2",
        "Status",
        custom.state
      );
    } else {
      updateGame(
        "fas fa-wand-magic-sparkles",
        "#888888",
        "Oh no!",
        "Magically disappeared?"
      );
    }
  } catch (err) {
    console.error("Failed to load Discord status", err);
  }
}

fetchStatus();
setInterval(fetchStatus, 15000);
