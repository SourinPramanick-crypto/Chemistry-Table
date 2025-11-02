"use client";

import { useEffect, useRef, useState } from "react";

interface Obstacle {
  x: number;
  gapY: number;
  passed: boolean;
}

export default function FlyingModiGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const gameRef = useRef({
    modiY: 250,
    modiVelocity: 0,
    obstacles: [] as Obstacle[],
    frameCount: 0,
    animationId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 600;
    const MODI_SIZE = 40;
    const GRAVITY = 0.5;
    const JUMP_STRENGTH = -10;
    const OBSTACLE_WIDTH = 60;
    const OBSTACLE_GAP = 180;
    const OBSTACLE_SPEED = 3;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const drawModi = (y: number) => {
      ctx.save();
      
      // Body (saffron color)
      ctx.fillStyle = "#FF9933";
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 4, y, MODI_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // White border
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Face details
      ctx.fillStyle = "#000000";
      // Eyes
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 4 - 8, y - 5, 3, 0, Math.PI * 2);
      ctx.arc(CANVAS_WIDTH / 4 + 8, y - 5, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Smile
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 4, y, 10, 0, Math.PI);
      ctx.stroke();
      
      // Beard (gray)
      ctx.fillStyle = "#CCCCCC";
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 4, y + 15, 12, 0, Math.PI);
      ctx.fill();
      
      ctx.restore();
    };

    const drawObstacle = (obstacle: Obstacle) => {
      // Top pipe
      const gradient1 = ctx.createLinearGradient(obstacle.x, 0, obstacle.x + OBSTACLE_WIDTH, 0);
      gradient1.addColorStop(0, "#138808");
      gradient1.addColorStop(1, "#0F6B06");
      
      ctx.fillStyle = gradient1;
      ctx.fillRect(obstacle.x, 0, OBSTACLE_WIDTH, obstacle.gapY);
      
      // Top pipe cap
      ctx.fillRect(obstacle.x - 5, obstacle.gapY - 20, OBSTACLE_WIDTH + 10, 20);
      
      // Bottom pipe
      const gradient2 = ctx.createLinearGradient(obstacle.x, 0, obstacle.x + OBSTACLE_WIDTH, 0);
      gradient2.addColorStop(0, "#138808");
      gradient2.addColorStop(1, "#0F6B06");
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(obstacle.x, obstacle.gapY + OBSTACLE_GAP, OBSTACLE_WIDTH, CANVAS_HEIGHT - obstacle.gapY - OBSTACLE_GAP);
      
      // Bottom pipe cap
      ctx.fillRect(obstacle.x - 5, obstacle.gapY + OBSTACLE_GAP, OBSTACLE_WIDTH + 10, 20);
      
      // Pipe borders
      ctx.strokeStyle = "#0A4A04";
      ctx.lineWidth = 2;
      ctx.strokeRect(obstacle.x, 0, OBSTACLE_WIDTH, obstacle.gapY);
      ctx.strokeRect(obstacle.x, obstacle.gapY + OBSTACLE_GAP, OBSTACLE_WIDTH, CANVAS_HEIGHT - obstacle.gapY - OBSTACLE_GAP);
    };

    const checkCollision = (modiY: number, obstacles: Obstacle[]) => {
      const modiX = CANVAS_WIDTH / 4;
      const modiRadius = MODI_SIZE / 2;

      // Check ceiling and floor
      if (modiY - modiRadius < 0 || modiY + modiRadius > CANVAS_HEIGHT) {
        return true;
      }

      // Check obstacles
      for (const obstacle of obstacles) {
        if (
          modiX + modiRadius > obstacle.x &&
          modiX - modiRadius < obstacle.x + OBSTACLE_WIDTH
        ) {
          if (
            modiY - modiRadius < obstacle.gapY ||
            modiY + modiRadius > obstacle.gapY + OBSTACLE_GAP
          ) {
            return true;
          }
        }
      }

      return false;
    };

    const gameLoop = () => {
      const game = gameRef.current;
      
      if (gameState !== "playing") {
        game.animationId = requestAnimationFrame(gameLoop);
        return;
      }

      // Clear canvas
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Update Modi
      game.modiVelocity += GRAVITY;
      game.modiY += game.modiVelocity;

      // Generate obstacles
      game.frameCount++;
      if (game.frameCount % 90 === 0) {
        const gapY = Math.random() * (CANVAS_HEIGHT - OBSTACLE_GAP - 200) + 100;
        game.obstacles.push({ x: CANVAS_WIDTH, gapY, passed: false });
      }

      // Update and draw obstacles
      game.obstacles = game.obstacles.filter((obstacle) => {
        obstacle.x -= OBSTACLE_SPEED;
        
        // Check if Modi passed the obstacle
        if (!obstacle.passed && obstacle.x + OBSTACLE_WIDTH < CANVAS_WIDTH / 4) {
          obstacle.passed = true;
          setScore((prev) => prev + 1);
        }
        
        drawObstacle(obstacle);
        return obstacle.x > -OBSTACLE_WIDTH;
      });

      // Draw Modi
      drawModi(game.modiY);

      // Check collision
      if (checkCollision(game.modiY, game.obstacles)) {
        setGameState("gameover");
        setHighScore((prev) => Math.max(prev, score));
      }

      game.animationId = requestAnimationFrame(gameLoop);
    };

    const handleJump = () => {
      if (gameState === "start") {
        setGameState("playing");
        gameRef.current.modiY = 250;
        gameRef.current.modiVelocity = JUMP_STRENGTH;
        gameRef.current.obstacles = [];
        gameRef.current.frameCount = 0;
        setScore(0);
      } else if (gameState === "playing") {
        gameRef.current.modiVelocity = JUMP_STRENGTH;
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };

    const handleClick = () => {
      handleJump();
    };

    window.addEventListener("keydown", handleKeyPress);
    canvas.addEventListener("click", handleClick);

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(gameRef.current.animationId);
    };
  }, [gameState, score]);

  const restartGame = () => {
    setGameState("start");
    setScore(0);
    gameRef.current.modiY = 250;
    gameRef.current.modiVelocity = 0;
    gameRef.current.obstacles = [];
    gameRef.current.frameCount = 0;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-orange-500 rounded-lg shadow-2xl"
        />
        
        {gameState === "start" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg">
            <div className="text-center text-white p-8">
              <h2 className="text-4xl font-bold mb-4">Flying Modi</h2>
              <p className="text-xl mb-2">Press SPACE or Click to Fly!</p>
              <p className="text-sm opacity-75">Avoid the green pipes</p>
            </div>
          </div>
        )}
        
        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <div className="text-center text-white p-8">
              <h2 className="text-4xl font-bold mb-4 text-red-400">Game Over!</h2>
              <p className="text-2xl mb-2">Score: {score}</p>
              <p className="text-xl mb-6">High Score: {highScore}</p>
              <button
                onClick={restartGame}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-8 text-center">
        <div className="bg-white px-6 py-3 rounded-lg shadow-md border-2 border-orange-300">
          <p className="text-sm text-gray-600 font-semibold">Score</p>
          <p className="text-3xl font-bold text-orange-600">{score}</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-lg shadow-md border-2 border-green-300">
          <p className="text-sm text-gray-600 font-semibold">High Score</p>
          <p className="text-3xl font-bold text-green-600">{highScore}</p>
        </div>
      </div>
    </div>
  );
}
