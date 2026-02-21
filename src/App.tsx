import { useEffect, useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { Dashboard } from './views/Dashboard'
import { Analytics } from './views/Analytics'
import { ProfileSettings } from './views/Profile'
import { HabitDetails } from './views/HabitDetails'
import { usePulse } from './store/PulseContext'
import './index.css'

function App() {
  const { activeProfile } = usePulse();
  const [activeTab, setActiveTab] = useState<'home' | 'journal' | 'analytics' | 'profile'>('home');
  const [editingHabit, setEditingHabit] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeProfile.theme);
  }, [activeProfile.theme]);

  useEffect(() => {
    const handleNavigation = ((e: CustomEvent) => setEditingHabit(e.detail)) as EventListener;
    window.addEventListener('NAVIGATE_TO_HABIT', handleNavigation);
    return () => window.removeEventListener('NAVIGATE_TO_HABIT', handleNavigation);
  }, []);

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'journal': return <div className="text-center mt-20 text-[var(--color-text-secondary)]">History view coming soon! (Use Analytics for 7-day map)</div>;
      case 'analytics': return <Analytics />;
      case 'profile': return <ProfileSettings />;
      default: return <Dashboard />;
    }
  };

  if (editingHabit) {
    return <HabitDetails habitId={editingHabit} onBack={() => setEditingHabit(null)} />
  }

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderView()}
    </AppLayout>
  )
}

export default App
