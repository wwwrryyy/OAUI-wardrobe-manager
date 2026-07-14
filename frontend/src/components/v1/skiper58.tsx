'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

interface TextRollProps {
  children: string;
  className?: string;
  center?: boolean;
}

export const TextRoll = ({ children, className = '', center = false }: TextRollProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={`inline-flex overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ lineHeight: '1.2em' }}
    >
      <AnimatePresence mode="popLayout">
        {children.split('').map((char, i) => (
          <motion.span
            key={`${char}-${i}-${isHovered}`}
            className="inline-block"
            initial={{ y: isHovered ? '100%' : '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: isHovered ? '-100%' : '100%', opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: i * 0.02,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              textAlign: center ? 'center' : 'left',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.span>
  );
};

interface NavItem {
  label: string;
  href: string;
}

interface Skiper58Props {
  items: NavItem[];
  className?: string;
  itemClassName?: string;
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
}

export const Skiper58 = ({
  items,
  className = '',
  itemClassName = '',
  activeItem,
  onItemClick,
}: Skiper58Props) => {
  return (
    <nav className={`flex items-center gap-6 ${className}`}>
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => onItemClick?.(item)}
          className={`relative transition-colors duration-200 ${
            activeItem === item.href
              ? 'text-white'
              : 'text-white/60 hover:text-white'
          } ${itemClassName}`}
        >
          <TextRoll>{item.label}</TextRoll>
        </button>
      ))}
    </nav>
  );
};

export default Skiper58;
