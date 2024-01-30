import React, { useEffect, useState } from "react";
import "./board.css";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";

export const Board = () => {
  const ROWS = 10;
  const COLS = 10;
  const CELL_SIZE = 20;
  const INTERVAL = 200;

  const Direction = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
  };
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 2, y: 2 });
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );

  const [isMoving, setIsMoving] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isMoving) {
        moveSnake();
      }
    }, INTERVAL);
    return () => clearInterval(intervalId);
  }, [isMoving, snake]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case "ArrowDown":
          if (direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case "ArrowLeft":
          if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case "ArrowRight":
          if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
        case "Enter":
          restartGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const newBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    snake.forEach(({ x, y }) => {
      if (newBoard[y] && newBoard[y][x] !== undefined) {
        newBoard[y][x] = 1;
      }
    });
    newBoard[food.y][food.x] = -1;
    setBoard(newBoard);
  }, [snake, food]);

  const moveSnake = () => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    setIsMoving(false);
    switch (direction) {
      case Direction.UP:
        head.y -= 1;
        break;
      case Direction.DOWN:
        head.y += 1;
        break;
      case Direction.LEFT:
        head.x -= 1;
        break;
      case Direction.RIGHT:
        head.x += 1;
        break;
      default:
        break;
    }

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= COLS ||
      head.y >= ROWS ||
      newSnake.slice(1).some(({ x, y }) => x === head.x && y === head.y)
    ) {
      setGameOver(true);
    }
    console.log(head, "head is");
    newSnake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      generateFood();
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
    setIsMoving(true);
  };

  const generateFood = () => {
    let x, y;
    do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
    } while (snake.some(({ x: sx, y: sy }) => sx === x && sy === y));

    setFood({ x, y });
  };

  const restartGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setFood({ x: 2, y: 2 });
    setDirection(Direction.RIGHT);
    setScore(0);
    setGameOver(false);
  };

  return (
    <>
      {" "}
      <Box>
        <Typography variant="h3" mt={10}>
          <b>Snake Game</b>
        </Typography>
        <p>Score: {score}</p>
        {gameOver && (
          <Typography
            variant="h5"
            component="h2"
            className={`game-over-message ${gameOver ? "zoom-out" : ""}`}
          >
            Game Over!
          </Typography>
        )}
        <div className="board">
          {board.map((row, y) => (
            <div key={y} className="row">
              {row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`cell ${
                    cell === 1 ? "cell-green " : cell === -1 ? "cell-red" : ""
                  }`}
                ></div>
              ))}
            </div>
          ))}
        </div>
        <Button
          onClick={restartGame}
          sx={{ marginTop: "10px" }}
          variant="contained"
        >
          Restart
        </Button>
      </Box>
    </>
  );
};
