import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import * as api from '../api';
import { Trophy, Award, Flame, ClipboardList, Star, Crown, Shield, Zap, Gem, Lock, Check, Loader2, Gift, Repeat, Sparkles } from 'lucide-react';
import { EmptyState } from './Skeleton';
import type { GameAchievement, UserQuest, QuestDef, TitleDef, GameProfile } from '../types';

const RARITY_COLORS: Record<string, string> = {
  common: 'text-slate-400 border-slate-700/30 bg-slate-500/10',
  uncommon: 'text-emerald-400 border-emerald-700/30 bg-emerald-500/10',
  rare: 'text-blue-400 border-blue-700/30 bg-blue-500/10',
  epic: 'text-purple-400 border-purple-700/30 bg-purple-500/10',
  legendary: 'text-amber-400 border-amber-700/30 bg-amber-500/10',
};

const TIER_STYLES: Record<number, { label: string; color: string; icon: string }> = {
  1: { label: 'I Daraja', color: 'text-slate-400 border-slate-600/30 bg-slate-500/10', icon: 'Seedling' },
  2: { label: 'II Daraja', color: 'text-emerald-400 border-emerald-700/30 bg-emerald-500/10', icon: 'Flame' },
  3: { label: 'III Daraja', color: 'text-blue-400 border-blue-700/30 bg-blue-500/10', icon: 'Trophy' },
  4: { label: 'IV Daraja', color: 'text-purple-400 border-purple-700/30 bg-purple-500/10', icon: 'Crown' },
  5: { label: 'V Daraja (MAX)', color: 'text-amber-400 border-amber-700/30 bg-amber-500/10', icon: 'Star' },
};

