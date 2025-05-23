
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo = ({ className, size = 'medium' }: LogoProps) => {
  const sizeClasses = {
    small: 'text-2xl md:text-3xl',
    medium: 'text-3xl md:text-5xl',
    large: 'text-5xl md:text-7xl',
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn('font-extrabold tracking-tight', sizeClasses[size])}>
        <span className="text-savi-blue">S</span>
        <span className="text-savi-yellow">A</span>
        <span className="text-savi-pink">V</span>
        <span className="text-savi-green">I</span>
      </div>
      <div className={cn('font-bold', {
        'text-sm md:text-base': size === 'small',
        'text-base md:text-xl': size === 'medium',
        'text-xl md:text-2xl': size === 'large',
      })}>
        English Explorer
      </div>
    </div>
  );
};

export default Logo;
