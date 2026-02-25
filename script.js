console.log("Script loaded");

// below is basic example code for using a button
// you can use it, expand on it, or delete it
// that all depends on your team's plan.

const scene = document.getElementById("scene");
const imageButton = document.getElementById("imageButton");

imageButton.addEventListener("click", function () {
  scene.style.backgroundImage = 'url("background2.jpg")';
  imageButton.style.display = "none";
});
});
