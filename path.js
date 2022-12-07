// Path Following (Complex Path)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/LrnR6dc2IfM
// https://thecodingtrain.com/learning/nature-of-code/5.7-path-following.html

// Path Following: https://editor.p5js.org/codingtrain/sketches/dqM054vBV
// Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

class Path {
  constructor() {
    // Arbitrary radius of 20
    // A path has a radius, i.e how far is it ok for the boid to wander off
    this.radius = 120;
    // A Path is an arraylist of points (PVector objects)
    this.points = [];
    this.img = null;
    this.title = "";
    this.imgHeight = 200;
  }

  // Add a point to the path
  addPoint(x, y) {
    let point = createVector(x, y);
    this.points.push(point);
  }

  addImg(img, imgHeight) {
    this.img = img;
    this.imgHeight = imgHeight;
  }

  addTitle(title) {
    this.title = title;
  }

  // Draw the path
  display() {
    image(
      this.img,
      this.points[0].x,
      this.points[0].y,
      this.imgHeight,
      this.imgHeight
    );

    strokeJoin(ROUND);

    // Draw thick line for radius
    // stroke(255);
    // strokeWeight(this.radius * 2);
    // noFill();
    // beginShape();
    // for (let v of this.points) {
    //   vertex(v.x, v.y);
    // }
    // endShape(CLOSE);
    // Draw thin line for center of path
    stroke(240);
    strokeWeight(0);
    noFill();
    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}
