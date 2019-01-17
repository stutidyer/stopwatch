var startBtn = document.getElementById("start"),
  stopBtn = document.getElementById("stop"),
  lapBtn = document.getElementById("lap"),
  clearBtn = document.getElementById("clear"),
  running = false,
  times = [],
  display = document.querySelector(".stopwatch"),
  results = document.getElementById("results"),
  laps = [];
eventListener();

function eventListener() {
  document.addEventListener("DOMContentLoaded", print);
  document.addEventListener("DOMContentLoaded", reset);
  //  document.addEventListener("DOMContentLoaded", stopwatchs);
  document.addEventListener("DOMContentLoaded", result);
  startBtn.addEventListener("click", start());
  stopBtn.addEventListener("click", stop());
  lapBtn.addEventListener("click", lap());
  clearBtn.addEventListener("click", clear());
}

function result() {
  this.results = results;
}

function start() {
  if (!this.time) this.time = performance.now();
  if (!this.running) {
    this.running = true;
    requestAnimationFrame(this.step.bind(this));
  }
}
function reset() {
  this.times = [0, 0, 0];
}
function stop() {
  this.running = false;
  this.time = null;
}

function lap() {
  let times = this.times;
  let li = document.createElement("li");
  li.innerText = this.format(times);
  results.appendChild(li);
}

function clear() {
  clearChildren(this.results);
}

function step(timestamp) {
  if (!this.running) return;
  this.calculate(timestamp);
  this.time = timestamp;
  this.print();
  requestAnimationFrame(this.step.bind(this));
}

function calculate(timestamp) {
  var diff = timestamp - this.time;
  // Hundredths of a second are 100 ms
  this.times[2] += diff / 10;
  // Seconds are 100 hundredths of a second
  if (this.times[2] >= 100) {
    this.times[1] += 1;
    this.times[2] -= 100;
  }
  // Minutes are 60 `seconds
  if (this.times[1] >= 60) {
    this.times[0] += 1;
    this.times[1] -= 60;
  }
}

function print() {
  display.innerText = format(times);
}

function format(times) {
  return `\
 ${pad0(times[0], 2)}:\
 ${pad0(times[1], 2)}:\`
 ${pad0(Math.floor(times[2]), 2)}`;
}

function pad0(value, count) {
  var result = value + "";
  for (; result.length < count; --count) result = "0" + result;
  return result;
}

function clearChildren(node) {
  while (node.lastChild) node.removeChild(node.lastChild);
}
