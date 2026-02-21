import { usePulse } from '../../store/PulseContext';
import { Card, cn } from '../ui/Card';
import { Droplet, Plus, Minus } from 'lucide-react';

export const WaterTracker = () => {
    const { activeProfile, todayData, updateDailyData } = usePulse();
    const waterTarget = activeProfile.targets.water;
    const current = todayData.waterIntake;

    const handleUpdate = (amount: number) => {
        const newValue = Math.max(0, current + amount);
        updateDailyData({ waterIntake: newValue });
    };

    return (
        <Card className="flex-col gap-4">
            <div className="flex-row justify-between w-full">
                <h3 className="flex items-center gap-2 font-semibold">
                    <Droplet size={20} className="text-blue-400" />
                    Hydration <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full">{current} / {waterTarget}</span>
                </h3>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleUpdate(-1)}
                        disabled={current === 0}
                        className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] disabled:opacity-50"
                    >
                        <Minus size={16} />
                    </button>
                    <button
                        onClick={() => handleUpdate(1)}
                        className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30 hover:bg-blue-600 active:scale-90 transition-all"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Visual Glasses Display */}
            <div className="flex flex-wrap gap-2 mt-2">
                {Array.from({ length: Math.max(waterTarget, current) }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-8 flex-1 min-w-[30px] rounded-sm transition-all duration-300",
                            i < current ? "bg-blue-500/80" : "bg-[var(--color-surface)] border border-[var(--color-border)]"
                        )}
                        style={{
                            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)'
                        }}
                    />
                ))}
            </div>
        </Card>
    );
};
