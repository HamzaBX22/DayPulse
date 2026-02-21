import { useEffect, useState } from 'react';
import { usePulse } from '../../store/PulseContext';
import { Card } from '../ui/Card';
import { PenLine } from 'lucide-react';

export const NotesTracker = () => {
    const { todayData, updateDailyData } = usePulse();
    const [localNotes, setLocalNotes] = useState(todayData.notes);

    // Sync state if date changes outside
    useEffect(() => {
        setLocalNotes(todayData.notes);
    }, [todayData.notes]);

    const handleBlur = () => {
        if (localNotes !== todayData.notes) {
            updateDailyData({ notes: localNotes });
        }
    };

    return (
        <Card className="flex-col gap-3">
            <h3 className="flex items-center gap-2 font-semibold">
                <PenLine size={18} className="text-[var(--color-text-secondary)]" />
                Daily Journal
            </h3>
            <textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                onBlur={handleBlur}
                placeholder="How was your day? Any specific reflections?"
                className="w-full h-28 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] resize-none focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/50 transition-all font-sans"
            />
        </Card>
    );
};
