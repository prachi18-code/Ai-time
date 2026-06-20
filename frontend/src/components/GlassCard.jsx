import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const GlassCard = ({ children, className = '', glow = true, onClick }) => {
  const cardRef = useRef(null);
  const { theme, themes } = useTheme();

  // Motion values for tracking mouse relative position within the card bounds
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map to rotations (maximum tilt: 8 degrees)
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates to ranges [-0.5, 0.5]
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const activeTheme = themes.find(t => t.id === theme) || themes[0];

  const cardClass = 
    theme === 'zen' ? 'zen-paper-card' :
    theme === 'galaxy' ? 'galaxy-glass-card' :
    theme === 'sakura' ? 'sakura-organic-card' :
    theme === 'ocean' ? 'ocean-water-card' : 'midnight-luxury-card';

  const getHoverVariants = () => {
    switch (theme) {
      case 'zen':
        return {
          scale: 1.01,
          y: -4,
          boxShadow: '0 25px 50px rgba(100, 90, 80, 0.12), 0 5px 15px rgba(0, 0, 0, 0.02)',
          borderColor: 'rgba(181, 130, 99, 0.25)',
        };
      case 'sakura':
        return {
          scale: 1.015,
          rotate: 0.5,
          boxShadow: '0 12px 35px rgba(244, 114, 182, 0.15)',
          borderColor: 'rgba(244, 114, 182, 0.4)',
        };
      case 'ocean':
        return {
          scale: 1.012,
          boxShadow: '0 15px 40px rgba(6, 182, 212, 0.22), inset 0 0 15px rgba(6, 182, 212, 0.15)',
          borderColor: 'rgba(6, 182, 212, 0.5)',
        };
      case 'midnight':
        return {
          scale: 1.008,
          boxShadow: '0 0 35px rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.25)',
        };
      case 'galaxy':
      default:
        return {
          scale: 1.02,
          boxShadow: `0 15px 45px rgba(0, 0, 0, 0.55), 0 0 25px ${activeTheme.accent}25`,
          borderColor: `${activeTheme.accent}45`,
        };
    }
  };

  const getCardStyle = () => {
    if (theme === 'zen') {
      return {
        transformStyle: 'preserve-3d',
      };
    }
    return {
      rotateX: rotateXSpring,
      rotateY: rotateYSpring,
      transformStyle: 'preserve-3d',
    };
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={getCardStyle()}
      whileHover={getHoverVariants()}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`${cardClass} p-6 relative ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* 3D preserve container wrapper */}
      <div style={{ transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
