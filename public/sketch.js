var socket;

let oscs = [];

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const tileCount = 100;
const noiseScale = 0.05;

var grid;
var xnoise;
var ynoise;
var t = 0;

// Constants
var Y_AXIS = 1;
var X_AXIS = 2;
var b1, b2, c1, c2;
var outerDiam = 0;

function setup() {
  createCanvas(windowWidth/1.5, windowHeight/1.2);
  
  for (let i = 0; i < 5; i++) {
    let osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(midiToFreq(random([mouseX/10, mouseX/5, mouseX/3, 50, mouseY])));
    osc.pan(random(-1, 1));
    osc.amp(0.05)
    osc.start();
    oscs.push(osc);
  }
  recognition.lang = 'en-US';
recognition.interimResults = false;
document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});
recognition.addEventListener('result', (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  console.log('Confidence: ' + e.results[0][0].confidence);

  // We will use the Socket.IO here later…
});

  
  // Define colors
  b1 = color(255);
  b2 = color(50);
  c1 = color(204, 102, 70);
  c2 = color(0, 102, 153);
  
  v1 = color(0,191,255, 150);
  v2 = color(255,105,180, 150);

  //noLoop();

  socket = io.connect('http:/localhost:3000');
  socket.on ('mouse', newDrawing);

  function newDrawing (data){
    setGradient(0, 0, width, height, data.v1, data.v2, data.X_AXIS);
  }
}

function draw() {
  //background(150, 180, 255);
  createGrid();
  showGrid();
  t += 0.01;
  
   cursor('grab');

  // data sharing
  console.log('Sending:'+ mouseX + ',' + mouseY);
  var data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse' +data);
  
 var mouseXColor = map(mouseX, 0, width, 0, 255);
  var mouseYColor = map(mouseY, 0, height, 0, 255);
  
  
  v1 = color(mouseXColor,191,255, 10);
  v2 = color(mouseYColor,180, 410);
  
  
  // Background
  setGradient(0, 0, width, height, v1, v2, X_AXIS);

  for (var i = 0; i < 5; i++){
		var diam = outerDiam - 30 * i;    
    if (diam > 0){
      
      var fade = map(diam, 0, width, 5, 255);
			stroke(fade);
      fill(300,20,100,10);
      ellipse(mouseX, mouseY, diam);
    }
    
  }
  
  outerDiam = outerDiam + 2;

}


function createGrid() {
  grid = [];
  let tileSize = width / tileCount;
  ynoise = t;
  for (let row = 0; row < tileCount; row++) {
    grid[row] = [];
    xnoise = t;
    for (let col = 0; col < tileCount; col++) {
      let x = col * tileSize;
      let y = row * tileSize;
      let a = noise(xnoise, ynoise) * 255;
      grid[row][col] = new Tile(x, y, tileSize, a);
      xnoise += noiseScale;
    }
    ynoise += noiseScale;
  }
}

function showGrid() {
  for (let row = 0; row < tileCount; row++) {
    for (let col = 0; col < tileCount; col++) {
      grid[row][col].show();
    }
  }
}

class Tile {
  constructor(x, y, size, a) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.c = color(255, a);
  }

  show() {
    noStroke();
    fill(this.c);
    rect(this.x, this.y, this.size, this.size);
  }
}

function setGradient(x, y, w, h, c1, c2, axis) {

  noFill();

  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y+h);
    }
  }
}

