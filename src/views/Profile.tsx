import React, { useState } from 'react';
import { usePulse, type UserProfile } from '../store/PulseContext';
import { Card, cn } from '../components/ui/Card';
import { Settings, UserPlus, FileDown, Plus, Trash2 } from 'lucide-react';

const THEME_OPTIONS: { id: UserProfile['theme']; label: string; bg: string }[] = [
    { id: 'dark', label: 'Dark Luxury', bg: 'bg-[#0a0a0c]' },
    { id: 'light', label: 'Soft Light', bg: 'bg-[#f8f9fa]' },
    { id: 'islamic', label: 'Islamic Green', bg: 'bg-[#0b1a13]' },
    { id: 'pastel', label: 'Cute Pastel', bg: 'bg-[#fff1f2]' },
];

export const ProfileSettings: React.FC = () => {
    const { state, activeProfile, switchProfile, addProfile, updateTheme, addHabit, removeHabit } = usePulse();
    const [newProfileName, setNewProfileName] = useState('');
    const [isAddingProfile, setIsAddingProfile] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitWeight, setNewHabitWeight] = useState<1 | 2 | 3>(1);

    const handleAddProfile = () => {
        if (newProfileName.trim() === '') return;
        addProfile(newProfileName.trim(), 'dark');
        setNewProfileName('');
        setIsAddingProfile(false);
    };

    const handleAddHabit = () => {
        if (newHabitName.trim() === '') return;
        addHabit(newHabitName.trim(), newHabitWeight);
        setNewHabitName('');
        setNewHabitWeight(1);
    };

    const handleExportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `DayPulse_Backup_${activeProfile.name}.json`);
        dlAnchorElem.click();
    };

    return (
        <div className="flex-col gap-6 animate-pop-in">

            <header className="flex-col w-full mb-2">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="text-[var(--color-text-secondary)]" />
                    Settings
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage profiles, themes, and backups</p>
            </header>

            {/* Profiles List */}
            <div className="flex-col gap-3">
                <h3 className="font-semibold text-lg flex items-center justify-between">
                    Active Profiles
                    <button
                        onClick={() => setIsAddingProfile(!isAddingProfile)}
                        className="flex items-center gap-1 text-xs text-[var(--color-accent)] bg-[var(--color-surface)] px-3 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all"
                    >
                        <UserPlus size={14} /> Add Profile
                    </button>
                </h3>

                {isAddingProfile && (
                    <Card className="flex items-center gap-2 p-3 bg-transparent border-dashed">
                        <input
                            autoFocus
                            value={newProfileName}
                            onChange={e => setNewProfileName(e.target.value)}
                            placeholder="e.g., Wife, Custom"
                            className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                        />
                        <button onClick={handleAddProfile} className="btn-primary py-2 px-4 text-sm scale-90">Create</button>
                    </Card>
                )}

                <div className="grid grid-cols-2 gap-3 mt-2">
                    {state.profiles.map(p => (
                        <Card
                            key={p.id}
                            interactive
                            onClick={() => switchProfile(p.id)}
                            className={cn(
                                "flex-row items-center justify-between py-4 px-4 transition-all duration-300",
                                p.id === activeProfile.id ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/50" : "bg-[var(--color-surface)]"
                            )}
                        >
                            <span className={cn("font-medium", p.id === activeProfile.id ? "text-[var(--color-accent)]" : "")}>
                                {p.name}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-[var(--color-surface-hover)] border flex justify-center items-center text-xs font-bold shadow-inner">
                                {p.name.charAt(0)}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Custom Habit Manager */}
            <div className="flex-col gap-3 mt-4">
                <Card className="flex items-center gap-2 p-3 bg-[var(--color-surface)] border-[var(--color-border)]">
                    <input
                        value={newHabitName}
                        onChange={e => setNewHabitName(e.target.value)}
                        placeholder="e.g. Read 10 pages"
                        className="flex-1 min-w-0 bg-transparent border-none px-2 text-sm text-[var(--color-text-primary)] outline-none"
                    />
                    <select
                        value={newHabitWeight}
                        onChange={e => setNewHabitWeight(Number(e.target.value) as 1 | 2 | 3)}
                        className="bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs rounded-md px-1 py-1.5 text-[var(--color-text-secondary)] outline-none"
                    >
                        <option value={1}>Normal</option>
                        <option value={2}>High (x2)</option>
                        <option value={3}>Critical (x3)</option>
                    </select>
                    <button onClick={handleAddHabit} className="w-8 h-8 rounded-full flex-shrink-0 bg-[var(--color-accent)] text-white flex items-center justify-center hover:scale-105 transition-transform"><Plus size={16} /></button>
                </Card>
                <div className="flex-col gap-2 mt-1">
                    {activeProfile.habits.map(h => (
                        <div key={h.id} className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{h.label}</span>
                                {h.weight > 1 && <span className="text-[10px] text-[var(--color-accent)] font-bold uppercase mt-0.5">Multiplier x{h.weight}</span>}
                            </div>
                            <button onClick={() => removeHabit(h.id)} className="text-red-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Theme Switcher */}
            <div className="flex-col gap-3 mt-4">
                <h3 className="font-semibold text-lg">Aesthetic Theme</h3>
                <div className="grid grid-cols-2 gap-3 mt-1">
                    {THEME_OPTIONS.map(theme => (
                        <Card
                            key={theme.id}
                            interactive
                            onClick={() => updateTheme(theme.id)}
                            className={cn(
                                "flex-row items-center gap-3 py-4",
                                activeProfile.theme === theme.id ? "border-[var(--color-text-primary)] opacity-100 shadow-md ring-2 ring-[var(--color-accent)]/50" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                            )}
                        >
                            <div className={cn("w-6 h-6 rounded-full border border-gray-400 shadow-sm", theme.bg)} />
                            <span className="text-sm font-medium">{theme.label}</span>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Data Backup */}
            <div className="flex-col gap-3 mt-4">
                <h3 className="font-semibold text-lg text-[var(--color-text-secondary)]">Data Control</h3>
                <button onClick={handleExportData} className="w-full flex items-center justify-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] py-4 rounded-xl font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-all">
                    <FileDown size={18} /> Export JSON Backup
                </button>
                <p className="text-xs text-center text-[var(--color-text-secondary)] opacity-70 mt-1">
                    Everything lives privately on your device. Sync locally.
                </p>
            </div>

            <div className="h-6 w-full"></div>
        </div>
    );
};
