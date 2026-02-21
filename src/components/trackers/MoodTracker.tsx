import { usePulse, type Mood } from '../../store/PulseContext';
import { Card, cn } from '../ui/Card';
import { Smile, Meh, Frown, Battery } from 'lucide-react';

const MOODS: { value: Mood; label: string; icon: any; color: string; bg: string }[] = [
    { value: 'happy', label: 'Great', icon: Smile, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/30' },
    { value: 'normal', label: 'Okay', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/30' },
    { value: 'stressed', label: 'Stressed', icon: Frown, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30' },
    { value: 'tired', label: 'Exhausted', icon: Battery, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30' },
];

export const MoodTracker = () => {
    const { todayData, updateDailyData } = usePulse();
    const currentMood = todayData.mood;

    const handleMood = (val: Mood) => {
        updateDailyData({ mood: val });
    };

    return (
        <Card className="flex-col gap-4">
            <h3 className="flex items-center gap-2 font-semibold">
                <Smile size={20} className="text-pink-400" />
                Daily Energy & Mood
            </h3>

            <div className="grid grid-cols-4 gap-3 w-full">
                {MOODS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = currentMood === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => handleMood(opt.value)}
                            className={cn(
                                "flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all duration-300",
                                isActive
                                    ? opt.bg
                                    : "bg-[var(--color-surface)] border-[var(--color-border)] opacity-70 hover:opacity-100 hover:border-[var(--color-border)]"
                            )}
                        >
                            <div className={cn(
                                "transition-transform duration-300",
                                isActive ? "scale-125" : "scale-100 grayscale opacity-70"
                            )}>
                                <Icon size={28} className={isActive ? opt.color : ''} />
                            </div>
                            <span className={cn(
                                "text-[11px] font-medium transition-colors mt-1",
                                isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
                            )}>
                                {opt.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </Card>
    );
};
