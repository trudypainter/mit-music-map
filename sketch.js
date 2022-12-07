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
let infiniteSongs;
let haydenSongs;

async function getSongData() {
  let response = await fetch("./songs/zcenter.json");
  let json = await response.json();
  zCenterSongs = json;

  response = await fetch("./songs/infinite.json");
  json = await response.json();
  infiniteSongs = json;

  response = await fetch("./songs/hayden.json");
  json = await response.json();
  haydenSongs = json;

  console.log("finished await");
  loaded = true;
}

// set box params
let offset = 140;
let boxLength = 120;

let loaded = false;

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

// img
let zImg;
let haydenImg;
let infiniteImg;
let imgHeight = 200;

let allPaths = [
  [zPath, zVehicles, zPoints, zCenterSongs, "Z Center"],
  [
    infinitePath,
    infiniteVehicles,
    infinitePoints,
    infiniteSongs,
    "Infinite Corridor",
  ],
  [haydenPath, haydenVehicles, haydenPoints, haydenSongs, "Hayden Library"],
];

async function preload() {
  await getSongData();
  console.log("in preload after song data");

  zImg = loadImage("./blobs/Z.svg");
  zPath.addImg(zImg, imgHeight);
  zPath.addTitle("Z Center");
  allPaths[0].push("./charts/z.png");

  haydenImg = loadImage("./blobs/Hayden.svg");
  haydenPath.addImg(haydenImg, imgHeight);
  haydenPath.addTitle("Hayden Library");
  allPaths[2].push("./charts/hayden.png");

  infiniteImg = loadImage("./blobs/Infinite.svg");
  infinitePath.addImg(infiniteImg, imgHeight);
  infinitePath.addTitle("Infinite Corridor");
  allPaths[1].push("./charts/infinite.png");

  fetch("./songs/zcenter.json")
    .then((response) => response.json())
    .then((json) => {
      zCenterSongs = json;
    });

  fetch("./songs/infinite.json")
    .then((response) => response.json())
    .then((json) => (infiniteSongs = json));

  fetch("./songs/hayden.json")
    .then((response) => response.json())
    .then((json) => (haydenSongs = json));
}

async function setup() {
  await getSongData();
  console.log("in preload after song data");

  zImg = loadImage("./blobs/Z.svg");
  zPath.addImg(zImg, imgHeight);
  zPath.addTitle("Z Center");
  allPaths[0].push("./charts/z.png");

  haydenImg = loadImage("./blobs/Hayden.svg");
  haydenPath.addImg(haydenImg, imgHeight);
  haydenPath.addTitle("Hayden Library");
  allPaths[2].push("./charts/hayden.png");

  infiniteImg = loadImage("./blobs/Infinite.svg");
  infinitePath.addImg(infiniteImg, imgHeight);
  infinitePath.addTitle("Infinite Corridor");
  allPaths[1].push("./charts/infinite.png");

  fetch("./songs/zcenter.json")
    .then((response) => response.json())
    .then((json) => {
      zCenterSongs = json;
    });

  fetch("./songs/infinite.json")
    .then((response) => response.json())
    .then((json) => (infiniteSongs = json));

  fetch("./songs/hayden.json")
    .then((response) => response.json())
    .then((json) => (haydenSongs = json));

  console.log("adding paths");
  allPaths[0][3] = zCenterSongs;
  allPaths[1][3] = infiniteSongs;
  allPaths[2][3] = haydenSongs;
  createCanvas(window.innerWidth, window.innerHeight);
  // Call a function to generate new Path object
  for (let pathInfo of allPaths) {
    newPath(pathInfo[0], pathInfo[2], pathInfo[4]);
    // We are now making random vehicles and storing them in an ArrayList
    for (let song of pathInfo[3]) {
      newVehicle(random(width), random(height), pathInfo[1], song);
    }
  }
}
function draw() {
  if (loaded) {
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
      fill(120);
      textAlign(CENTER);
      textSize(18);
      text(
        path[4],
        path[2][0][0] + imgHeight / 2,
        path[2][0][1] + imgHeight + 30
      );

      button = createButton("Show Info");
      button.position(path[2][0][0], path[2][0][1] + imgHeight + 40);

      let message =
        "<br />" + path[4] + " music response data. <br /><br /><br />";
      button.mousePressed(() => updateModal(path[5], message));
    }
  }
}

function mousePressed() {
  console.log("pressed");
  console.log(mouseX, mouseY);

  for (let v of zVehicles) {
    v.updateModalCheck(mouseX, mouseY);
  }
  for (let v of haydenVehicles) {
    v.updateModalCheck(mouseX, mouseY);
  }
  for (let v of infiniteVehicles) {
    v.updateModalCheck(mouseX, mouseY);
  }
}

function updateModal(imgUrl, message) {
  // set img
  var img = document.getElementById("modal-img");
  img.src = imgUrl;

  // set body text
  var body = document.getElementById("modal-title");
  body.innerHTML = message;

  // set modal to visible
  var x = document.getElementById("modal");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function newPath(pathPassed, points, img) {
  for (let point of points) {
    pathPassed.addPoint(point[0], point[1]);
  }
}

function newVehicle(x, y, vehicleList, song) {
  let maxspeed = random(1, 2);
  let maxforce = 0.3;
  vehicleList.push(new Vehicle(x, y, maxspeed, maxforce, song));
}
