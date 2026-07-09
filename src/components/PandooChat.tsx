import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import * as api from '../api';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const SYSTEM_PROMPT = `Sen Pandoo nomli AI mentor. Sening vazifang o'quvchiga tushunmagan mavzularini sodda tilda tushuntirish va motivatsiya berish. Har doim o'zbek tilida gaplash. O'quvchining yoshiga qarab tushuntirish uslubini moslashtir.`;

export default function PandooChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Salom! Men Pandoo, sening shaxsiy AI yordamching. Qanday masalada yordam kerak?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const context = messages.map(m => `${m.role === 'user' ? 'O\'quvchi' : 'Pandoo'}: ${m.text}`).join('\n');
      const prompt = `${context}\nO'quvchi: ${msg}\nPandoo:`;
      const res = await api.aiAnalyze(prompt, SYSTEM_PROMPT);
      setMessages(prev => [...prev, { role: 'ai', text: res.text || 'Kechirasiz, javob berishda xatolik yuz berdi.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Kechirasiz, hozir javob bera olmayman. Iltimos, keyinroq urinib koring.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`p-2 rounded-xl shrink-0 ${msg.role === 'ai' ? 'bg-emerald-500/20' : 'bg-purple-500/20'}`}>
              {msg.role === 'ai' ? <Bot className="w-4 h-4 text-emerald-400" /> : <User className="w-4 h-4 text-purple-400" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
              msg.role === 'ai'
                ? 'bg-slate-800/60 border border-slate-700/40 text-emerald-50'
                : 'bg-purple-500/20 border border-purple-500/30 text-white ml-auto'
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-3">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 px-4 py-3 border-t border-slate-700/50 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Savolingizni yozing..."
          className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-all"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 disabled:bg-slate-700 disabled:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
