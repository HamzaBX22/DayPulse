import React, { useState } from 'react';
import { Card, cn } from '../components/ui/Card';
import { ChevronLeft, Plus, X } from 'lucide-react';

interface HabitDetailsProps {
    habitId: string;
    onBack: () => void;
}

export const HabitDetails: React.FC<HabitDetailsProps> = ({ habitId, onBack }) => {
    // States for engagement settings
    const [goalPeriod, setGoalPeriod] = useState('Day-Long');
    const [goalValue, setGoalValue] = useState('30');
    const [taskDays, setTaskDays] = useState('Every Day');

    // Reminders states
    const [timeRange, setTimeRange] = useState<'Anytime' | 'Morning' | 'Afternoon' | 'Evening'>('Anytime');
    const [remindersEnabled, setRemindersEnabled] = useState(true);
    const [customTime, setCustomTime] = useState('7:30 AM');

    // Memo settings
    const [showMemo, setShowMemo] = useState(false);
    const [memoMessage, setMemoMessage] = useState('');

    // Bottom Sheet
    const [showReminderTypePopup, setShowReminderTypePopup] = useState(false);
    const [reminderType, setReminderType] = useState<'Time' | 'Location'>('Time');

    // Handlers
    const cycleGoalPeriod = () => {
        const ops = ['Day-Long', 'Weekly', 'Monthly'];
        setGoalPeriod(ops[(ops.indexOf(goalPeriod) + 1) % ops.length]);
    };

    const cycleTaskDays = () => {
        const ops = ['Every Day', 'Weekdays', 'Weekends'];
        setTaskDays(ops[(ops.indexOf(taskDays) + 1) % ops.length]);
    };

    const promptGoalValue = () => {
        const val = window.prompt("Enter Goal Value (min):", goalValue);
        if (val && !isNaN(Number(val))) setGoalValue(val);
    };

    const promptTime = () => {
        const val = window.prompt("Enter Reminder Time (e.g. 8:00 AM):", customTime);
        if (val) setCustomTime(val);
    };

    // Placeholder info parsing based on what was clicked (in reality pulled from Context DB)
    const habitDisplayMap: Record<string, { icon: string, title: string }> = {
        'yoga': { icon: '🤸‍♀️', title: 'Yoga' },
        'water': { icon: '💧', title: 'Drink water' },
        'beverage': { icon: '🥤', title: 'Drink Less Beverage' },
        'breakfast': { icon: '🥪', title: 'Eat Breakfast' },
        'walk': { icon: '🚶‍♀️', title: 'Walk' },
        'meditation': { icon: '🧘‍♀️', title: 'Meditation' },
    };

    const info = habitDisplayMap[habitId] || { icon: '✨', title: 'Habit' };

    return (
        <div className="flex-col min-h-screen app-container text-[var(--color-text-primary)] animate-pop-in">
            {/* Inner Nav */}
            <div className="flex items-center justify-between w-full pt-8 pb-4 px-6">
                <button onClick={onBack} className="p-2 hover:bg-[var(--color-surface)] rounded-full transition-all border border-[var(--color-border)]">
                    <ChevronLeft size={24} className="text-[var(--color-text-primary)]" />
                </button>
                <h2 className="font-bold flex items-center gap-2 text-lg">
                    <span className="text-xl">{info.icon}</span> {info.title}
                </h2>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Header Text */}
            <div className="flex-col px-6 pt-4 pb-6">
                <h1 className="text-[34px] font-bold tracking-tight text-gradient">Daily Reminders</h1>
                <p className="text-[16px] font-medium text-[var(--color-text-secondary)] mt-1">Time and location based</p>
            </div>

            <div className="flex-col gap-6 w-full max-w-[400px] mx-auto pb-24 px-6 content-area">

                {/* Goal Configuration Block */}
                <Card className="flex-col gap-0 p-0 overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-premium)]">

                    <div onClick={cycleGoalPeriod} className="flex items-center justify-between p-5 border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer">
                        <span className="font-semibold text-[16px]">Goal Period <span className="text-[var(--color-text-secondary)] opacity-50 ml-1">?</span></span>
                        <span className="text-[var(--color-text-secondary)] font-medium flex items-center gap-1">{goalPeriod} <ChevronLeft size={16} className="rotate-180 opacity-50" /></span>
                    </div>

                    <div onClick={promptGoalValue} className="flex items-center justify-between p-5 border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer">
                        <span className="font-semibold text-[16px]">Goal Value</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[17px] font-bold">{goalValue}</span>
                            <span className="text-[var(--color-bg)] bg-[var(--color-accent)] px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_10px_var(--color-accent)]">min</span>
                            <span className="text-[var(--color-text-secondary)] font-medium">/ Day</span>
                        </div>
                    </div>

                    <div onClick={cycleTaskDays} className="flex-col p-5 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-[16px]">Task Days</span>
                            <span className="text-[var(--color-text-secondary)] font-medium flex items-center gap-1">{taskDays} <ChevronLeft size={16} className="rotate-180 opacity-50" /></span>
                        </div>
                        <span className="text-[13px] font-medium text-[var(--color-accent)] mt-2">*Complete {goalValue} min each day</span>
                    </div>
                </Card>

                {/* Time Range Selector */}
                <Card className="flex-col p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-premium)] gap-4">
                    <span className="font-semibold text-[16px]">Time Range</span>
                    <div className="flex gap-2 w-full justify-between">
                        {['Anytime', 'Morning', 'Afternoon', 'Evening'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeRange(t as any)}
                                className={cn(
                                    "px-3 py-2 rounded-full text-[13px] font-bold transition-all shadow-sm border",
                                    timeRange === t
                                        ? "bg-[var(--color-accent)] text-[var(--color-bg)] border-transparent shadow-[0_0_10px_var(--color-accent)]"
                                        : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Reminders Interface */}
                <Card className="flex-col p-0 overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-premium)]">

                    <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
                        <span className="font-semibold text-[16px]">Reminders</span>
                        {/* Custom Switch Component */}
                        <button
                            onClick={() => setRemindersEnabled(!remindersEnabled)}
                            className={cn(
                                "w-[52px] h-[32px] rounded-full relative transition-colors duration-300 border border-[var(--color-border)]",
                                remindersEnabled ? "bg-[var(--color-accent)] border-transparent" : "bg-[var(--color-bg)]"
                            )}
                        >
                            <div className={cn(
                                "w-[26px] h-[26px] rounded-full absolute top-[2px] transition-transform duration-300 shadow-sm",
                                remindersEnabled ? "translate-x-[22px] bg-[var(--color-bg)]" : "translate-x-[2px] bg-[var(--color-text-secondary)]"
                            )} />
                        </button>
                    </div>

                    {remindersEnabled && (
                        <div className="flex-col p-5 pt-4">
                            <div className="flex items-center justify-between w-full mb-4">
                                <span className="font-semibold text-[16px] flex items-center gap-2">
                                    {reminderType}
                                    <span className="text-xs px-2 py-0.5 border border-[var(--color-border)] rounded-full text-[var(--color-text-secondary)] opacity-70">Active</span>
                                </span>
                                <button onClick={() => setShowReminderTypePopup(true)} className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] flex items-center justify-center shadow-[0_0_10px_var(--color-accent)] hover:scale-105 transition-transform">
                                    <Plus size={18} strokeWidth={3} />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={promptTime} className="text-[13px] font-bold bg-[var(--color-accent)] text-[var(--color-bg)] px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform">
                                    {customTime}
                                </button>
                                <button onClick={promptTime} className="text-[13px] font-bold bg-transparent border border-[var(--color-accent)] text-[var(--color-accent)] px-3 py-1.5 rounded-full shadow-sm hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors cursor-pointer">
                                    + Add
                                </button>
                            </div>

                            <div className="w-full h-[1px] bg-[var(--color-border)] my-5" />

                            <input
                                type="text"
                                placeholder="Reminder message"
                                value={memoMessage}
                                onChange={(e) => setMemoMessage(e.target.value)}
                                className="w-full bg-transparent font-medium text-[16px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 mb-5"
                            />

                            <div className="flex items-center justify-between w-full">
                                <span className="font-semibold text-[16px]">Show memo after completion</span>
                                <button
                                    onClick={() => setShowMemo(!showMemo)}
                                    className={cn(
                                        "w-[52px] h-[32px] rounded-full relative transition-colors duration-300 border border-[var(--color-border)]",
                                        showMemo ? "bg-[var(--color-accent)] border-transparent" : "bg-[var(--color-bg)]"
                                    )}
                                >
                                    <div className={cn(
                                        "w-[26px] h-[26px] rounded-full absolute top-[2px] transition-transform duration-300 shadow-sm",
                                        showMemo ? "translate-x-[22px] bg-[var(--color-bg)]" : "translate-x-[2px] bg-[var(--color-text-secondary)]"
                                    )} />
                                </button>
                            </div>
                        </div>
                    )}
                </Card>

            </div>

            {/* Simulated Bottom Sheet overlay for 'Reminder Type' */}
            <div className={cn("bottom-nav flex-col pt-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] rounded-t-[32px] backdrop-blur-[var(--glass-blur)] z-50 transition-transform duration-500", showReminderTypePopup ? "translate-y-0" : "translate-y-full")}>
                <div onClick={() => setShowReminderTypePopup(false)} className="w-12 h-1.5 bg-[var(--color-border)] rounded-full mt-3 mb-4 mx-auto cursor-pointer" />
                <div className="flex justify-between items-center mb-6 px-6 w-full">
                    <button onClick={() => setShowReminderTypePopup(false)} className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"><X size={24} /></button>
                    <h3 className="font-bold text-[17px]">Reminder Type</h3>
                    <div className="w-8" />
                </div>

                <div className="flex p-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full w-[calc(100%-48px)] mx-auto mb-6">
                    <button onClick={() => setReminderType('Time')} className={cn("flex-1 py-3 text-center rounded-full font-bold text-[15px] transition-colors", reminderType === 'Time' ? "bg-[var(--color-accent)] text-[var(--color-bg)] shadow-[0_0_10px_var(--color-accent)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}>
                        Time
                    </button>
                    <button onClick={() => setReminderType('Location')} className={cn("flex-1 py-3 text-center rounded-full font-bold text-[15px] transition-colors", reminderType === 'Location' ? "bg-[var(--color-accent)] text-[var(--color-bg)] shadow-[0_0_10px_var(--color-accent)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}>
                        Location
                    </button>
                </div>
            </div>
        </div>
    );
};
