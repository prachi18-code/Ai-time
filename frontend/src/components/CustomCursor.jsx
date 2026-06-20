import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
  const { theme, themes } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for absolute cursor coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs for smooth trailing effect
  const springConfig = { damping: 30, stiffness: 280, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, cursorX, cursorY]);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'TEXTAREA' ||
        target.closest('.cursor-pointer') ||
        target.closest('button') ||
        target.closest('a');

      setHovered(!!isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  // Active accent color based on theme
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  // Generate Universe specific cursor styles
  const getOuterStyles = () => {
    const base = {
      x: cursorXSpring,
      y: cursorYSpring,
      translateX: '-50%',
      translateY: '-50%',
      transition: 'width 0.25s ease, height 0.25s ease, background-color 0.25s ease, border-radius 0.25s ease',
    };

    switch (theme) {
      case 'zen':
        return {
          ...base,
          width: hovered ? '38px' : '22px',
          height: hovered ? '38px' : '22px',
          backgroundColor: hovered ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.06)',
          border: 'none',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          borderRadius: '9999px',
          mixBlendMode: 'normal',
        };
      case 'sakura':
        return {
          ...base,
          width: hovered ? '44px' : '26px',
          height: hovered ? '44px' : '26px',
          backgroundColor: hovered ? 'rgba(244, 114, 182, 0.2)' : 'rgba(244, 114, 182, 0.06)',
          border: '1.5px solid rgba(244, 114, 182, 0.4)',
          borderRadius: '32px 10px 32px 10px', // cherry leaf shape!
          boxShadow: '0 0 10px rgba(244, 114, 182, 0.15)',
          mixBlendMode: 'normal',
        };
      case 'ocean':
        return {
          ...base,
          width: hovered ? '46px' : '28px',
          height: hovered ? '46px' : '28px',
          backgroundColor: hovered ? 'rgba(6, 182, 212, 0.18)' : 'rgba(6, 182, 212, 0.05)',
          border: '1.5px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.25), inset 0 0 6px rgba(6, 182, 212, 0.2)',
          borderRadius: '9999px',
          mixBlendMode: 'screen',
        };
      case 'midnight':
        return {
          ...base,
          width: hovered ? '34px' : '22px',
          height: hovered ? '34px' : '22px',
          backgroundColor: 'transparent',
          border: '2.5px double rgba(226, 232, 240, 0.7)',
          borderRadius: '0px', // sharp tech square
          boxShadow: '0 0 12px rgba(255, 255, 255, 0.15)',
          mixBlendMode: 'screen',
        };
      case 'galaxy':
      default:
        return {
          ...base,
          width: hovered ? '52px' : '32px',
          height: hovered ? '52px' : '32px',
          backgroundColor: hovered ? `${accentColor}18` : 'transparent',
          border: `1.5px solid ${accentColor}`,
          boxShadow: hovered 
            ? `0 0 20px ${accentColor}, inset 0 0 10px ${accentColor}` 
            : `0 0 8px ${accentColor}`,
          borderRadius: '9999px',
          mixBlendMode: 'screen',
        };
    }
  };

  const getInnerStyles = () => {
    const base = {
      x: cursorX,
      y: cursorY,
      translateX: '-50%',
      translateY: '-50%',
      transition: 'scale 0.2s ease, background-color 0.2s ease, border-radius 0.2s ease',
    };

    switch (theme) {
      case 'zen':
        return {
          ...base,
          width: '5px',
          height: '5px',
          backgroundColor: '#4B5563',
          boxShadow: 'none',
          borderRadius: '9999px',
          scale: hovered ? 0.7 : 1,
        };
      case 'sakura':
        return {
          ...base,
          width: '6px',
          height: '6px',
          backgroundColor: '#f472b6',
          borderRadius: '16px 4px 16px 4px',
          scale: hovered ? 1.4 : 1,
        };
      case 'ocean':
        return {
          ...base,
          width: '5px',
          height: '5px',
          backgroundColor: 'transparent',
          border: '1.5px solid #06b6d4',
          borderRadius: '9999px',
          scale: hovered ? 1.6 : 1,
        };
      case 'midnight':
        return {
          ...base,
          width: '4px',
          height: '4px',
          backgroundColor: '#ffffff',
          borderRadius: '0px',
          scale: hovered ? 1.2 : 1,
        };
      case 'galaxy':
      default:
        return {
          ...base,
          width: '8px',
          height: '8px',
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${accentColor}`,
          borderRadius: '9999px',
          scale: hovered ? 1.5 : 1,
        };
    }
  };

  return (
    <>
      {/* Outer Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden sm:block"
        style={getOuterStyles()}
      />
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden sm:block"
        style={getInnerStyles()}
      />
    </>
  );
};

export default CustomCursor;
