import React, { useState } from 'react';
import * as api from '../api';
import {
  Sparkles,
  Send,
  MessageSquare,
  Compass,
  ArrowRight,
  TrendingUp,
  Brain,
  ListTodo,
  Download
} from 'lucide-react';

interface AiCoachProps {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}

export default function AiCoach({ xp, setXp, setLevel }: AiCoachProps) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Salom Bekhruzbek! Men sizning shaxsiy sun\'iy intellekt dars murabbiyingizman. IELTS, SAT, grantlar, dars qilish rejasi yoki motivatsiya haqida nima so\'ramoqchisiz?', time: 'Hozir' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // AI Study Plan state
  const [studyGoal, setStudyGoal] = useState('IELTS band score 7.5 olish');
  const [studyHours, setStudyHours] = useState('Kuniga 3-4 soat');
  const [studyDuration, setStudyDuration] = useState('30 kun');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const smartSuggestions = [
    'IELTS Speaking-ni mustaqil qanday oshirish mumkin?',
    'Muvaffaqiyatli portfolio yaratish sirlari nimalar?',
    'SAT imtihonida Math bo\'limidan 800 olish uchun tavsiyalar'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || newMessage;
    if (!text.trim()) return;

    setMessages(prev => [
      ...prev,
      { sender: 'user', text, time: 'Hozir' }
    ]);
    if (!textToSend) setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          systemInstruction: 'Siz LifeSprint platformasining oliy darajadagi AI murabbiyisiz. Talabalarga o\'zbek tilida motivatsiya berishingiz, dars tayyorlashda eng samarali maslahatlarni, SAT, IELTS, va universitetlarga kirish bo\'yicha dunyodagi eng tajribali maslahatchi kabi o\'zbekcha, do\'stona va juda batafsil javob berishingiz kerak.'
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [
          ...prev,
          { sender: 'ai', text: data.text, time: 'Hozir' }
        ]);
        api.rewardAndUpdate(setXp, null, setLevel, 'ai_chat');
      } else {
        setMessages(prev => [
          ...prev,
          { sender: 'ai', text: 'Kechirasiz, javob olishda muammo yuz berdi. Iltimos, yana bir bor urinib ko\'ring.', time: 'Hozir' }
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Ulanishda xatolik yuz berdi. Internet aloqasini tekshiring.', time: 'Hozir' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateStudyPlan = async () => {
    setIsGeneratingPlan(true);
    setGeneratedPlan('');

    try {
      const promptText = `Men uchun 30 kunlik shaxsiy batafsil dars rejasi generatsiya qilib bering.
      Maqsadim: ${studyGoal}
      Kuniga ajrata oladigan vaqtim: ${studyHours}
      Muddati: ${studyDuration}.
      Iltimos, har bir hafta bo'yicha aniq harakatlar ro'yxati (To-Do List) va tavsiyalar bering.`;

      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemInstruction: 'Siz professional akademik dars rejasi tuzuvchi mutaxassissiz. Javobni chiroyli va o\'zbek tilida, tizimli, sarlavhalar va qadamlar bilan chiroyli tarzda taqdim eting.'
        })
      });

      const data = await response.json();
      if (data.text) {
        setGeneratedPlan(data.text);
        api.rewardAndUpdate(setXp, null, setLevel, 'generate_plan');
      } else {
        setGeneratedPlan('Reja generatsiya qilishda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
      }
    } catch (error) {
      console.error(error);
      setGeneratedPlan('Ulanish xatosi. Qayta urinib ko\'ring.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto max-w-7xl mx-auto" id="aicoach_container">
      {/* Header */}
      <div id="aicoach_header">
        <h2 className="text-3xl font-bold tracking-tight text-black">AI Shaxsiy Murabbiy (AI Coach)</h2>
        <p className="text-sm text-gray-500 mt-1">
          Sun'iy intellekt yordamida shaxsiy dars rejalari tuzing, savollaringizga tezkor javob oling va dars tahlillarini yoriting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="aicoach_grid">
        {/* Left Side: Study Plan Generator */}
        <div className="space-y-6" id="aicoach_left_column">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5" id="study_plan_card">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <Brain className="w-5 h-5 text-gray-500" /> Shaxsiy Dars Rejasi Generator
            </h3>
            <p className="text-xs text-gray-400">
              O'z maqsadingiz va dars qilish vaqtingizni kiriting, sun'iy intellekt sizga moslashtirilgan dars rejasini tuzib beradi.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Sizning maqsadingiz:</label>
                <input
                  id="goal_input"
                  type="text"
                  value={studyGoal}
                  onChange={(e) => setStudyGoal(e.target.value)}
                  placeholder="Masalan: SAT imtihonidan 1500+ olish"
                  className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">Kunlik dars vaqti:</label>
                  <input
                    id="hours_input"
                    type="text"
                    value={studyHours}
                    onChange={(e) => setStudyHours(e.target.value)}
                    placeholder="Masalan: 3 soat"
                    className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">Reja davomiyligi:</label>
                  <input
                    id="duration_input"
                    type="text"
                    value={studyDuration}
                    onChange={(e) => setStudyDuration(e.target.value)}
                    placeholder="Masalan: 30 kun"
                    className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none"
                  />
                </div>
              </div>

              <button
                id="generate_plan_btn"
                onClick={handleGenerateStudyPlan}
                disabled={isGeneratingPlan}
                className="w-full bg-black text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-1 shadow-xs"
              >
                {isGeneratingPlan ? 'Reja tuzilmoqda...' : 'AI Shaxsiy Reja Tuzish'}
              </button>
            </div>
          </div>

          {/* Rendered plan */}
          {(generatedPlan || isGeneratingPlan) && (
            <div className="bg-radial from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-100 shadow-xs space-y-4" id="rendered_plan_card">
              <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <ListTodo className="w-4 h-4 text-emerald-600" /> Sizning Shaxsiy Rejangiz
              </h4>
              {isGeneratingPlan ? (
                <div className="space-y-2 animate-pulse py-2">
                  <div className="h-3 bg-emerald-200/50 rounded-md w-3/4" />
                  <div className="h-3 bg-emerald-200/50 rounded-md w-5/6" />
                  <div className="h-3 bg-emerald-200/50 rounded-md w-2/3" />
                </div>
              ) : (
                <div className="text-xs text-emerald-900 font-medium leading-relaxed whitespace-pre-line bg-white/60 p-4 rounded-2xl border border-green-100/30 max-h-[300px] overflow-y-auto">
                  {generatedPlan}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Chat Area with Coach */}
        <div className="lg:col-span-2 space-y-6" id="aicoach_chat_column">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between h-[520px]">
            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 mb-4" id="chat_messages_box">
              {messages.map((m, idx) => {
                const isAi = m.sender === 'ai';
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3.5 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    {isAi && (
                      <div className="p-1.5 bg-black text-white rounded-lg text-xs font-bold animate-pulse">
                        AI
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAi
                          ? 'bg-white text-gray-800 border border-gray-100 shadow-2xs'
                          : 'bg-black text-white shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex items-center gap-3 max-w-[85%] mr-auto">
                  <div className="p-1.5 bg-black text-white rounded-lg text-[10px] font-bold">
                    AI
                  </div>
                  <div className="p-3 bg-white text-gray-400 border border-gray-100 rounded-2xl text-xs flex gap-1 items-center font-semibold">
                    Shaxsiy murabbiyingiz yozmoqda...
                  </div>
                </div>
              )}
            </div>

            {/* Smart Suggestions area */}
            <div className="flex gap-2 mb-3 overflow-x-auto py-1" id="suggestions_bar">
              {smartSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  id={`suggest_btn_${idx}`}
                  onClick={() => handleSendMessage(s)}
                  className="text-[10px] bg-gray-50 border border-gray-100 hover:border-gray-200 text-gray-600 font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex gap-2">
              <input
                id="coach_chat_input"
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="AI murabbiyingizga savol yozing..."
                className="flex-1 text-xs px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                id="coach_send_btn"
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                className="bg-black text-white p-3.5 rounded-xl hover:bg-gray-900 transition shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
