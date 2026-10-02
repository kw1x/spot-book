import React from 'react';

export const FloorBackground: React.FC = () => {
  return (
    <g className="select-none pointer-events-none">
      <defs>
        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border/40"
          />
        </pattern>
        <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="text-muted/30" stopColor="currentColor" />
          <stop offset="100%" className="text-muted/60" stopColor="currentColor" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="700" fill="url(#gridPattern)" />

      <rect
        x="20"
        y="20"
        width="960"
        height="660"
        rx="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-border"
      />

      <g className="text-muted-foreground/30">
        <rect x="340" y="530" width="40" height="120" rx="8" fill="currentColor" />
        <text x="350" y="595" transform="rotate(-90 350,595)" className="fill-muted-foreground text-[9px] font-semibold tracking-wider uppercase">
          Кофе-поинт
        </text>
      </g>

      <g className="text-muted-foreground/30">
        <rect x="910" y="530" width="50" height="120" rx="8" fill="currentColor" />
        <text x="930" y="595" transform="rotate(-90 930,595)" className="fill-muted-foreground text-[9px] font-semibold tracking-wider uppercase">
          Лифты
        </text>
      </g>

      <g className="text-muted-foreground/30">
        <rect x="470" y="665" width="60" height="15" rx="3" fill="currentColor" />
        <text x="500" y="676" textAnchor="middle" className="fill-muted-foreground text-[8px] font-semibold tracking-wider uppercase">
          Вход
        </text>
      </g>
    </g>
  );
};
