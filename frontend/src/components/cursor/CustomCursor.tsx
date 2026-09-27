import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for outer ring
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28 });

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check hovered elements
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, select, textarea, .interactive-hover');
      const projectCard = target.closest('[data-cursor="view"]');

      if (projectCard) {
        setIsHovered(true);
        setCursorText('VIEW');
      } else if (interactive) {
        setIsHovered(true);
        setCursorText('');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Central Cyber Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#22d3ee]"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />

      {/* Outer Adaptive Cyber Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/5 backdrop-blur-[1px]"
        style={{
          x: springX,
          y: springY,
        }}
        animate={{
          width: cursorText ? 64 : isHovered ? 44 : 26,
          height: cursorText ? 64 : isHovered ? 44 : 26,
          scale: isClicking ? 0.85 : 1,
          borderColor: isHovered ? '#22d3ee' : 'rgba(34, 211, 238, 0.4)',
          backgroundColor: cursorText ? 'rgba(8, 9, 11, 0.85)' : isHovered ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {cursorText && (
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300">
            {cursorText}
          </span>
        )}
      </motion.div>
    </>
  );
};
