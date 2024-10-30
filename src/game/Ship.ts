export class Ship {
  x: number = 400;
  y: number = 550;
  width: number = 40;
  height: number = 50;
  speed: number = 5;
  lastShot: number = 0;
  shootDelay: number = 250;

  moveLeft() {
    this.x = Math.max(this.width / 2, this.x - this.speed);
  }

  moveRight() {
    this.x = Math.min(800 - this.width / 2, this.x + this.speed);
  }

  shoot() {
    const now = Date.now();
    if (now - this.lastShot > this.shootDelay) {
      this.lastShot = now;
      return new Bullet(this.x, this.y - 20);
    }
    return null;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw body
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 10, 20, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw head
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 15, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(this.x - 5, this.y - 15, 2, 0, Math.PI * 2);
    ctx.arc(this.x + 5, this.y - 15, 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw smile
    ctx.beginPath();
    ctx.arc(this.x, this.y - 12, 8, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Draw name
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('กำปุ้ง', this.x, this.y - 35);

    // Draw arms
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x - 20, this.y);
    ctx.lineTo(this.x - 30, this.y + 10);
    ctx.moveTo(this.x + 20, this.y);
    ctx.lineTo(this.x + 30, this.y + 10);
    ctx.stroke();
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}

export class Bullet {
  x: number;
  y: number;
  width: number = 8;
  height: number = 8;
  speed: number = 7;
  active: boolean = true;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.y -= this.speed;
    if (this.y < -this.height) {
      this.active = false;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  isActive() {
    return this.active;
  }

  destroy() {
    this.active = false;
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}

export class Enemy {
  x: number;
  y: number = -20;
  width: number = 30;
  height: number = 30;
  speed: number = 2;
  active: boolean = true;
  rotation: number = 0;

  constructor(x: number) {
    this.x = x;
  }

  update() {
    this.y += this.speed;
    this.rotation += 0.05;
    if (this.y > 600 + this.height) {
      this.active = false;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Draw enemy body
    ctx.fillStyle = '#4A90E2';
    ctx.beginPath();
    ctx.moveTo(0, -15);
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const nextAngle = ((i + 1) * 2 * Math.PI) / 5 - Math.PI / 2;
      ctx.lineTo(15 * Math.cos(angle), 15 * Math.sin(angle));
      ctx.lineTo(7 * Math.cos((angle + nextAngle) / 2), 7 * Math.sin((angle + nextAngle) / 2));
    }
    ctx.closePath();
    ctx.fill();

    // Draw center
    ctx.fillStyle = '#2E5B9C';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  isActive() {
    return this.active;
  }

  destroy() {
    this.active = false;
  }

  checkCollision(other: Ship | Bullet) {
    const bounds = this.getBounds();
    const otherBounds = other.getBounds();

    return (
      bounds.x < otherBounds.x + otherBounds.width &&
      bounds.x + bounds.width > otherBounds.x &&
      bounds.y < otherBounds.y + otherBounds.height &&
      bounds.y + bounds.height > otherBounds.y
    );
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}