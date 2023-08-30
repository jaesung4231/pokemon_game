const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
const collisonsMap = [];
for (let i = 0; i < collisons.length; i += 70) {
  collisonsMap.push(collisons.slice(i, i + 70));
}

const battleZoneMap = [];
for (let i = 0; i < battleZoneData.length; i += 70) {
  battleZoneMap.push(battleZoneData.slice(i, i + 70));
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

const battleZones = [];
battleZoneMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const image = new Image();
image.src = "./Pellet Town.png";

const playerDownImage = new Image();
playerDownImage.src = "./images/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./images/playerUp.png";

const playerRightImage = new Image();
playerRightImage.src = "./images/playerRight.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./images/playerLeft.png";

const foregroundImage = new Image();
foregroundImage.src = "./images/Fground.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 20,
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
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

const moveables = [background, ...boundaries, foreground, ...battleZones];

function rectangularCollision({ rec1, rec2 }) {
  return (
    rec1.position.x + rec1.width >= rec2.position.x &&
    rec1.position.x <= rec2.position.x + rec2.width &&
    rec1.position.y <= rec2.position.y + rec2.height &&
    rec1.position.y + rec1.height >= rec2.position.y
  );
}

const battle = {
  initiated: false,
};

function animate() {
  const animationID = window.requestAnimationFrame(animate);
  background.draw();

  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });

  player.draw();
  foreground.draw();
  let moving = true;
  player.animate = false;

  // console.log(animationID);
  if (battle.initiated) return;
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollision({
          rec1: player,
          rec2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 3 &&
        Math.random() < 0.01
      ) {
        console.log("battle activated");
        window.cancelAnimationFrame(animationID);
        battle.initiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.3,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });

        animateBattle();
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "ArrowUp") {
    player.animate = true;
    player.image = player.sprites.up;
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
        moving = false;
        break;
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y += 2;
      });
  } else if (keys.s.pressed && lastKey === "ArrowDown") {
    player.animate = true;
    player.image = player.sprites.down;
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
        moving = false;
        break;
      }
    }
    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y -= 2;
      });
  } else if (keys.a.pressed && lastKey === "ArrowLeft") {
    player.animate = true;
    player.image = player.sprites.left;
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
        moving = false;
        break;
      }
    }
    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x += 2;
      });
  } else if (keys.d.pressed && lastKey === "ArrowRight") {
    player.animate = true;
    player.image = player.sprites.right;
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

// animate start
// animate();

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./images/battleBackground.png";
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const draggleImage = new Image();
draggleImage.src = "./images/draggleSprite.png";
const draggle = new Sprite({
  position: {
    x: 800,
    y: 100,
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
});

const embyImage = new Image();
embyImage.src = "./images/embySprite.png";
const emby = new Sprite({
  position: {
    x: 280,
    y: 325,
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
});

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  draggle.draw();
  emby.draw();
}

animateBattle();

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
