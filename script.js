// --- YOUTUBE BACKGROUND MUSIC ---
let ytPlayer;

// Called by the YouTube API automatically
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player("yt-player", {
    height: "0",
    width: "0",
    videoId: "3Vk_QfSiVbI", // Your YouTube music ID
    playerVars: {
      autoplay: 0,        // Don't start automatically
      loop: 1,            // Loop music
      controls: 0,        // Hide controls
      showinfo: 0,
      modestbranding: 1,
      playlist: "3Vk_QfSiVbI" // Needed for looping
    }
  });
}const introScreen = document.getElementById("introScreen");
const startGameBtn = document.getElementById("startGameBtn");

const messageBox = document.getElementById("messageBox");
const finalReveal = document.getElementById("finalReveal");

const slot3 = document.getElementById("slot-3");

const partsPlaced = {
  gear: false,
  bolt: false,
  spring: false,
  nut: false
};


const slotData = {
  gear: {
    slotId: "slot-1",
    img: "gear.png",
    message: "Gear installed."
  },
  bolt: {
    slotId: "slot-2",
    img: "bolt.png",
    message: "Bolt installed."
  },
  spring: {
    slotId: "slot-4",
    img: "spring.png",
    message: "Spring installed."
  },
  nut: {
    slotId: "slot-5",
    img: "metal_nut.png",
    message: "Nut installed."
  }
};

startGameBtn.addEventListener("click", () => {
  introScreen.style.display = "none";
});

document.querySelectorAll(".part").forEach((part) => {
  part.addEventListener("click", () => {
    const name = part.dataset.part;
    if (partsPlaced[name]) return;
    animatePartToSlot(part, name);
  });
});

function animatePartToSlot(part, partName) {
  const slotInfo = slotData[partName];
  const slot = document.getElementById(slotInfo.slotId);

  const partRect = part.getBoundingClientRect();
  const slotRect = slot.getBoundingClientRect();

  const clone = part.cloneNode(true);
  clone.classList.add("flyingPart");
  clone.style.left = `${partRect.left}px`;
  clone.style.top = `${partRect.top}px`;
  clone.style.width = `${partRect.width}px`;
  clone.style.height = `${partRect.height}px`;

  document.body.appendChild(clone);

  part.style.visibility = "hidden";
  part.style.pointerEvents = "none";

  requestAnimationFrame(() => {
    clone.style.left = `${slotRect.left + (slotRect.width / 2) - (partRect.width / 2)}px`;
    clone.style.top = `${slotRect.top + (slotRect.height / 2) - (partRect.height / 2)}px`;
    clone.style.width = "42px";
    clone.style.height = "42px";
  });

  clone.addEventListener(
    "transitionend",
    () => {
      clone.remove();
      placePartInSlot(partName);
    },
    { once: true }
  );
}

function placePartInSlot(partName) {
  const slotInfo = slotData[partName];
  const slot = document.getElementById(slotInfo.slotId);

  partsPlaced[partName] = true;

  const img = document.createElement("img");
  img.src = slotInfo.img;
  img.alt = partName;
  img.className = "slotPart";

  slot.innerHTML = "";
  slot.appendChild(img);
  slot.classList.add("filled");

  const count = getPlacedCount();
  messageBox.textContent = `${slotInfo.message} ${count}/4 visible parts restored.`;

  if (count === 4) {
    startMachineSequence();
  }
}

function getPlacedCount() {
  return Object.values(partsPlaced).filter(Boolean).length;
}

function startMachineSequence() {
  messageBox.textContent =
    "All 4 visible parts installed. The machine attempts to start...";

  const filledSlots = document.querySelectorAll(".slot.filled");
  let flashes = 0;

  const flicker = setInterval(() => {
    filledSlots.forEach((slot) => {
      slot.style.opacity = slot.style.opacity === "0.55" ? "1" : "0.55";
    });

    flashes++;

    if (flashes >= 6) {
      clearInterval(flicker);
      filledSlots.forEach((slot) => {
        slot.style.opacity = "1";
      });
      revealMissingDrive();
    }
  }, 220);
}

function revealMissingDrive() {
  slot3.classList.remove("hidden-drive-slot");
  slot3.classList.add("missing");
  slot3.textContent = "MISSING";

  messageBox.textContent =
    "The machine is assembled, but the storage drive is missing.";

  setTimeout(() => {
    finalReveal.classList.remove("hidden");
  }, 1200);
}