function AchievementsTab() {
  const { achievements, gameProfile, setNewAchievements } = useStore();
  const unlocked = gameProfile?.achievementsUnlocked || [];
  const newAch = useStore(s => s.newAchievements);
  const [filter, setFilter] = useState<string>('all');

  const filtered = achievements.filter(a => {
    if (filter === 'locked') return !unlocked.includes(a.id);
    if (filter === 'unlocked') return unlocked.includes(a.id);
    return true;
  });

  useEffect(() => {
    if (newAch.length > 0) {
      const timer = setTimeout(() => setNewAchievements([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [newAch, setNewAchievements]);

  return (
    <div className="space-y-4">
      {newAch.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-center animate-pulse">
          <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-amber-300">Yangi yutuqlar ochildi!</p>
          {newAch.map(ach => (
            <p key={ach.id} className="text-xs text-amber-200/80">{ach.name} (+{ach.rewardXp} XP, +{ach.rewardCoins} coin)</p>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {['all', 'unlocked', 'locked'].map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'Barchasi' : f === 'unlocked' ? 'Ochilgan' : 'Yopiq'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Trophy} title="Yutuqlar topilmadi" description={filter === 'unlocked' ? 'Hali hech qanday yutuq ochilmagan' : 'Barcha yutuqlar ochilgan!'} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-800/40 border-slate-700/50'
                    : 'bg-slate-900/30 border-slate-800/30 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${isUnlocked ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800/50 text-slate-600'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold truncate ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                        {ach.name}
                      </h4>
                      {isUnlocked && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ach.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${RARITY_COLORS[ach.rarity] || RARITY_COLORS.common}`}>
                        {ach.rarity}
                      </span>
                      <span className="text-[10px] text-amber-400/70 font-mono">+{ach.rewardXp} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QuestsTab() {
  const { gameProfile, questDefs, loadGameProfile } = useStore();
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');
  const [claiming, setClaiming] = useState<string | null>(null);

  const quests = gameProfile?.quests?.filter(q => q.type === tab && !q.claimed) || [];

  const handleClaim = async (questId: string) => {
    setClaiming(questId);
    try {
      await api.request('/api/game/claim-quest', {
        method: 'POST',
        body: JSON.stringify({ questId }),
      });
      await loadGameProfile();
    } catch {}
    setClaiming(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['daily', 'weekly'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === t
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            {t === 'daily' ? 'Kunlik' : 'Haftalik'}
          </button>
        ))}
      </div>

      {quests.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Vazifalar tugadi" description="Barcha vazifalar bajarilgan! Yangilarini kuting." />
      ) : (
        <div className="space-y-3">
          {quests.map(q => {
            const def = questDefs.find(d => d.id === q.questId);
            const pct = q.threshold > 0 ? Math.round((q.progress / q.threshold) * 100) : 0;
            return (
              <div key={q.questId} className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white">{def?.title || q.questId}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{def?.description}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>{q.progress}/{q.threshold}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            q.completed ? 'bg-emerald-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-amber-400/70 font-mono">+{def?.rewardXp || 0} XP</span>
                      <span className="text-[10px] text-amber-400/70 font-mono">+{def?.rewardCoins || 0} coin</span>
                    </div>
                  </div>
                  {q.completed && !q.claimed && (
                    <button
                      type="button"
                      onClick={() => handleClaim(q.questId)}
                      disabled={claiming === q.questId}
                      className="shrink-0 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-all disabled:opacity-50"
                    >
                      {claiming === q.questId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TitlesTab() {
  const { titleDefs, gameProfile } = useStore();
  const [equipping, setEquipping] = useState<string | null>(null);

  const handleEquip = async (titleId: string) => {
    setEquipping(titleId);
    try {
      await api.request('/api/game/equip-title', {
        method: 'POST',
        body: JSON.stringify({ titleId }),
      });
      await useStore.getState().loadGameProfile();
    } catch {}
    setEquipping(null);
  };

  const sorted = [...titleDefs].sort((a, b) => a.tier - b.tier);
  const equippedId = gameProfile?.titles?.find(t => t.equipped)?.titleId;

  return (
    <div className="space-y-4">
      {equippedId && (
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
          <p className="text-xs text-purple-300 font-bold">
            Faol unvon: {titleDefs.find(t => t.id === equippedId)?.name || equippedId}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sorted.map(title => {
          const userTitle = gameProfile?.titles?.find(t => t.titleId === title.id);
          const isUnlocked = userTitle?.unlocked || false;
          const isEquipped = userTitle?.equipped || false;
          const tierStyle = TIER_STYLES[title.tier as keyof typeof TIER_STYLES] || TIER_STYLES[1];

          return (
            <div
              key={title.id}
              className={`p-4 rounded-2xl border transition-all ${
                isUnlocked
                  ? isEquipped
                    ? 'bg-purple-500/10 border-purple-500/30 ring-1 ring-purple-500/30'
                    : 'bg-slate-800/40 border-slate-700/50'
                  : 'bg-slate-900/30 border-slate-800/30 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-xl ${isUnlocked ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800/50 text-slate-600'}`}>
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {title.name}
                      {isEquipped && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    </h4>
                    <p className="text-[11px] text-slate-400">{title.description}</p>
                    <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full border font-bold ${tierStyle.color}`}>
                      {tierStyle.label}
                    </span>
                  </div>
                </div>
                {isUnlocked && !isEquipped && (
                  <button
                    type="button"
                    onClick={() => handleEquip(title.id)}
                    disabled={equipping === title.id}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold hover:bg-purple-500/30 transition-all disabled:opacity-50"
                  >
                    {equipping === title.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Tanlash'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeasonPassTab() {
  const { gameProfile } = useStore();
  const level = gameProfile?.seasonPassLevel || 1;
  const xp = gameProfile?.seasonPassXp || 0;
  const xpPerLevel = 2000;
  const pct = Math.round((xp / xpPerLevel) * 100);

  const tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20 text-center">
        <Gem className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <h3 className="text-lg font-black text-white">{level}-daraja</h3>
        <p className="text-xs text-slate-400 mt-1">Season Pass</p>
        <div className="mt-3 max-w-xs mx-auto">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>{xp} / {xpPerLevel} XP</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {tiers.map((tier) => {
          const unlocked = tier <= level;
          return (
            <div
              key={tier}
              className={`p-3 rounded-xl border flex items-center gap-3 ${
                unlocked
                  ? 'bg-slate-800/40 border-slate-700/50'
                  : 'bg-slate-900/30 border-slate-800/30 opacity-40'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800/50 text-slate-600'}`}>
                {unlocked ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className={`text-xs font-bold ${unlocked ? 'text-white' : 'text-slate-500'}`}>
                  {tier}-daraja mukofoti
                </p>
                <p className="text-[10px] text-slate-500">
                  {unlocked ? 'Ochilgan' : `${tier * 2000} XP da ochiladi`}
                </p>
              </div>
              {unlocked && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Olingan
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GameZone() {
  const { gameProfile, loadGameProfile, xp, level, coins } = useStore();
  const [activeTab, setActiveTab] = useState<'achievements' | 'quests' | 'titles' | 'season'>('achievements');

  useEffect(() => {
    loadGameProfile();
  }, [loadGameProfile]);

  if (!gameProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const tabs = [
    { id: 'achievements', label: 'Yutuqlar', icon: Trophy, count: gameProfile.achievementsUnlocked.length },
    { id: 'quests', label: 'Vazifalar', icon: ClipboardList, count: gameProfile.quests.filter(q => !q.claimed).length },
    { id: 'titles', label: 'Unvonlar', icon: Crown, count: gameProfile.titles.filter(t => t.unlocked).length },
    { id: 'season', label: 'Season Pass', icon: Gem, count: gameProfile.seasonPassLevel },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400 fill-amber-400" />
            Game Zone
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Yutuqlar, vazifalar va unvonlar markazi</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-purple-400 font-bold font-mono">{xp} XP</span>
          <span className="text-amber-400 font-bold font-mono">{coins} coin</span>
          <span className="text-emerald-400 font-bold font-mono">Lv.{level}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'bg-purple-500/10 border-purple-500/30 ring-1 ring-purple-500/30'
                  : 'bg-slate-800/30 border-slate-800/50 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-1 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
              <p className={`text-[10px] font-bold ${isActive ? 'text-purple-300' : 'text-slate-500'}`}>{tab.label}</p>
              <span className="text-[10px] text-slate-600 font-mono">{tab.count}</span>
            </button>
          );
        })}
      </div>

      <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/50">
        {activeTab === 'achievements' && <AchievementsTab />}
        {activeTab === 'quests' && <QuestsTab />}
        {activeTab === 'titles' && <TitlesTab />}
        {activeTab === 'season' && <SeasonPassTab />}
      </div>
    </div>
  );
}
