import React, { useMemo, useState } from 'react';
import { usePulse } from '../store/PulseContext';
import { Card, cn } from '../components/ui/Card';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';
import { Sparkles, Activity, CalendarDays } from 'lucide-react';

type TimeRange = 7 | 14 | 30;

export const Analytics: React.FC = () => {
    const { activeProfile } = usePulse();
    const [range, setRange] = useState<TimeRange>(7);

    // Generate dynamic data structure
    const chartData = useMemo(() => {
        const data = [];
        const now = new Date();

        // Always calculate backwards from today
        for (let i = range - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const tzOffset = d.getTimezoneOffset() * 60000;
            const key = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10);

            const dayData = activeProfile.data[key];

            data.push({
                name: range === 7 ? format(d, 'EEE') : format(d, 'dd/MM'),
                score: dayData?.score || 0,
                water: dayData?.waterIntake || 0,
                sleep: dayData?.sleepHours || 0,
                mood: dayData?.mood || 'normal',
                isLogged: dayData?.isLogged || false
            });
        }
        return data;
    }, [activeProfile.data, range]);

    // Next-Gen Insight logic
    const generatedInsight = useMemo(() => {
        const loggedDays = chartData.filter(d => d.isLogged);
        if (loggedDays.length < 3) return "Log your data for at least 3 days to unlock AI insights.";

        // Sort by score
        const sortedByScore = [...loggedDays].sort((a, b) => b.score - a.score);
        const highestDay = sortedByScore[0];
        const lowestDay = sortedByScore[sortedByScore.length - 1];

        // Check correlation between sleep and mood
        const tiredDays = loggedDays.filter(d => d.mood === 'tired');
        if (tiredDays.length >= 2) {
            const avgSleepOnTiredDays = tiredDays.reduce((acc, curr) => acc + curr.sleep, 0) / tiredDays.length;
            if (avgSleepOnTiredDays < activeProfile.targets.sleep) {
                return `Pattern detected: You consistently log 'Exhausted' moods when sleeping under ${activeProfile.targets.sleep} hours. Prioritize rest tonight!`;
            }
        }

        // Check water consistency
        const highWaterDays = loggedDays.filter(d => d.water >= activeProfile.targets.water);
        if (highWaterDays.length > loggedDays.length * 0.7) {
            return `Excellent hydration! You hit your water goal ${highWaterDays.length} times recently. This strongly correlates with high daily scores.`;
        }

        if (highestDay.score > 80) {
            return `Your peak performance was on ${highestDay.name} (${highestDay.score}%). Try replicating that routine!`;
        }

        if (lowestDay.score < 40 && lowestDay.name !== format(new Date(), 'EEE')) {
            return `Rough patch on ${lowestDay.name}, but recovery is everything. Focus on one small habit today.`;
        }

        return "Consistency is building! Keep tracking daily to reveal deeper behavioral patterns.";
    }, [chartData, activeProfile.targets]);

    return (
        <div className="flex-col gap-6 animate-pop-in">
            <header className="flex-col w-full mb-2">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Activity className="text-[var(--color-accent)]" />
                    Advanced Insights
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Behavioral mapping engine</p>
            </header>

            {/* Range Toggle */}
            <div className="flex bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)] w-full relative z-10">
                {[7, 14, 30].map((r) => (
                    <button
                        key={r}
                        onClick={() => setRange(r as TimeRange)}
                        className={cn(
                            "flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-300",
                            range === r ? "bg-[var(--color-accent)] text-white shadow-md" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        )}
                    >
                        {r}D
                    </button>
                ))}
            </div>

            {/* AI Insight Card */}
            <Card variant="gradient" className="flex-row items-center gap-4 py-5 px-6 shadow-[var(--shadow-premium)] relative overflow-hidden mt-[-10px]">
                <div className="absolute -right-4 -top-4 opacity-20 transform rotate-12">
                    <Sparkles size={100} />
                </div>
                <div className="flex-col z-10">
                    <span className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1 flex items-center gap-1"><CalendarDays size={12} /> AI Analysis</span>
                    <p className="text-sm text-white font-medium leading-relaxed">{generatedInsight}</p>
                </div>
            </Card>

            {/* Overall Score Area Chart */}
            <Card className="flex-col gap-4">
                <div className="flex justify-between items-center w-full">
                    <h3 className="font-semibold">Performance Curve</h3>
                    <span className="text-[10px] bg-[var(--color-surface)] px-2 py-1 rounded-md text-[var(--color-text-secondary)] border border-[var(--color-border)] uppercase">{range} Days</span>
                </div>
                <div className="h-48 w-full -ml-4 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="var(--color-border)" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--color-text-primary)' }}
                                labelStyle={{ color: 'var(--color-text-secondary)' }}
                            />
                            <Area type="monotone" dataKey="score" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-accent)' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Water & Sleep Bar Chart */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="flex-col gap-4">
                    <h3 className="font-semibold text-sm truncate">Hydration Trends</h3>
                    <div className="h-32 w-full mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <Tooltip cursor={{ fill: 'var(--color-surface-hover)' }} contentStyle={{ backgroundColor: 'var(--color-surface)', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="water" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="flex-col gap-4">
                    <h3 className="font-semibold text-sm truncate">Sleep Cycles</h3>
                    <div className="h-32 w-full mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <Tooltip cursor={{ fill: 'var(--color-surface-hover)' }} contentStyle={{ backgroundColor: 'var(--color-surface)', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="sleep" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="h-6 w-full"></div>
        </div>
    );
}
