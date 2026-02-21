import React, { type ReactNode } from 'react';
import { Home, CalendarDays, BarChart2, User } from 'lucide-react';
import { cn } from '../ui/Card';

interface AppLayoutProps {
    children: ReactNode;
    activeTab: 'home' | 'journal' | 'analytics' | 'profile';
    onTabChange: (tab: 'home' | 'journal' | 'analytics' | 'profile') => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="app-container">
            <div className="content-area">
                {children}
            </div>

            <nav className="bottom-nav">
                <button
                    onClick={() => onTabChange('home')}
                    className={cn('nav-item', activeTab === 'home' && 'active')}
                >
                    <Home size={24} />
                    <span className="text-[10px] font-medium mt-1">Today</span>
                </button>
                <button
                    onClick={() => onTabChange('journal')}
                    className={cn('nav-item', activeTab === 'journal' && 'active')}
                >
                    <CalendarDays size={24} />
                    <span className="text-[10px] font-medium mt-1">History</span>
                </button>
                <button
                    onClick={() => onTabChange('analytics')}
                    className={cn('nav-item', activeTab === 'analytics' && 'active')}
                >
                    <BarChart2 size={24} />
                    <span className="text-[10px] font-medium mt-1">Insights</span>
                </button>
                <button
                    onClick={() => onTabChange('profile')}
                    className={cn('nav-item', activeTab === 'profile' && 'active')}
                >
                    <User size={24} />
                    <span className="text-[10px] font-medium mt-1">Profile</span>
                </button>
            </nav>
        </div>
    );
};
