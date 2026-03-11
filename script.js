console.log("Script loaded");

const scene = document.getElementById("scene");
const imageButton = document.getElementById("imageButton");
const textBox = document.getElementById("textBox");

const gear = document.getElementById("gear");
const bolt = document.getElementById("bolt");
const spring = document.getElementById("spring");
const nut = document.getElementById("nut");

imageButton.addEventListener("click", function () {
  scene.style.backgroundImage = "url('Background.png')";

  imageButton.style.display = "none";
  textBox.style.display = "none";

  gear.style.display = "block";
  bolt.style.display = "block";
  spring.style.display = "block";
  nut.style.display = "block";
});