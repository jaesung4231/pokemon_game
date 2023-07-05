const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
const collisonsMap = [];

for (let i = 0; i < collisons.length; i += 70) {
  collisonsMap.push(collisons.slice(i, i + 70));
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];
const offset = {
  x: -740,
  y: -650,
};
collisonsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

// c.fillStyle = "white";
// c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "./Pellet Town.png";

const playerImage = new Image();
playerImage.src = "./images/playerDown.png";

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.frames = frames;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }
  draw() {
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }
}

// canvas.width / 2 - playerImage.width / 4 / 2,
// canvas.height / 2 - playerImage.height / 2,

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const moveables = [background, ...boundaries];

function rectangularCollision({ rec1, rec2 }) {
  return (
    rec1.position.x + rec1.width >= rec2.position.x &&
    rec1.position.x <= rec2.position.x + rec2.width &&
    rec1.position.y <= rec2.position.y + rec2.height &&
    rec1.position.y + rec1.height >= rec2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  player.draw();
  let moving = true;
  if (keys.w.pressed && lastKey === "ArrowUp") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rec1: player,
          rec2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y + 2 },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y += 2;
      });
  } else if (keys.s.pressed && lastKey === "ArrowDown") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rec1: player,
          rec2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y - 2 },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y -= 2;
      });
  } else if (keys.a.pressed && lastKey === "ArrowLeft") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rec1: player,
          rec2: {
            ...boundary,
            position: { x: boundary.position.x + 2, y: boundary.position.y },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x += 2;
      });
  } else if (keys.d.pressed && lastKey === "ArrowRight") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rec1: player,
          rec2: {
            ...boundary,
            position: { x: boundary.position.x - 2, y: boundary.position.y },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x -= 2;
      });
  }
}

animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keys.w.pressed = true;
      lastKey = "ArrowUp";
      break;
    case "ArrowLeft":
      keys.a.pressed = true;
      lastKey = "ArrowLeft";
      break;
    case "ArrowDown":
      keys.s.pressed = true;
      lastKey = "ArrowDown";
      break;
    case "ArrowRight":
      keys.d.pressed = true;
      lastKey = "ArrowRight";
      break;
  }
  // console.log(keys);
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keys.w.pressed = false;
      lastKey = "ArrowUp";
      break;
    case "ArrowLeft":
      keys.a.pressed = false;
      lastKey = "ArrowLeft";
      break;
    case "ArrowDown":
      keys.s.pressed = false;
      lastKey = "ArrowDown";
      break;
    case "ArrowRight":
      keys.d.pressed = false;
      lastKey = "ArrowRight";
      break;
  }
});
