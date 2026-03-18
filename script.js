const introScreen = document.getElementById("introScreen");
const startGameBtn = document.getElementById("startGameBtn");
const nextRoomBtn = document.getElementById("nextRoomBtn");
const messageBox = document.getElementById("messageBox");
const finalReveal = document.getElementById("finalReveal");
const slot3 = document.getElementById("slot-3");
const bgMusic = document.getElementById("bgMusic");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const failSound = document.getElementById("failSound");
const scene = document.getElementById("scene");

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
  bgMusic.volume = 0.15;
  bgMusic.play().catch(() => {});
});

nextRoomBtn.addEventListener("click", () => {
  window.location.href = "https://isladministrator.github.io/escape-room-puzzle-sonik/";
});

document.querySelectorAll(".part").forEach((part) => {
  part.addEventListener("click", (event) => {
    event.stopPropagation();

    const name = part.dataset.part;
    if (partsPlaced[name]) return;

    playCorrectSound();
    animatePartToSlot(part, name);
  });
});

scene.addEventListener("click", (event) => {
  const clickedPart = event.target.closest(".part");
  const clickedButton = event.target.closest("#startGameBtn, #nextRoomBtn");

  if (clickedPart || clickedButton) return;
  if (!finalReveal.classList.contains("hidden")) return;

  playWrongSound();
});

function playCorrectSound() {
  correctSound.currentTime = 0;
  correctSound.volume = 0.5;
  correctSound.play().catch(() => {});
}

function playWrongSound() {
  wrongSound.currentTime = 0;
  wrongSound.volume = 0.25;
  wrongSound.play().catch(() => {});
}

function playFailSound() {
  failSound.currentTime = 0;
  failSound.volume = 0.45;
  failSound.play().catch(() => {});
}

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
    clone.style.left = `${slotRect.left + slotRect.width / 2 - 20}px`;
    clone.style.top = `${slotRect.top + slotRect.height / 2 - 20}px`;
    clone.style.width = "40px";
    clone.style.height = "40px";
  });

  clone.addEventListener("transitionend", () => {
    clone.remove();
    placePartInSlot(partName);
  }, { once: true });
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

  const count = Object.values(partsPlaced).filter(Boolean).length;
  messageBox.textContent = `${slotInfo.message} ${count}/4 parts restored.`;

  if (count === 4) {
    startMachineSequence();
  }
}

function startMachineSequence() {
  messageBox.textContent = "All parts installed. The machine attempts to start...";

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

      setTimeout(() => {
        revealMissingDrive();
      }, 500);
    }
  }, 220);
}

function revealMissingDrive() {
  slot3.classList.remove("hidden-drive-slot");
  slot3.classList.add("missing");
  slot3.textContent = "MISSING";

  messageBox.textContent = "The machine is assembled, but the storage drive is missing.";

  playFailSound();

  let redFlashes = 0;
  const redBlink = setInterval(() => {
    slot3.classList.toggle("missing");
    redFlashes++;

    if (redFlashes >= 10) {
      clearInterval(redBlink);
      slot3.classList.add("missing");

      setTimeout(() => {
        finalReveal.classList.remove("hidden");
      }, 900);
    }
  }, 260);
}