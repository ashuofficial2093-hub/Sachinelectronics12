import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  options?: any;
}

export default function TiltCard({ children, className = '', options = {} }: TiltCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 20,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
        ...options,
      });
    }
    
    return () => {
      if (tiltRef.current && (tiltRef.current as any).vanillaTilt) {
        (tiltRef.current as any).vanillaTilt.destroy();
      }
    };
  }, [options]);

  return (
    <div ref={tiltRef} className={`card-3d-hover ${className}`}>
      {children}
    </div>
  );
}
