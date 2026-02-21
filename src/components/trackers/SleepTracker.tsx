import { usePulse, type SleepQuality } from '../../store/PulseContext';
import { Card, cn } from '../ui/Card';
import { Bed, BatteryFull, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';

const QUALITY_OPTIONS: { value: SleepQuality; label: string; icon: any; color: string }[] = [
    { value: 'excellent', label: 'Excellent', icon: BatteryFull, color: 'text-green-500' },
    { value: 'good', label: 'Good', icon: BatteryMedium, color: 'text-blue-500' },
    { value: 'fair', label: 'Fair', icon: BatteryLow, color: 'text-yellow-500' },
    { value: 'poor', label: 'Poor', icon: BatteryWarning, color: 'text-red-500' },
];

export const SleepTracker = () => {
    const { activeProfile, todayData, updateDailyData } = usePulse();
    const hours = todayData.sleepHours;
    const quality = todayData.sleepQuality;
    const target = activeProfile.targets.sleep;

    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateDailyData({ sleepHours: Number(e.target.value) });
    };

    const handleQuality = (val: SleepQuality) => {
        updateDailyData({ sleepQuality: val });
    };

    return (
        <Card className="flex-col gap-5">
            <div className="flex-row justify-between w-full">
                <h3 className="flex items-center gap-2 font-semibold">
                    <Bed size={20} className="text-indigo-400" />
                    Sleep Cycle
                </h3>
                <span className="text-lg font-bold text-indigo-400">{hours}h</span>
            </div>

            {/* Hours Slider */}
            <div className="flex-col gap-2 w-full">
                <input
                    type="range"
                    min="0" max="14" step="0.5"
                    value={hours}
                    onChange={handleHourChange}
                    className="w-full h-2 bg-[var(--color-surface)] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                    <span>0h</span>
                    <span>{target}h Target</span>
                    <span>14h</span>
                </div>
            </div>

            {/* Quality Blocks */}
            <div className="flex gap-2 w-full mt-2">
                {QUALITY_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = quality === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => handleQuality(opt.value)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all duration-300",
                                isActive
                                    ? "bg-[var(--color-surface-hover)] border-indigo-500/50 shadow-md shadow-indigo-500/10"
                                    : "bg-[var(--color-surface)] border-[var(--color-border)] opacity-60 hover:opacity-100"
                            )}
                        >
                            <Icon size={18} className={isActive ? opt.color : "text-[var(--color-text-secondary)]"} />
                            <span className={cn("text-[10px] font-medium", isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]")}>
                                {opt.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </Card>
    );
};
