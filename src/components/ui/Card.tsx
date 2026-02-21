import React, { type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'glass' | 'solid' | 'gradient';
    interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'glass',
    interactive = false,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                'card',
                variant === 'glass' && 'glass-panel',
                variant === 'solid' && 'bg-[var(--color-surface)] border border-[var(--color-border)]',
                variant === 'gradient' && 'bg-[var(--color-accent-gradient)] text-white shadow-[var(--shadow-premium)]',
                interactive && 'cursor-pointer hover:translate-y-[-2px] transition-transform duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
