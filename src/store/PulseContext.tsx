import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import debounce from 'lodash/debounce';

export type Mood = 'happy' | 'normal' | 'stressed' | 'tired' | null;
export type SleepQuality = 'excellent' | 'good' | 'fair' | 'poor' | null;
export type HabitWeight = 1 | 2 | 3; // 1=Normal, 2=High Impact, 3=Critical

export interface DailyData {
    waterIntake: number;
    sleepHours: number;
    sleepQuality: SleepQuality;
    mood: Mood;
    prayers: {
        fajr: boolean;
        zuhr: boolean;
        asr: boolean;
        maghrib: boolean;
        isha: boolean;
    };
    exercise: boolean;
    quranDhikr: boolean;
    notes: string;
    weight: number | null;
    customHabits: Record<string, boolean>; // habitId -> completed
    score: number; // 0-100%
    isLogged: boolean; // True if any interacting happened (to distinguish empty days)
}

export interface CustomHabitDef {
    id: string;
    label: string;
    weight: HabitWeight;
}

export interface UserProfile {
    id: string;
    name: string;
    theme: 'dark' | 'light' | 'islamic' | 'pastel';
    habits: CustomHabitDef[];
    targets: {
        water: number;
        sleep: number;
    };
    data: Record<string, DailyData>;
}

interface PulseState {
    profiles: UserProfile[];
    currentProfileId: string;
    currentDate: string; // ISO yyyy-MM-dd
}

interface PulseContextType {
    state: PulseState;
    activeProfile: UserProfile;
    todayData: DailyData;
    switchProfile: (id: string) => void;
    addProfile: (name: string, theme: UserProfile['theme']) => void;
    changeDate: (date: string) => void;
    updateDailyData: (updates: Partial<DailyData>) => void;
    updateTheme: (theme: UserProfile['theme']) => void;
    updateTargets: (water: number, sleep: number) => void;
    addHabit: (label: string, weight: HabitWeight) => void;
    removeHabit: (id: string) => void;
    getConsistencyRatio: (days: 7 | 14 | 30) => number;
    getCurrentStreak: () => number;
}

const DEFAULT_DAILY_DATA: DailyData = {
    waterIntake: 0,
    sleepHours: 0,
    sleepQuality: null,
    mood: null,
    prayers: { fajr: false, zuhr: false, asr: false, maghrib: false, isha: false },
    exercise: false,
    quranDhikr: false,
    notes: '',
    weight: null,
    customHabits: {},
    score: 0,
    isLogged: false, // Smart Empty checking
};

const DEFAULT_PROFILE: UserProfile = {
    id: 'default',
    name: 'Personal',
    theme: 'pastel',
    targets: { water: 8, sleep: 7 },
    habits: [
        { id: 'yoga', label: 'Yoga', weight: 1 },
        { id: 'h1', label: 'Read 10 pages', weight: 1 },
        { id: 'h2', label: 'Meditate', weight: 2 }
    ],
    data: {},
};

const getTodayLocalISO = () => {
    // Offset local timezone safely to guarantee yyyy-mm-dd format local day
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
};

const PulseContext = createContext<PulseContextType | undefined>(undefined);

