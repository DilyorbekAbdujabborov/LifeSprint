import { useState } from 'react';
import { Users, BookOpen, DollarSign, BarChart3, Shield } from 'lucide-react';
import { EmptyState } from './Skeleton';

export default function AdminPanel() {
  const [adminTab, setAdminTab] = useState<'users' | 'courses' | 'payments' | 'stats'>('users');

  const adminTabs = [
    { id: 'users', label: "Foydalanuvchilar", icon: Users },
    { id: 'courses', label: 'Kurslar', icon: BookOpen },
    { id: 'payments', label: "To'lovlar", icon: DollarSign },
    { id: 'stats', label: 'Statistika', icon: BarChart3 },
  ];

  const renderTab = () => {
    switch (adminTab) {
      case 'users':
        return (
          <EmptyState
            icon={Users}
            title="Foydalanuvchilar paneli"
            description="Foydalanuvchilar ro'yxati va boshqaruvi ishlab chiqilmoqda."
          />
        );
      case 'courses':
        return (
          <EmptyState
            icon={BookOpen}
            title="Kurslar paneli"
            description="Kurslarni boshqarish va monitoring qilish ishlab chiqilmoqda."
          />
        );
      case 'payments':
        return (
          <EmptyState
            icon={DollarSign}
            title="To'lovlar paneli"
            description="To'lov tizimi va tranzaksiyalar ishlab chiqilmoqda."
          />
        );
      case 'stats':
        return (
          <EmptyState
            icon={BarChart3}
            title="Statistika paneli"
            description="Platforma statistika va tahlillar ishlab chiqilmoqda."
          />
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      <nav className="flex gap-2 overflow-x-auto pb-3 border-b border-gray-200 dark:border-slate-800 scrollbar-thin" aria-label="Admin panellari">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
              adminTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-[#151433] text-gray-600 dark:text-slate-300 border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50'
            }`}
            type="button"
            aria-current={adminTab === tab.id ? 'page' : undefined}
          >
            <tab.icon className="w-3.5 h-3.5 inline mr-1.5" />
            {tab.label}
          </button>
        ))}
      </nav>
      {renderTab()}
    </div>
  );
}
