let colors = ["orange", "lightgreen"];
let colorIndex = 0;
function changeColor() {
  document.body.style.backgroundColor = colors[colorIndex];
  colorIndex = (colorIndex + 1) % 2;
}
setInterval(changeColor, 500);
