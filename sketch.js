// Path Following (Complex Path)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/LrnR6dc2IfM
// https://thecodingtrain.com/learning/nature-of-code/5.7-path-following.html

// Path Following: https://editor.p5js.org/codingtrain/sketches/dqM054vBV
// Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

// Crowd Path Following
// Via Reynolds: http://www.red3d.com/cwr/steer/CrowdPath.html

// Using this variable to decide whether to draw all the stuff
let debug = false;

// fetch the playlist songs
let zCenterSongs;
fetch("./songs/zcenter.json")
  .then((response) => response.json())
  .then((json) => {
    zCenterSongs = json;
  });

let infiniteSongs;
fetch("./songs/infinite.json")
  .then((response) => response.json())
  .then((json) => (infiniteSongs = json));

let haydenSongs;
fetch("./songs/hayden.json")
  .then((response) => response.json())
  .then((json) => (haydenSongs = json));

// set box params
let offset = 140;
let boxLength = 120;

// A path object (series of connected points)
let zPath = new Path();
let infinitePath = new Path();
let haydenPath = new Path();

// paths of the points
let zx = offset;
let zy = window.innerHeight / 2;
let zPoints = [
  [zx, zy],
  [zx + boxLength, zy],
  [zx + boxLength, zy + boxLength],
  [zx, zy + boxLength],
  [zx, zy],
];

let ix = window.innerWidth / 2;
let iy = offset;
let infinitePoints = [
  [ix, iy],
  [ix + boxLength, iy],
  [ix + boxLength, iy + boxLength],
  [ix, iy + boxLength],
  [ix, iy],
];

let hx = window.innerWidth - 2 * boxLength - offset;
let hy = window.innerHeight - 2 * boxLength - offset;
let haydenPoints = [
  [hx, hy],
  [hx + boxLength, hy],
  [hx + boxLength, hy + boxLength],
  [hx, hy + boxLength],
  [hx, hy],
];

// Vehicles
let zVehicles = [];
let infiniteVehicles = [];
let haydenVehicles = [];

let allPaths = [
  [zPath, zVehicles, zPoints, zCenterSongs],
  [infinitePath, infiniteVehicles, infinitePoints, infiniteSongs],
  [haydenPath, haydenVehicles, haydenPoints, haydenSongs],
];

function setup() {
  allPaths[0][3] = zCenterSongs;
  allPaths[1][3] = infiniteSongs;
  allPaths[2][3] = haydenSongs;

  createCanvas(window.innerWidth, window.innerHeight);

  // Call a function to generate new Path object
  for (let pathInfo of allPaths) {
    newPath(pathInfo[0], pathInfo[2]);

    // We are now making random vehicles and storing them in an ArrayList
    for (let song of pathInfo[3]) {
      newVehicle(random(width), random(height), pathInfo[1], song);
    }
  }
}

function draw() {
  background(255);
  // Display the path

  for (let path of allPaths) {
    path[0].display();

    for (let v of path[1]) {
      // Path following and separation are worked on in this function
      v.applyBehaviors(path[1], path[0]);
      // Call the generic run method (update, borders, display, etc.)
      v.run();
    }
  }
}

function newPath(pathPassed, points) {
  // A path is a series of connected points
  // A more sophisticated path might be a curve

  for (let point of points) {
    pathPassed.addPoint(point[0], point[1]);
  }
}

function newVehicle(x, y, vehicleList, song) {
  let maxspeed = random(1, 2);
  let maxforce = 0.3;
  vehicleList.push(new Vehicle(x, y, maxspeed, maxforce, song));
}

function keyPressed() {
  if (key == "d") {
    debug = !debug;
  }
}
