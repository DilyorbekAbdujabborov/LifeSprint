import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  Plus,
  Send,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Habit } from '../types';
import CustomSelect from './CustomSelect';
import { useToast } from '../toast';

interface ParentPanelProps {
  habits: Habit[];
  xp: number;
}

export default function ParentPanel({ habits, xp }: ParentPanelProps) {
  const { toast } = useToast();
  const [activeRole, setActiveRole] = useState<'parent' | 'teacher'>('parent');

  // Teacher homework state
  const [homeworks, setHomeworks] = useState([
    { id: 'hw1', subject: 'SAT Math', topic: 'Algebra va Funksiyalar mustahkamlash', deadline: '2026-07-12', status: 'Bajarildi' },
    { id: 'hw2', subject: 'IELTS Writing', topic: 'Task 2 Opinion Essay yozish', deadline: '2026-07-15', status: 'Kutilmoqda' }
  ]);
  const [newHwSubject, setNewHwSubject] = useState('SAT Math');
  const [newHwTopic, setNewHwTopic] = useState('');
  const [newHwDeadline, setNewHwDeadline] = useState('2026-07-15');

  const handleCreateHomework = () => {
    if (!newHwTopic.trim()) return;
    const newHw = {
      id: `hw${homeworks.length + 1}`,
      subject: newHwSubject,
      topic: newHwTopic,
      deadline: newHwDeadline,
      status: 'Kutilmoqda'
    };
    setHomeworks([...homeworks, newHw]);
    setNewHwTopic('');
    toast("Yangi uy vazifasi muvaffaqiyatli topshirildi!", 'success');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto max-w-7xl mx-auto" id="parent_panel_container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="parent_panel_header">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Nazorat & Kuzatuv Paneli</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ota-onalar va o'qituvchilar uchun farzand yoki talabalarning kunlik o'sish dinamikasi hamda uy vazifalari topshiriqlari.
          </p>
        </div>

        {/* Role toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
          <button
            id="role_parent_btn"
            onClick={() => setActiveRole('parent')}
            className={`px-4 py-2 font-semibold rounded-lg flex items-center gap-1.5 ${
              activeRole === 'parent' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            Ota-onalar paneli
          </button>
          <button
            id="role_teacher_btn"
            onClick={() => setActiveRole('teacher')}
            className={`px-4 py-2 font-semibold rounded-lg flex items-center gap-1.5 ${
              activeRole === 'teacher' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            O'qituvchilar paneli
          </button>
        </div>
      </div>

      {activeRole === 'parent' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="parent_grid">
          {/* Main stats Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-black">Farzandingizning Akademik va Intizom Ko'rsatkichi</h3>
              <p className="text-xs text-gray-400">
                Ushbu ma'lumotlar farzandingizning platformadagi faolligi asosida real vaqtda yangilanadi.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="parent_stats_grid">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Muntazamlik Balli</span>
                  <p className="text-2xl font-bold text-black font-mono mt-1">{xp} XP</p>
                  <p className="text-[10px] text-green-600 mt-1">Sinfdoshlaridan 12% faolroq</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Bugungi odatlar holati</span>
                  <p className="text-2xl font-bold text-black font-mono mt-1">
                    {habits.filter(h => h.currentValue >= h.targetValue).length} / {habits.length}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">Sertifikat uchun muhim odatlar</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Bajarilgan dars taymerlari</span>
                  <p className="text-2xl font-bold text-black font-mono mt-1">14 marta</p>
                  <p className="text-[10px] text-indigo-600 mt-1">Diqqatni jamlash ko'rsatkichi juda yaxshi</p>
                </div>
              </div>
            </div>

            {/* AI Recommendation for Parents */}
            <div className="bg-radial from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-100 shadow-xs space-y-4" id="parent_recommendations_card">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-bold text-amber-950">AI Ota-ona uchun tavsiyalar</h4>
              </div>
              <div className="text-xs text-amber-900 leading-relaxed font-medium space-y-2.5">
                <p>• Farzandingiz bugun dars qilish taymerini (Deep Work) 3 marta muvaffaqiyatli bajardi. Akademik tomondan dars tayyorlashi juda yuqori darajada.</p>
                <p>• Biroq jismoniy mashg'ulot odati (Workout) bir necha kundan buyon oqsmoqda. Farzandingizni biroz ochiq havoda sayr qilishga yoki dam olishga undashingizni maslahat beramiz.</p>
              </div>
            </div>
          </div>

          {/* Right Side Info */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5" id="parent_right_column">
            <h3 className="text-base font-bold text-black">Ota-ona uchun Bog'lanish</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Agar farzandingizning o'qishi yoki tayyorgarlik darajasi bo'yicha maxsus savollaringiz bo'lsa, konsultatsiya bo'limidagi o'qituvchilar bilan bevosita bog'lanishingiz mumkin.
            </p>
          </div>
        </div>
      )}

      {activeRole === 'teacher' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="teacher_grid">
          {/* Homework assignment Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5" id="teacher_assignment_card">
              <h3 className="text-lg font-bold text-black flex items-center gap-2">
                <Plus className="w-5 h-5 text-gray-500" /> Yangi uy vazifasi biriktirish
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">Fan:</label>
                  <CustomSelect
                    value={newHwSubject}
                    onChange={setNewHwSubject}
                    options={[
                      { value: 'SAT Math', label: 'SAT Math' },
                      { value: 'IELTS Writing', label: 'IELTS Writing' },
                      { value: 'IELTS Reading', label: 'IELTS Reading' },
                    ]}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600">Mavzu va yo'riqnoma:</label>
                  <input
                    id="teacher_topic_input"
                    type="text"
                    value={newHwTopic}
                    onChange={(e) => setNewHwTopic(e.target.value)}
                    placeholder="Masalan: 30 ta qiyin darajali tenglamalar yechish..."
                    className="w-full text-xs p-2.5 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 block">Topshirish muddati:</label>
                  <input
                    id="teacher_deadline_input"
                    type="date"
                    value={newHwDeadline}
                    onChange={(e) => setNewHwDeadline(e.target.value)}
                    className="text-xs bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl text-gray-700"
                  />
                </div>
                <button
                  id="submit_assignment_btn"
                  onClick={handleCreateHomework}
                  className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-900 transition"
                >
                  Vazifa biriktirish
                </button>
              </div>
            </div>

            {/* List of assigned Homeworks */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5" id="homeworks_list_card">
              <h3 className="text-base font-bold text-black">Biriktirilgan Uy Vazifalari</h3>
              <div className="space-y-3" id="assigned_homeworks_list">
                {homeworks.map((hw) => (
                  <div key={hw.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-gray-800">{hw.topic}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Fan: {hw.subject} | Muddat: {hw.deadline}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      hw.status === 'Bajarildi' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {hw.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side info for Teachers */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5" id="teacher_right_column">
            <h3 className="text-base font-bold text-black">O'qituvchilar uchun eslatma</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              O'quvchining barcha yechgan SAT/IELTS testlari natijalari avtomatik tahlil qilinadi. Siz har doim hisobotlarni yuklab olishingiz mumkin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
