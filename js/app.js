class Stopwatch {
  constructor(display, results) {
    this.running = false;
    this.display = display;
    this.results = results;
    this.laps = [];
    this.reset();
    this.print(this.times);
  }

  reset() {
    this.times = [0, 0, 0];
  }

  start() {
    if (!this.time) this.time = performance.now();
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.step.bind(this));
    }
  }

  lap() {
    let times = this.times;
    let li = document.createElement("li");
    li.innerText = this.format(times);
    this.results.appendChild(li);
    //it will store data in localstore
    let data = li.textContent;
    //console.log(data);
    const maxHistoryLength = 10;
    const history = JSON.parse(localStorage.getItem("historydata") || "[]");
    const isHistoryMaxed = history.length === maxHistoryLength;
    const workingHistory = isHistoryMaxed ? history.slice(1) : history;
    const updatedHistory = workingHistory.concat(times);
    localStorage.setItem("historydata", JSON.stringify(updatedHistory));
  }

  stop() {
    this.running = false;
    this.time = null;
  }

  clear() {
    clearChildren(this.results);
    //reset();
    let time = this.times;
    time = [0, 0, 0];
    this.display.innerText = this.format(time);
  }

  restart() {
    if (!this.time) this.time = performance.now();
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.step.bind(this));
    }
    this.reset();
  }

  step(timestamp) {
    if (!this.running) return;
    this.calculate(timestamp);
    this.time = timestamp;
    this.print();
    requestAnimationFrame(this.step.bind(this));
  }

  calculate(timestamp) {
    var diff = timestamp - this.time;
    // Hundredths of a second are 100 ms
    this.times[2] += diff / 10;
    // Seconds are 100 hundredths of a second
    if (this.times[2] >= 100) {
      this.times[1] += 1;
      this.times[2] -= 100;
    }
    // Minutes are 60 seconds
    if (this.times[1] >= 60) {
      this.times[0] += 1;
      this.times[1] -= 60;
    }
  }

  print() {
    this.display.innerText = this.format(this.times);
  }

  format(times) {
    return `\
    ${pad0(times[0], 2)}:\
    ${pad0(times[1], 2)}:\
    ${pad0(Math.floor(times[2]), 2)}`;
  }
}

function pad0(value, count) {
  var result = value.toString();
  for (; result.length < count; --count) result = "0" + result;
  return result;
}

function clearChildren(node) {
  while (node.lastChild) node.removeChild(node.lastChild);
}
function getHistory() {
  /*if (stopwatch.running) {
    stopwatch.times = [0, 0, 0];
  // }*/
  // const totalHistory = localStorage.getItem("historydata");
  // let hi;
  // if (totalHistory === null) {
  //   hi = [];
  // } else {
  // }
  let storedData = localStorage.getItem("historydata");
  if (storedData) {
    const getHistoryData = JSON.parse(storedData);
    console.log(getHistoryData);
  }

  //let li = document.createElement("li");
  // for (let i = 0; i < 10; i++)
  //   li.innerText = stopwatch.format(getHistoryData[i]);
  // stopwatch.results.appendChild(li);
}

//console.log(JSON.parse(totalHistory));
window.addEventListener("beforeunload", function(event) {
  localStorage.setItem("refreshdata", JSON.stringify(stopwatch.times));
  event.returnValue = storedData;
});

window.addEventListener("load", function(event) {
  let storedData = JSON.parse(localStorage.getItem("refreshdata"));
  console.log(storedData);
  stopwatch.display.innerText = stopwatch.format(storedData);
});
let stopwatch = new Stopwatch(
  document.querySelector(".stopwatch"),
  document.querySelector(".results")
);
