import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      // Clean up common math formatting quirks
      const cleanMath = math.trim();
      return katex.renderToString(cleanMath, {
        displayMode,
        throwOnError: false,
        output: 'html',
      });
    } catch (err) {
      console.warn('KaTeX rendering error:', err);
      return null;
    }
  }, [math, displayMode]);

  if (!html) {
    return <span className={`font-serif italic ${className}`}>{math}</span>;
  }

  return (
    <span
      className={`katex-wrapper inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
