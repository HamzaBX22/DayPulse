import React, { useMemo } from 'react';
import { usePulse } from '../store/PulseContext';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { WaterTracker } from '../components/trackers/WaterTracker';
import { SleepTracker } from '../components/trackers/SleepTracker';
import { MoodTracker } from '../components/trackers/MoodTracker';
import { NamazTracker } from '../components/trackers/NamazTracker';
import { QuranTracker } from '../components/trackers/QuranTracker';
import { NotesTracker } from '../components/trackers/NotesTracker';
import { format } from 'date-fns';
import { CheckCircle2, Circle, PartyPopper, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Dashboard: React.FC = () => {
    const { activeProfile, todayData, getConsistencyRatio, getCurrentStreak, updateDailyData } = usePulse();

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const consistency = getConsistencyRatio(7);
    const streak = getCurrentStreak();

    const toggleHabit = (id: string) => {
        updateDailyData({
            customHabits: {
                ...todayData.customHabits,
                [id]: !todayData.customHabits[id]
            }
        });
    };

    const handleCompleteDay = () => {
        // Build completed habits object
        const completedHabits: Record<string, boolean> = {};
        activeProfile.habits.forEach(habit => {
            completedHabits[habit.id] = true;
        });

        // Update all data to targets / 100% complete
        updateDailyData({
            waterIntake: activeProfile.targets.water,
            sleepHours: activeProfile.targets.sleep,
            mood: 'happy',
            prayers: { fajr: true, zuhr: true, asr: true, maghrib: true, isha: true },
            quranDhikr: true,
            exercise: true,
            customHabits: completedHabits,
            isLogged: true
        });

        // Premium celebration
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#4ade80', '#60a5fa', '#f472b6', '#fbbf24']
        });
    };

    return (
        <div className="flex-col gap-6 animate-pop-in">
            {/* Dynamic Header */}
            <header className="flex-row justify-between w-full">
                <div className="flex-col">
                    <p className="text-caption">{format(new Date(), 'EEEE, MMMM do')}</p>
                    <h1 className="text-gradient">{greeting}, {activeProfile.name}</h1>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-accent)] flex items-center justify-center font-bold text-lg cursor-pointer shadow-[var(--shadow-premium)] text-[var(--color-accent)]">
                    {activeProfile.name.charAt(0)}
                </div>
            </header>

            {/* Intelligence Ring & Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-2">
                <Card className="col-span-2 flex flex-row justify-between items-center bg-[var(--color-surface)] border-l-4 border-l-[var(--color-accent)]">
                    <div className="flex-col justify-center">
                        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-text-secondary)]">{todayData.score}%</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium tracking-wide">Daily Performance</p>
                    </div>
                    <ProgressRing
                        progress={todayData.score}
                        size={90}
                        strokeWidth={8}
                    />
                </Card>

                <Card variant="gradient" className="flex-col items-center justify-center text-center py-5 shadow-lg shadow-[var(--color-accent)]/20">
                    <h2 className="text-3xl font-bold text-white">{streak}</h2>
                    <p className="text-sm font-medium text-white/80 mt-1">Day Streak</p>
                </Card>

                <Card variant="solid" className="flex-col items-center justify-center text-center py-5 border-[var(--color-border)] shadow-sm">
                    <h2 className="text-3xl font-bold text-[var(--color-accent)]">{consistency}%</h2>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">Consistency</p>
                </Card>
            </div>

            {/* Trackers Area */}
            <div className="flex-col gap-4 mt-2">
                <WaterTracker />
                <SleepTracker />
                <MoodTracker />
                <NamazTracker />
                <QuranTracker />
                <NotesTracker />
            </div>

            {/* Habits Overview */}
            <div className="mt-4 flex-col gap-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                    Daily Targets <span className="text-xs bg-[var(--color-surface)] px-2 py-0.5 rounded-full text-[var(--color-text-secondary)] border border-[var(--color-border)]">{activeProfile.habits.length}</span>
                </h3>

                <div className="flex-col gap-3">
                    {activeProfile.habits.length === 0 ? (
                        <p className="text-sm opacity-70 italic text-center py-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] border-dashed">No custom habits added yet.</p>
                    ) : (
                        activeProfile.habits.map((habit) => {
                            const isDone = todayData.customHabits[habit.id] || false;
                            return (
                                <Card
                                    key={habit.id}
                                    interactive
                                    className={cn("flex-row items-center justify-between py-4 px-5 border transition-all duration-300", isDone ? "border-[var(--color-success)]/30 bg-[var(--color-success)]/5" : "border-[var(--color-border)]")}
                                    onClick={() => toggleHabit(habit.id)}
                                >
                                    <div className="flex-row items-center gap-3">
                                        {/* Micro-animated Checkbox substitute */}
                                        <div className={cn("transition-transform duration-300 display-flex font-bold", isDone ? "scale-110 text-[var(--color-success)]" : "text-[var(--color-border)]")}>
                                            {isDone ? <CheckCircle2 size={26} className="fill-[var(--color-success)]/20 shadow-sm" /> : <Circle size={26} className="opacity-50" />}
                                        </div>

                                        <span className={cn("font-medium transition-colors text-base p-1", isDone && "text-[var(--color-text-secondary)] line-through decoration-2 opacity-60")}>
                                            {habit.label}
                                        </span>
                                    </div>

                                    {/* Daily Reminders Settings Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.dispatchEvent(new CustomEvent('NAVIGATE_TO_HABIT', { detail: habit.id }));
                                        }}
                                        className="p-2 rounded-full hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                        title="Configure Daily Reminders"
                                    >
                                        <Bell size={18} />
                                    </button>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Complete Day Button */}
            <div className="mt-6 flex justify-center w-full">
                <button
                    onClick={handleCompleteDay}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                >
                    <PartyPopper size={20} />
                    Complete Day
                </button>
            </div>

            {/* Bottom Spacer for Mobile Nav Overlay */}
            <div className="h-6 w-full"></div>
        </div>
    );
};

// Helper inside same file since I need `cn` without import loop mapping for this test
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
