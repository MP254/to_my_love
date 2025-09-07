let particles = [];
let microparticles = [];
let backgroundHearts = [];

const c1 = createCanvas({
  width: $(window).width(),
  height: $(window).height(),
});

const tela = c1.canvas;
const canvas = c1.context;
$("body").append(c1.canvas);

// 💖 Trái tim nền nhấp nháy tại chỗ
class BackgroundHeart {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * $(window).width();
    this.y = Math.random() * $(window).height();
    this.size = 10 + Math.random() * 15;

    this.opacity = 0;
    this.opacitySpeed = 0.01 + Math.random() * 0.01;
    this.opacityDirection = 1;
  }

  render() {
    this.canvas.save();
    this.canvas.translate(this.x, this.y);
    this.canvas.scale(this.size / 20, this.size / 20);
    this.canvas.beginPath();
    this.canvas.moveTo(0, 0);
    this.canvas.bezierCurveTo(0, -3, -5, -3, -5, 0);
    this.canvas.bezierCurveTo(-5, 3, 0, 6, 0, 9);
    this.canvas.bezierCurveTo(0, 6, 5, 3, 5, 0);
    this.canvas.bezierCurveTo(5, -3, 0, -3, 0, 0);
    this.canvas.fillStyle = `rgba(255, 100, 150, ${this.opacity})`;
    this.canvas.fill();
    this.canvas.restore();
  }

  move() {
    this.opacity += this.opacityDirection * this.opacitySpeed;

    if (this.opacity >= 0.8) {
      this.opacity = 0.8;
      this.opacityDirection = -1;
    } else if (this.opacity <= 0) {
      this.opacity = 0;
      this.opacityDirection = 1;
      this.x = Math.random() * $(window).width();
      this.y = Math.random() * $(window).height();
    }

    this.render();
  }
}

class Particle1 {
  constructor(canvas) {
    this.random = Math.random();
    this.random1 = Math.random();
    this.random2 = Math.random();
    this.progress = 0;
    this.canvas = canvas;
    this.life = 1000 + Math.random() * 3000;

    this.x =
      $(window).width() / 2 + (Math.random() * 20 - Math.random() * 20);
    this.y = $(window).height();
    this.s = 2 + Math.random();
    this.w = $(window).width();
    this.h = $(window).height();
    this.direction = this.random > 0.5 ? -1 : 1;
    this.radius = 3 + 9 * this.random;
    this.color = "#ff417d";

    this.ID = setInterval(
      function () {
        microparticles.push(
          new microParticle(c1.context, {
            x: this.x,
            y: this.y,
          })
        );
      }.bind(this),
      this.random * 20
    );

    setTimeout(
      function () {
        clearInterval(this.ID);
      }.bind(this),
      this.life
    );
  }

  render() {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.shadowOffsetX = 0;
    this.canvas.shadowOffsetY = 0;
    this.canvas.shadowColor = "#000000";
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
    this.canvas.closePath();
  }

  move() {
    this.x -=
      this.direction *
      Math.sin(this.progress / (this.random1 * 430)) *
      this.s;
    this.y -= Math.cos(this.progress / this.h) * this.s;

    if (this.x < 0 || this.x > this.w - this.radius || this.y < 0) {
      clearInterval(this.ID);
      return false;
    }

    this.render();
    this.progress++;
    return true;
  }
}

class microParticle {
  constructor(canvas, options) {
    this.random = Math.random();
    this.random1 = Math.random();
    this.random2 = Math.random();
    this.progress = 0;
    this.canvas = canvas;

    this.x = options.x;
    this.y = options.y;
    this.s = 2 + Math.random() * 3;
    this.w = $(window).width();
    this.h = $(window).height();
    this.radius = 1 + this.random * 0.5;
    this.color = "#4EFCFE";
  }

  render() {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.lineWidth = 2;
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
    this.canvas.closePath();
  }

  move() {
    this.x -=
      Math.sin(this.progress / (100 / (this.random1 - this.random2 * 10))) *
      this.s;
    this.y += Math.cos(this.progress / this.h) * this.s;

    if (this.x < 0 || this.x > this.w - this.radius || this.y > this.h) {
      return false;
    }

    this.render();
    this.progress++;
    return true;
  }
}

// 💖 Khởi tạo các trái tim nền mờ
for (let i = 0; i < 40; i++) {
  backgroundHearts.push(new BackgroundHeart(canvas));
}

var random_life = 1000;

setInterval(function () {
  particles.push(new Particle1(canvas));
  random_life = 2000 * Math.random();
}, random_life);

function clear() {
  let grd = canvas.createRadialGradient(
    tela.width / 2,
    tela.height / 2,
    0,
    tela.width / 2,
    tela.height / 2,
    tela.width
  );
  grd.addColorStop(0, "rgba(10,10,10,1)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  canvas.globalAlpha = 0.1;
  canvas.fillStyle = grd;
  canvas.fillRect(0, 0, tela.width, tela.height);
}

function update() {
  clear();
  backgroundHearts.forEach(heart => heart.move());
  particles = particles.filter(p => p.move());
  microparticles = microparticles.filter(mp => mp.move());
  requestAnimationFrame(update);
}

function createCanvas(properties) {
  let canvas = document.createElement("canvas");
  canvas.width = properties.width;
  canvas.height = properties.height;
  let context = canvas.getContext("2d");
  return {
    canvas: canvas,
    context: context,
  };
}

update();
