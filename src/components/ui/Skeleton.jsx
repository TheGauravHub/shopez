import React from 'react';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  ...props
}) => {
  const variants = {
    text: { height: '16px', marginBottom: '8px' },
    textSm: { height: '12px', marginBottom: '6px' },
    textLg: { height: '24px', marginBottom: '12px' },
    avatar: { width: '48px', height: '48px', borderRadius: '50%' },
    card: { height: '200px', borderRadius: 'var(--radius-lg)' },
    button: { height: '44px', width: '120px', borderRadius: 'var(--radius-md)' },
    image: { aspectRatio: '1', borderRadius: 'var(--radius-lg)' },
    circle: { borderRadius: '50%' }
  };
  
  const currentVariant = variants[variant] || variants.text;
  
  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={{
        ...currentVariant,
        width: width || currentVariant.width || '100%',
        height: height || currentVariant.height,
        background: 'linear-gradient(90deg, var(--background-strong) 25%, var(--border) 50%, var(--background-strong) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s ease-in-out infinite',
        borderRadius: currentVariant.borderRadius || 'var(--radius-md)'
      }}
      {...props}
    />
  );
};

export default Skeleton;
