import React, { useEffect, useRef, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { Ship } from '../game/Ship';
import { Bullet } from '../game/Bullet';
import { Enemy } from '../game/Enemy';
import { Shield, Heart } from 'lucide-react';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [shield, setShield] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const ship = useRef(new Ship());
  const bullets = useRef<Bullet[]>([]);
  const enemies = useRef<Enemy[]>([]);
  const keys = useRef<Set<string>>(new Set());

  const handleKeyDown = (e: KeyboardEvent) => {
    keys.current.add(e.key);
    if (e.key === 'p') setPaused(p => !p);
    if (e.key === 'r' && gameOver) resetGame();
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    keys.current.delete(e.key);
  };

  const resetGame = () => {
    ship.current = new Ship();
    bullets.current = [];
    enemies.current = [];
    setScore(0);
    setHealth(100);
    setShield(100);
    setGameOver(false);
    setPaused(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const update = (deltaTime: number) => {
    if (paused || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update ship position
    if (keys.current.has('ArrowLeft')) ship.current.moveLeft();
    if (keys.current.has('ArrowRight')) ship.current.moveRight();
    if (keys.current.has(' ')) {
      const newBullet = ship.current.shoot();
      if (newBullet) bullets.current.push(newBullet);
    }

    // Spawn enemies
    if (Math.random() < 0.02) {
      enemies.current.push(new Enemy(Math.random() * canvas.width));
    }

    // Update bullets
    bullets.current = bullets.current.filter(bullet => {
      bullet.update();
      return bullet.isActive();
    });

    // Update enemies
    enemies.current = enemies.current.filter(enemy => {
      enemy.update();
      
      // Check collision with bullets
      bullets.current.forEach(bullet => {
        if (enemy.checkCollision(bullet)) {
          setScore(s => s + 10);
          enemy.destroy();
          bullet.destroy();
        }
      });

      // Check collision with ship
      if (enemy.checkCollision(ship.current)) {
        if (shield > 0) {
          setShield(s => Math.max(0, s - 20));
        } else {
          setHealth(h => Math.max(0, h - 20));
        }
        enemy.destroy();
      }

      return enemy.isActive();
    });

    if (health <= 0) {
      setGameOver(true);
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i++) {
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        1
      );
    }

    ship.current.render(ctx);
    bullets.current.forEach(bullet => bullet.render(ctx));
    enemies.current.forEach(enemy => enemy.render(ctx));

    if (gameOver) {
      ctx.fillStyle = 'white';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      ctx.font = '24px Arial';
      ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 40);
    }

    if (paused) {
      ctx.fillStyle = 'white';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
  };

  useGameLoop(update, render);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-8 text-xl font-bold">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" />
          <span>{health}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-blue-500" />
          <span>{shield}%</span>
        </div>
        <div>Score: {score}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-4 border-gray-800 rounded-lg"
      />
      <div className="text-center">
        <p className="text-lg">
          Use arrow keys to move, spacebar to shoot, 'P' to pause
        </p>
      </div>
    </div>
  );
}