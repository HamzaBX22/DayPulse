import React from 'react';
import { cn } from './Card';

interface ProgressRingProps {
    progress: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    label?: string;
    subLabel?: string;
    colorClass?: string;
    className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 120,
    strokeWidth = 12,
    label,
    subLabel,
    colorClass = 'stroke-[var(--color-accent)]',
    className
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const safeProgress = Math.min(100, Math.max(0, progress));
    const offset = circumference - (safeProgress / 100) * circumference;

    return (
        <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                    className="stroke-[var(--color-border)]"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Ring */}
                <circle
                    className={cn('transition-all duration-1000 ease-in-out', colorClass)}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {/* Center Label */}
            <div className="absolute flex flex-col items-center justify-center text-center">
                {label && <span className="text-2xl font-bold">{label}</span>}
                {subLabel && <span className="text-xs text-[var(--color-text-secondary)] mt-1">{subLabel}</span>}
            </div>
        </div>
    );
};
