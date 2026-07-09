import React, { useState } from 'react';
import {
  Swords, Puzzle, Mic, Search, GraduationCap, Clock, Globe, Brain, Users, ArrowLeft, Flame,
} from 'lucide-react';

const GAMES = [
  { id: 'boss_battle', title: 'AI Boss Battle', icon: Swords, gradient: 'from-red-600 via-orange-500 to-yellow-500', description: 'AI bilan bilim jangida kurashing! Har bir to\'g\'ri javob bilan bossga zarba bering va darajalar bo\'ylab yuksaling.' },
  { id: 'escape_room', title: 'AI Escape Room', icon: Puzzle, gradient: 'from-amber-600 via-yellow-500 to-orange-400', description: 'Mantiqiy topishmoqlarni yechib, virtual xonadan chiqish yo\'lini toping. Vaqtni yengib, eng tezkor qochishni uddalang!' },
  { id: 'roleplay', title: 'AI Rolliy O\'yin', icon: Mic, gradient: 'from-purple-600 via-pink-500 to-rose-400', description: 'AI bilan real hayotiy stsenariylar asosida suhbatlashing. Ingliz tilini amaliyotda o\'rganishning eng qiziqarli usuli.' },
  { id: 'detective', title: 'AI Detective', icon: Search, gradient: 'from-indigo-600 via-blue-500 to-cyan-400', description: 'Dallilarni tahlil qilib, murakkab jinoyatlarni fosh eting. Har bir yangi bosqichda mantiqiy fikrlash qobiliyatingizni sinang.' },
  { id: 'ai_student', title: 'AI Student', icon: GraduationCap, gradient: 'from-emerald-600 via-green-500 to-teal-400', description: 'AI sizning shaxsiy o\'quvchingizga aylanadi. Unga dars bering, savollar bering va bilimlaringizni mustahkamlang.' },
  { id: 'time_machine', title: 'Time Machine', icon: Clock, gradient: 'from-cyan-600 via-sky-500 to-teal-400', description: 'Tarixiy davrlarga sayohat qiling. Mashhur kashfiyotlar va voqealar haqida interaktiv tarzda o\'rganing.' },
  { id: 'virtual_world', title: 'Virtual Dunyo', icon: Globe, gradient: 'from-green-600 via-lime-500 to-emerald-400', description: '3D virtual olamda yangi bilimlarni kashf eting. Boshqa talabalar bilan birgalikda loyihalar ustida ishlang.' },
  { id: 'ai_difficulty', title: 'AI Difficulty', icon: Brain, gradient: 'from-violet-600 via-fuchsia-500 to-purple-400', description: 'AI sizning bilim darajangizga moslashadi. Eng murakkab savollardan tortib oddiy testlargacha — shaxsiy yondashuv.' },
  { id: 'multiplayer_ai', title: 'Multiplayer AI', icon: Users, gradient: 'from-rose-600 via-pink-500 to-red-400', description: 'Do\'stlaringiz bilan onlayn bellashing! Kim eng ko\'p ball to\'plashi va eng yuqori reytingga chiqishini ko\'ring.' },
];

export default function AiAdventures() {
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Ortga
        </button>

        {(() => {
          const game = GAMES.find(g => g.id === selected);
          if (!game) return null;
          const Icon = game.icon;
          return (
            <div className={`p-8 sm:p-10 rounded-3xl bg-gradient-to-br ${game.gradient} text-center space-y-5 shadow-2xl`}>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white drop-shadow-lg">{game.title}</h3>

              <p className="text-sm text-white/70 max-w-sm mx-auto">{game.description}</p>

              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Flame className="w-5 h-5 text-yellow-300" />
                <span className="text-base font-black text-white drop-shadow-md">Bu sohada ishlanmoqda</span>
                <Flame className="w-5 h-5 text-yellow-300" />
              </div>

              <button
                onClick={() => setSelected(null)}
                className="px-8 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm transition-all backdrop-blur-sm border border-white/30 cursor-pointer"
              >
                Boshqa o'yinlar
              </button>
            </div>
          );
        })()}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {GAMES.map(game => {
        const Icon = game.icon;
        return (
          <button
            key={game.id}
            onClick={() => setSelected(game.id)}
            className={`p-5 rounded-2xl bg-gradient-to-br ${game.gradient} text-left transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer shadow-lg`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="text-sm font-black text-white drop-shadow-sm">{game.title}</h4>
                <p className="text-[11px] text-white/60 mt-0.5">ishlov olib borilmoqda</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
