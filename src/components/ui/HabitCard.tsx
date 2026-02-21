import React, { type ReactNode } from 'react';
import { cn } from './Card';
import { Check, Flame, Plus } from 'lucide-react';

interface HabitCardProps {
    icon: ReactNode;
    title: string;
    subtitle: string;
    streak: number;
    isDone: boolean;
    colorClass: string;
    onToggle: (e: React.MouseEvent) => void;
    onClick: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
    icon,
    title,
    subtitle,
    streak,
    isDone,
    colorClass,
    onToggle,
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex-row items-center justify-between py-4 px-5 rounded-[24px] cursor-pointer shadow-sm transition-transform duration-300 relative overflow-hidden active:scale-[0.98]",
                colorClass
            )}
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-lg shadow-sm border border-white/40">
                    {icon}
                </div>
                <div className="flex-col">
                    <span className="font-semibold text-[var(--color-text-primary)] text-[16px] leading-tight mb-0.5">{title}</span>
                    <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] opacity-90">{subtitle}</span>
                </div>
            </div>

            <div className="flex-col items-end justify-between self-stretch gap-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 px-2 py-0.5.rounded-full mt-[-4px]">
                    <Flame size={12} className="fill-orange-500" strokeWidth={2.5} />
                    {streak} Days
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); onToggle(e); }}
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm mt-1",
                        isDone
                            ? "bg-green-500 text-white shadow-green-500/30 scale-105"
                            : "bg-white text-[var(--color-text-secondary)] border border-black/5 hover:scale-105"
                    )}
                >
                    {isDone ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={2.5} />}
                </button>
            </div>
        </div>
    );
};
