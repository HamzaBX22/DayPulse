import { usePulse } from '../../store/PulseContext';
import { Card, cn } from '../ui/Card';
import { MoonStar } from 'lucide-react';

const PRAYERS = ['Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export const NamazTracker = () => {
    const { todayData, updateDailyData } = usePulse();
    const prayers = todayData.prayers;

    const togglePrayer = (prayer: keyof typeof prayers) => {
        updateDailyData({
            prayers: {
                ...prayers,
                [prayer]: !prayers[prayer]
            }
        });
    };

    const completedCount = Object.values(prayers).filter(Boolean).length;

    return (
        <Card className="flex-col gap-4">
            <div className="flex-row justify-between w-full">
                <h3 className="flex items-center gap-2 font-semibold">
                    <MoonStar size={20} className="text-[var(--color-accent)]" />
                    Namaz Tracker <span className="text-xs bg-[var(--color-surface)] px-2 py-0.5 rounded-full">{completedCount} / 5</span>
                </h3>
            </div>

            <div className="flex justify-between w-full mt-2">
                {PRAYERS.map((prayer) => {
                    const key = prayer.toLowerCase() as keyof typeof prayers;
                    const isDone = prayers[key];

                    return (
                        <button
                            key={key}
                            onClick={() => togglePrayer(key)}
                            className="flex flex-col items-center gap-2 relative group"
                        >
                            <div
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    isDone
                                        ? "bg-[var(--color-accent)] border-[var(--color-accent)] shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.3)]"
                                        : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full transition-transform duration-300",
                                    isDone ? "bg-black/20 scale-100" : "bg-transparent scale-0"
                                )} />
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors",
                                isDone ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"
                            )}>
                                {prayer}
                            </span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};
