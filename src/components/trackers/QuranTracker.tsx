import { usePulse } from '../../store/PulseContext';
import { Card, cn } from '../ui/Card';
import { BookOpen } from 'lucide-react';

export const QuranTracker = () => {
    const { todayData, updateDailyData } = usePulse();
    const isDone = todayData.quranDhikr;

    const toggleQuran = () => {
        updateDailyData({ quranDhikr: !isDone });
    };

    return (
        <Card
            interactive
            onClick={toggleQuran}
            className={cn(
                "flex-row items-center justify-between py-5 px-5 transition-all duration-300 cursor-pointer border",
                isDone
                    ? "bg-[#10b981]/10 border-[#10b981]/30 shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[#10b981]/50"
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                    isDone ? "bg-[#10b981] text-white" : "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
                )}>
                    <BookOpen size={20} />
                </div>
                <div className="flex-col">
                    <h3 className="font-semibold tracking-wide">Quran & Dhikr</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Spiritual consistency</p>
                </div>
            </div>

            <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                isDone ? "border-[#10b981] bg-[#10b981] scale-110" : "border-[var(--color-border)] bg-transparent"
            )}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className={cn("w-4 h-4 text-white transition-opacity duration-300", isDone ? "opacity-100" : "opacity-0")}
                >
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </Card>
    );
};
