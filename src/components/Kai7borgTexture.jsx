import React, { useRef, useEffect } from 'react';
import './Kai7borgTexture.css';

const Kai7borgTexture = () => {
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: -1, y: -1 }); // Stores last mouse position

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const CHAR_WIDTH = 11;
    const CHAR_HEIGHT = 18;
    const LETTERS = ['k', 'a', 'i', 'b', 'o', 'r', 'g'];
    
    const COLOR_BINARY = '#2a2d32';
    const COLOR_LETTER = '#ff2a85'; 
    const COLOR_SEVEN  = '#00e676'; 

    let cols = 0;
    let rows = 0;
    let grid = [];

    const getRandomCell = () => {
      const rand = Math.random();
      if (rand < 0.82) {
        return { char: Math.random() < 0.5 ? '0' : '1', color: COLOR_BINARY, locked: false };
      } else if (rand < 0.94) {
        return { char: LETTERS[Math.floor(Math.random() * LETTERS.length)], color: COLOR_LETTER, locked: false };
      } else {
        return { char: '7', color: COLOR_SEVEN, locked: false };
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      cols = Math.ceil(canvas.width / CHAR_WIDTH);
      rows = Math.ceil(canvas.height / CHAR_HEIGHT);

      grid = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          grid.push(getRandomCell());
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Easter Egg: Spawns "kai7" near cursor location with neon glow
    const easterEggInterval = setInterval(() => {
      if (cols < 5 || rows < 1) return;

      let r, c;
      // If mouse is inside canvas, spawn near cursor so it's visible inside the heart mask
      if (mousePosRef.current.x > 0 && mousePosRef.current.y > 0) {
        const targetC = Math.floor(mousePosRef.current.x / CHAR_WIDTH);
        const targetR = Math.floor(mousePosRef.current.y / CHAR_HEIGHT);
        r = Math.max(0, Math.min(rows - 1, targetR + (Math.floor(Math.random() * 3) - 1)));
        c = Math.max(0, Math.min(cols - 4, targetC + (Math.floor(Math.random() * 5) - 2)));
      } else {
        r = Math.floor(Math.random() * rows);
        c = Math.floor(Math.random() * (cols - 4));
      }

      const startIndex = r * cols + c;
      const sequence = ['k', 'a', 'i', '7'];

      sequence.forEach((char, idx) => {
        const cellIndex = startIndex + idx;
        if (grid[cellIndex]) {
          grid[cellIndex] = {
            char,
            color: char === '7' ? COLOR_SEVEN : COLOR_LETTER,
            locked: true // Flagged for special glowing render
          };
        }
      });

      setTimeout(() => {
        sequence.forEach((_, idx) => {
          const cellIndex = startIndex + idx;
          if (grid[cellIndex]) {
            grid[cellIndex].locked = false;
          }
        });
      }, 1500); // Stays visible for 2 seconds
    }, 2000); // Spawns every 2.5 seconds

    let lastMutateTime = performance.now();
    const MUTATE_INTERVAL = 100;

    const render = (time) => {
      if (time - lastMutateTime > MUTATE_INTERVAL) {
        lastMutateTime = time;
        const mutationsCount = Math.floor(grid.length * 0.20);
        for (let i = 0; i < mutationsCount; i++) {
          const idx = Math.floor(Math.random() * grid.length);
          if (grid[idx] && !grid[idx].locked) {
            grid[idx] = getRandomCell();
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '700 13px monospace';
      ctx.textBaseline = 'top';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r * cols + c];
          if (!cell) continue;

          // Add Neon Glow & High Contrast White for Easter Egg cells
          if (cell.locked) {
            ctx.shadowColor = '#ff00ff'; // Neon pink glow
            ctx.shadowBlur = 8; // Neon glow halo
            ctx.fillStyle = '#008080'; 
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = cell.color;
          }

          ctx.fillText(cell.char, c * CHAR_WIDTH, r * CHAR_HEIGHT);
        }
      }
      ctx.shadowBlur = 0; // Reset canvas state

      animationFrameId = requestAnimationFrame(render);
    };


    animationFrameId = requestAnimationFrame(render);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mousePosRef.current = { x, y };

      canvas.style.setProperty('--mouse-x', `${x}px`);
      canvas.style.setProperty('--mouse-y', `${y}px`);
    };

    const heroElement = canvas.closest('.hero') || canvas.parentElement;
    if (heroElement) heroElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(easterEggInterval);
      cancelAnimationFrame(animationFrameId);
      if (heroElement) heroElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="kai7borg-texture" />;
};

export default Kai7borgTexture;