export const PulseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<PulseState>(() => {
        const saved = localStorage.getItem('daypulse-v2-storage');
        const today = getTodayLocalISO();

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Data structural migrations could go here if moving from v1 MVP to v2
                return { ...parsed, currentDate: today };
            } catch (e) {
                console.error("Failed to parse local storage daypulse backup", e);
            }
        }
        return {
            profiles: [DEFAULT_PROFILE],
            currentProfileId: 'default',
            currentDate: today,
        };
    });

    // Safe debounced saving to prevent React heavy 60fps renders causing storage lag
    const debouncedSave = useMemo(
        () => debounce((val: PulseState) => {
            localStorage.setItem('daypulse-v2-storage', JSON.stringify(val));
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSave(state);

        const active = state.profiles.find(p => p.id === state.currentProfileId);
        if (active) {
            document.documentElement.setAttribute('data-theme', active.theme);
        }
        return () => debouncedSave.cancel();
    }, [state, debouncedSave]);

    const activeProfile = useMemo(() => {
        return state.profiles.find(p => p.id === state.currentProfileId) || state.profiles[0];
    }, [state.profiles, state.currentProfileId]);

    const todayData = useMemo(() => {
        return activeProfile.data[state.currentDate] || { ...DEFAULT_DAILY_DATA };
    }, [activeProfile.data, state.currentDate]);

    // Unified score algorithm using profile targets and weighted habits!
    const calculateScore = useCallback((data: DailyData, profile: UserProfile): number => {
        if (!data.isLogged) return 0; // Don't calculate if strictly empty

        let earned = 0;
        let total = 0;

        // Water Weight = 15 points
        total += 15;
        earned += Math.min(data.waterIntake / profile.targets.water, 1) * 15;

        // Sleep Weight = 15 points
        total += 15;
        if (data.sleepHours >= profile.targets.sleep) earned += 15;
        else if (data.sleepHours >= (profile.targets.sleep - 2)) earned += 10;
        else if (data.sleepHours > 0) earned += 5;

        // Mood Logged? = 5 points
        if (data.mood) { total += 5; earned += 5; }

        // Prayers (5 pts each) = 25 points
        const prayerVals = Object.values(data.prayers);
        total += 25;
        earned += prayerVals.filter(Boolean).length * 5;

        // Exercise = 15 points
        total += 15;
        if (data.exercise) earned += 15;

        // Quran/Dhikr = 10 points
        total += 10;
        if (data.quranDhikr) earned += 10;

        // Custom Habits (Weighted Math) = 15 points Base
        if (profile.habits.length > 0) {
            let maxHabitPoints = 0;
            let earnedHabitPoints = 0;

            profile.habits.forEach(h => {
                maxHabitPoints += h.weight;
                if (data.customHabits[h.id]) earnedHabitPoints += h.weight;
            });

            total += 15;
            earned += (earnedHabitPoints / maxHabitPoints) * 15;
        }

        if (total === 0) return 0;
        return Math.round((earned / total) * 100);
    }, []);

    const switchProfile = useCallback((id: string) => {
        setState(s => ({ ...s, currentProfileId: id, currentDate: getTodayLocalISO() }));
    }, []);

    const changeDate = useCallback((date: string) => {
        setState(s => ({ ...s, currentDate: date }));
    }, []);

    const updateTheme = useCallback((theme: UserProfile['theme']) => {
        setState(s => ({
            ...s,
            profiles: s.profiles.map(p => p.id === s.currentProfileId ? { ...p, theme } : p)
        }));
    }, []);

    const updateTargets = useCallback((water: number, sleep: number) => {
        setState(s => ({
            ...s,
            profiles: s.profiles.map(p => p.id === s.currentProfileId ? { ...p, targets: { water, sleep } } : p)
        }));
    }, []);

    const addHabit = useCallback((label: string, weight: HabitWeight) => {
        setState(s => ({
            ...s,
            profiles: s.profiles.map(p => {
                if (p.id !== s.currentProfileId) return p;
                const newHabit: CustomHabitDef = { id: Date.now().toString(), label, weight };
                return { ...p, habits: [...p.habits, newHabit] };
            })
        }));
    }, []);

    const removeHabit = useCallback((id: string) => {
        setState(s => ({
            ...s,
            profiles: s.profiles.map(p => {
                if (p.id !== s.currentProfileId) return p;
                return { ...p, habits: p.habits.filter(h => h.id !== id) };
            })
        }));
    }, []);

    const addProfile = useCallback((name: string, theme: UserProfile['theme']) => {
        const newId = Date.now().toString();
        const newProfile: UserProfile = { ...DEFAULT_PROFILE, id: newId, name, theme, data: {} };
        setState(s => ({ ...s, profiles: [...s.profiles, newProfile], currentProfileId: newId }));
    }, []);

    const updateDailyData = useCallback((updates: Partial<DailyData>) => {
        setState(s => {
            const pIndex = s.profiles.findIndex(p => p.id === s.currentProfileId);
            if (pIndex === -1) return s;

            const profile = s.profiles[pIndex];
            const existingData = profile.data[s.currentDate] || { ...DEFAULT_DAILY_DATA };
            const mergedData = { ...existingData, ...updates, isLogged: true };

            mergedData.score = calculateScore(mergedData, profile);

            const updatedProfile = {
                ...profile,
                data: { ...profile.data, [s.currentDate]: mergedData }
            };

            const newProfiles = [...s.profiles];
            newProfiles[pIndex] = updatedProfile;
            return { ...s, profiles: newProfiles };
        });
    }, [calculateScore]);

    // Advanced Math queries wrapped in useCallback for referential stability
    const getConsistencyRatio = useCallback((days: 7 | 14 | 30) => {
        let totalScore = 0;
        let loggedDays = 0;
        const now = new Date(state.currentDate);

        for (let i = 0; i < days; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            // Safe local ISO string generator
            const tzOffset = d.getTimezoneOffset() * 60000;
            const dayKey = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10);

            const dData = activeProfile.data[dayKey];
            if (dData && dData.isLogged) {
                totalScore += dData.score;
                loggedDays++;
            }
        }
        // Don't penalize completely empty unwritten days in average
        return loggedDays > 0 ? Math.round(totalScore / loggedDays) : 0;
    }, [activeProfile.data, state.currentDate]);

    const getCurrentStreak = useCallback(() => {
        let streak = 0;
        const now = new Date(state.currentDate);

        // Streak logic matching requirements: >50% score threshold, gracefully skips a purely empty today if yesterday was solid.
        for (let i = 0; i < 365; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const tzOffset = d.getTimezoneOffset() * 60000;
            const dayKey = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10);

            const dData = activeProfile.data[dayKey];
            const isSolidCheck = dData && dData.isLogged && dData.score > 50;

            if (isSolidCheck) {
                streak++;
            } else if (i === 0 && (!dData || !dData.isLogged)) {
                // It's today, and it's completely empty. Don't break the streak yet, wait until tomorrow.
                continue;
            } else {
                break;
            }
        }
        return streak;
    }, [activeProfile.data, state.currentDate]);

    const contextValue = useMemo(() => ({
        state,
        activeProfile,
        todayData,
        switchProfile,
        changeDate,
        updateDailyData,
        getConsistencyRatio,
        getCurrentStreak,
        addProfile,
        updateTheme,
        updateTargets,
        addHabit,
        removeHabit
    }), [
        state, activeProfile, todayData, switchProfile, changeDate, updateDailyData,
        getConsistencyRatio, getCurrentStreak, addProfile, updateTheme, updateTargets,
        addHabit, removeHabit
    ]);

    return (
        <PulseContext.Provider value={contextValue}>
            {children}
        </PulseContext.Provider>
    );
};

export const usePulse = () => {
    const context = useContext(PulseContext);
    if (!context) throw new Error('usePulse must be used within a PulseProvider');
    return context;
};
