import React, { useState } from 'react';
import * as api from '../api';
import {
  MessageSquare,
  Users,
  Trophy,
  Calendar,
  Send,
  ThumbsUp,
  Award,
  Sparkles,
  Plus,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Post, LeaderboardEntry, EventItem } from '../types';
import CustomSelect from './CustomSelect';
import { useToast } from '../toast';

interface CommunityProps {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  leaderboard: LeaderboardEntry[];
  setLeaderboard: React.Dispatch<React.SetStateAction<LeaderboardEntry[]>>;
  events: EventItem[];
}

export default function Community({ xp, setXp, setLevel, posts, setPosts, leaderboard, setLeaderboard, events }: CommunityProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'forum' | 'leaderboard' | 'events'>('forum');

  // New post state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('SAT');

  // Register for Event State
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: Post = {
      id: `p${posts.length + 1}`,
      title: newPostTitle,
      content: newPostContent,
      author: 'Mening Profilim',
      tag: selectedTag,
      likes: 0,
      replies: 0,
      createdAt: 'Hozir'
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    api.rewardAndUpdate(setXp, null, setLevel, 'create_post');
    toast("Post muvaffaqiyatli chop etildi! Sizga 50 XP berildi.", 'success');
  };

  const handleLikePost = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleRegisterEvent = (id: string) => {
    if (registeredEventIds.includes(id)) return;
    setRegisteredEventIds([...registeredEventIds, id]);
    toast("Siz ushbu vebinarga muvaffaqiyatli ro'yxatdan o'tdingiz.", 'success');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto max-w-7xl mx-auto" id="community_container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="community_header">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Talabalar Jamiyati & Forum</h2>
          <p className="text-sm text-gray-500 mt-1">
            Boshqa talabalar bilan savol-javoblar qiling, eng yuqori reytingli yetakchilarni ko'ring va bepul vebinarlarga ro'yxatdan o'ting.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200" id="community_tabs">
          {[
            { id: 'forum', label: 'Muhokamalar Forum', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'leaderboard', label: 'Leaderboard (Reyting)', icon: <Trophy className="w-4 h-4" /> },
            { id: 'events', label: 'Vebinarlar', icon: <Calendar className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`comm_tab_${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'forum' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="forum_grid">
          {/* Create Post and Post Feed Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Create Post Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5" id="create_post_card">
              <h3 className="text-lg font-bold text-black flex items-center gap-2">
                <Plus className="w-5 h-5 text-gray-500" /> Yangi mavzu / savol yaratish
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  id="post_title_input"
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Mavzu sarlavhasi (Masalan: SAT uchun eng yaxshi materiallar)..."
                  className="md:col-span-2 text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-black"
                />

                <CustomSelect
                  value={selectedTag}
                  onChange={setSelectedTag}
                  options={[
                    { value: 'SAT', label: 'SAT Preparation' },
                    { value: 'IELTS', label: 'IELTS English' },
                    { value: 'AQSH', label: 'AQSH Universitetlari' },
                    { value: 'Grantlar', label: 'Milliy / Xalqaro Grantlar' },
                  ]}
                />
              </div>

              <textarea
                id="post_content_textarea"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Savol yoki fikringizni batafsil yozing..."
                className="w-full h-32 p-4 border border-gray-100 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-black leading-relaxed bg-gray-50/50"
              />

              <div className="flex justify-end">
                <button
                  id="submit_post_btn"
                  onClick={handleCreatePost}
                  className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-900 transition flex items-center gap-1"
                >
                  Post yaratish <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Post Feed */}
            <div className="space-y-4" id="posts_feed">
              {posts.map((post) => (
                <div key={post.id} id={`post_item_${post.id}`} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs hover:border-gray-200 transition space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100 px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">
                          #{post.tag}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{post.createdAt}</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-800 tracking-tight leading-snug">{post.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {post.content}
                  </p>

                  <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500" id={`post_actions_${post.id}`}>
                    <span className="font-semibold text-gray-700">Yozuvchi: {post.author}</span>
                    <div className="flex items-center gap-4">
                      <button
                        id={`post_like_btn_${post.id}`}
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-1.5 hover:text-black font-semibold"
                      >
                        <ThumbsUp className="w-4 h-4" /> {post.likes}
                      </button>
                      <span className="flex items-center gap-1.5 font-semibold">
                        <MessageSquare className="w-4 h-4" /> {post.replies} javob
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Info card */}
          <div className="space-y-8" id="forum_right_column">
            <div className="bg-radial from-orange-50 to-amber-50 p-6 rounded-3xl border border-orange-100 shadow-xs space-y-4" id="forum_rules_card">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-orange-600" />
                <h4 className="text-sm font-bold text-orange-950">Jamiyat Yo'riqnomasi</h4>
              </div>
              <ul className="space-y-2 text-xs text-orange-900 font-medium leading-relaxed">
                <li>• Faqat ta'lim, imtihonlar va grantlar bilan bog'liq mavzular yozilsin.</li>
                <li>• Boshqa talabalarga savollarida ko'maklashing va dars materiallari bilan bo'lishing.</li>
                <li>• Post yaratsangiz va javoblarga yordam bersangiz 50 XP ballga ega bo'lasiz.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs max-w-3xl mx-auto space-y-6" id="leaderboard_panel">
          <div className="flex justify-between items-center pb-4 border-b border-gray-50">
            <h3 className="text-xl font-bold text-black flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Milliy va Xalqaro Talabalar Leaderboardi
            </h3>
            <span className="text-xs text-gray-400">Haftalik yangilanadi</span>
          </div>

          <div className="space-y-3" id="leaderboard_list">
            {leaderboard.map((entry, idx) => {
              const isTop3 = idx < 3;
              return (
                <div key={idx} className="p-4 border border-gray-50 rounded-2xl bg-gray-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-center text-sm font-bold font-mono text-gray-400 flex items-center justify-center">
                      {isTop3 ? (
                        <Award className={`w-5 h-5 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-amber-700'}`} />
                      ) : `${idx + 1}`}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{entry.name}</h4>
                      <p className="text-[10px] text-gray-400">{entry.school} | {entry.grade}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-bold text-black font-mono">{entry.xp.toLocaleString()} XP</span>
                      <p className="text-[9px] text-orange-600 font-semibold">{entry.streak} kunlik streak</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs max-w-4xl mx-auto space-y-6" id="events_panel">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h3 className="text-xl font-bold tracking-tight text-black">Bo'lib o'tadigan Bepul Vebinarlar</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="events_grid">
            {events.map((ev) => {
              const isRegistered = registeredEventIds.includes(ev.id);
              return (
                <div key={ev.id} id={`event_card_${ev.id}`} className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col justify-between h-56">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>Sana: {ev.date}</span>
                      <span>Vaqt: {ev.time}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800">{ev.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed truncate-2">{ev.description}</p>
                    <p className="text-[10px] text-gray-400">Tashkilotchi / Spiker: {ev.speaker}</p>
                  </div>

                  <button
                    id={`register_event_btn_${ev.id}`}
                    onClick={() => handleRegisterEvent(ev.id)}
                    className={`w-full py-2 rounded-xl text-xs font-semibold border transition ${
                      isRegistered
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-black text-white border-black hover:bg-gray-900'
                    }`}
                  >
                    {isRegistered ? 'Ro\'yxatdan o\'tildi ✓' : 'Bepul ro\'yxatdan o\'tish'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
