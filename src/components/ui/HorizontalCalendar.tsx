import React, { useMemo } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { cn } from './Card';
import { Smile } from 'lucide-react';

interface HorizontalCalendarProps {
    currentDate: string;
    onDateSelect: (date: string) => void;
}

export const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({ currentDate, onDateSelect }) => {

    // Generate 7 days mapping
    const days = useMemo(() => {
        const today = new Date();
        const dates = [];
        for (let i = 5; i >= 0; i--) dates.push(subDays(today, i));
        dates.push(addDays(today, 1));
        return dates;
    }, []);

    return (
        <div className="flex-col w-full">
            <div className="flex flex-row items-center justify-between mb-4 mt-2">
                <button className="text-[11px] bg-[#ff85a2] text-white px-3 py-1.5 rounded-full font-bold shadow-sm">All ⌄</button>
                <h2 className="text-[17px] font-bold tracking-wide">Today</h2>
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex flex-col items-center justify-center border border-yellow-200 shadow-sm relative">
                    <Smile size={18} className="text-yellow-600" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                </div>
            </div>

            <div className="flex flex-row justify-between w-full">
                {days.map((date) => {
                    const localISO = format(date, 'yyyy-MM-dd');
                    const isToday = localISO === format(new Date(), 'yyyy-MM-dd');

                    return (
                        <div key={date.getTime()} className="flex-col items-center gap-2 cursor-pointer relative" onClick={() => onDateSelect(localISO)}>
                            <span className={cn("text-[11px] font-medium", localISO === currentDate ? "text-[#ff85a2] font-bold" : "text-[var(--color-text-secondary)]")}>{format(date, 'EE')}</span>

                            {/* Dummy streak fire indicators over past days */}
                            {!isToday && date < new Date() && (
                                <div className="absolute top-[18px] text-[8px] z-10 transition-all">💥</div>
                            )}

                            <div className={cn(
                                "w-[36px] h-[36px] rounded-full flex items-center justify-center text-[13px] font-bold transition-all mt-1",
                                isToday
                                    ? "bg-white text-[var(--color-text-primary)] border border-[#ff85a2] shadow-sm relative ring-2 ring-[#ff85a2]/20 ring-offset-2 ring-offset-[var(--color-bg)]"
                                    : localISO === currentDate
                                        ? "bg-white text-[#ff85a2] shadow-sm"
                                        : "bg-transparent text-[var(--color-text-secondary)] border border-transparent hover:border-black/5"
                            )}>
                                {format(date, 'd')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
