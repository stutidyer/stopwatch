let i = 0;
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
  let storedData = localStorage.getItem("historydata");
  if (storedData) {
    const getHistoryData = JSON.parse(storedData);
    //console.log(getHistoryData);
    for (; i < 30; i = i + 3) {
      let li = document.createElement("li");

      li.innerText =
        getHistoryData[i] +
        ":" +
        getHistoryData[i + 1] +
        ":" +
        getHistoryData[i + 2].toPrecision(2);
      stopwatch.results.appendChild(li);
    }
  }
}

//console.log(JSON.parse(totalHistory));
window.addEventListener("beforeunload", function(event) {
  localStorage.setItem("refreshdata", JSON.stringify(stopwatch.times));
  event.returnValue = storedData;
});

window.addEventListener("load", function(event) {
  let storedData = JSON.parse(localStorage.getItem("refreshdata"));
  stopwatch.display.innerText = stopwatch.format(storedData);
  const dd = new Date();
  const seconds = dd.getSeconds();
  const minutes = dd.getMinutes();
  const hours = dd.getHours();
  localStorage.setItem("openSeconds", JSON.stringify(seconds));
  localStorage.setItem("openMinutes", JSON.stringify(minutes));
  localStorage.setItem("openHours", JSON.stringify(hours));
  // to display sync time ()
  let s =
    JSON.parse(localStorage.getItem("openSeconds")) -
    JSON.parse(localStorage.getItem("closeSeconds"));
  let m =
    JSON.parse(localStorage.getItem("openMinutes")) -
    JSON.parse(localStorage.getItem("closeMinutes"));
  let h =
    JSON.parse(localStorage.getItem("openHours")) -
    JSON.parse(localStorage.getItem("closeHours"));

  let currSecond =
    JSON.parse(localStorage.getItem("stopwatchCloseTime[0]")) + s;
  let currMinute =
    JSON.parse(localStorage.getItem("stopwatchCloseTime[1]")) + m;
  let currHours = JSON.parse(localStorage.getItem("stopwatchCloseTime[2]")) + h;

  //console.log(currSecond);
  //console.log(currMinute);

  //console.log(localStorage.getItem("closeTime"));
});

window.addEventListener("unload", function(event) {
  const d = new Date();
  const second = d.getSeconds();
  const minute = d.getMinutes();
  const hours = d.getHours();
  //console.log(time);
  localStorage.setItem("stopwatchCloseTime", JSON.stringify(stopwatch.times));
  localStorage.setItem("closeSeconds", JSON.stringify(second));
  localStorage.setItem("closeMinutes", JSON.stringify(minute));
  localStorage.setItem("closeHours", JSON.stringify(hours));
});
let stopwatch = new Stopwatch(
  document.querySelector(".stopwatch"),
  document.querySelector(".results")
);
