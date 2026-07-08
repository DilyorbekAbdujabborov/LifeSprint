import React, { useState } from 'react';
import {
  User,
  Award,
  BookOpen,
  Briefcase,
  FileCheck,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  Download,
  Eye
} from 'lucide-react';
import { PortfolioData } from '../types';

interface PortfolioProps {
  portfolio: PortfolioData;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>>;
}

export default function Portfolio({ portfolio: profile, setPortfolio: setProfile }: PortfolioProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeView, setActiveView] = useState<'editor' | 'website_preview'>('editor');

  // Input States for arrays
  const [newOlympiad, setNewOlympiad] = useState('');
  const [newAward, setNewAward] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newVolunteering, setNewVolunteering] = useState('');

  const handleAddField = (field: 'olympiads' | 'awards' | 'volunteering', val: string, setVal: React.Dispatch<React.SetStateAction<string>>) => {
    if (!val.trim()) return;
    setProfile(prev => ({
      ...prev,
      [field]: [...prev[field], val]
    }));
    setVal('');
  };

  const handleAddProject = () => {
    if (!newProjectTitle.trim() || !newProjectDesc.trim()) return;
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, { title: newProjectTitle, description: newProjectDesc }]
    }));
    setNewProjectTitle('');
    setNewProjectDesc('');
  };

  const handleRemoveItem = (field: 'olympiads' | 'awards' | 'volunteering' | 'projects', index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, idx) => idx !== index)
    }));
  };

  const handleExportCV = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto max-w-7xl mx-auto" id="portfolio_container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="portfolio_header">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Talaba Portfolioli & Resume Builder</h2>
          <p className="text-sm text-gray-500 mt-1">
            Akademik yutuqlaringiz, olimpiadalar va loyihalaringizni bitta joyda boshqaring, professional CV eksport qiling va sayt yarating.
          </p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200" id="portfolio_tabs">
          <button
            id="tab_editor"
            onClick={() => setActiveView('editor')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'editor'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" /> Ma'lumotlar tahriri
          </button>
          <button
            id="tab_preview"
            onClick={() => setActiveView('website_preview')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'website_preview'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Eye className="w-4 h-4" /> Portfolio Sayti (Dizayn)
          </button>
        </div>
      </div>

      {activeView === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="portfolio_editor_grid">
          {/* Main Form Fields Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold tracking-tight text-black">Asosiy Ma'lumotlar</h3>
                <button
                  id="toggle_edit_btn"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs bg-gray-100 text-gray-800 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200"
                >
                  {isEditing ? 'Saqlash' : 'Tahrirlash'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">To'liq ism-sharifingiz:</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">Qisqacha ta'rif (Bio):</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">Ta'lim muassasasi:</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.education.school}
                    onChange={(e) => setProfile({ ...profile, education: { ...profile.education, school: e.target.value } })}
                    className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">Sinf / Kurs:</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.education.grade}
                    onChange={(e) => setProfile({ ...profile, education: { ...profile.education, grade: e.target.value } })}
                    className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">GPA ko'rsatkichi:</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.education.gpa}
                    onChange={(e) => setProfile({ ...profile, education: { ...profile.education, gpa: e.target.value } })}
                    className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">SAT Ball:</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.satScore}
                    onChange={(e) => setProfile({ ...profile, satScore: e.target.value })}
                    className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">IELTS Ball:</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.ieltsScore}
                    onChange={(e) => setProfile({ ...profile, ieltsScore: e.target.value })}
                    className="w-full text-xs p-3 border border-gray-100 rounded-xl bg-gray-50/50 disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* List entries for Awards, Projects, Olympiads */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-black">Loyihalar va Yutuqlar</h3>

              {/* Olympiads section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-600">Olimpiada natijalari:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOlympiad}
                    onChange={(e) => setNewOlympiad(e.target.value)}
                    placeholder="Masalan: Respublika Matematika Olimpiadasi - 3-o'rin"
                    className="flex-1 text-xs p-2.5 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    id="add_olympiad_btn"
                    onClick={() => handleAddField('olympiads', newOlympiad, setNewOlympiad)}
                    className="bg-black text-white p-2.5 rounded-xl hover:bg-gray-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {profile.olympiads.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center text-xs">
                      <span>{item}</span>
                      <button id={`del_olympiad_${idx}`} onClick={() => handleRemoveItem('olympiads', idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards section */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-gray-600">Mukofot va nominatsiyalar:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAward}
                    onChange={(e) => setNewAward(e.target.value)}
                    placeholder="Masalan: Maktab chempioni"
                    className="flex-1 text-xs p-2.5 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    id="add_award_btn"
                    onClick={() => handleAddField('awards', newAward, setNewAward)}
                    className="bg-black text-white p-2.5 rounded-xl hover:bg-gray-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {profile.awards.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center text-xs">
                      <span>{item}</span>
                      <button id={`del_award_${idx}`} onClick={() => handleRemoveItem('awards', idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects section */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-gray-600">Yaratgan mustaqil loyihalar:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="Loyiha nomi..."
                    className="text-xs p-2.5 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="text"
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="Loyiha tavsifi..."
                    className="text-xs p-2.5 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <button
                  id="add_project_btn"
                  onClick={handleAddProject}
                  className="w-full bg-black text-white py-2 rounded-xl text-xs font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Loyiha qo'shish
                </button>
                <div className="space-y-2">
                  {profile.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-start text-xs">
                      <div>
                        <h4 className="font-bold text-gray-800">{proj.title}</h4>
                        <p className="text-gray-500 mt-1">{proj.description}</p>
                      </div>
                      <button id={`del_proj_${idx}`} onClick={() => handleRemoveItem('projects', idx)} className="text-red-500 hover:text-red-700 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Resume Blueprint & Print */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6" id="resume_print_card">
              <h3 className="text-base font-bold text-black flex items-center gap-1.5">
                <FileCheck className="w-5 h-5 text-gray-500" /> Resume (CV) Eksport
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Kiritilgan barcha ma'lumotlar avtomatik tarzda xalqaro standartga mos keluvchi chiroyli rezyume formatiga o'tkaziladi.
              </p>

              {/* CV Preview Frame */}
              <div className="p-4 border border-gray-200 rounded-2xl space-y-3 bg-gray-50 text-[10px] select-none font-mono opacity-80 h-48 overflow-hidden relative">
                <div className="text-center border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-xs">{profile.fullName}</h4>
                  <p className="text-[8px] mt-0.5">{profile.education.school}</p>
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold border-b border-gray-100 uppercase text-[8px]">Ta'lim</h5>
                  <p>GPA: {profile.education.gpa} | SAT: {profile.satScore}</p>
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold border-b border-gray-100 uppercase text-[8px]">Loyihalar</h5>
                  {profile.projects.slice(0, 2).map((p, i) => (
                    <p key={i}>• {p.title}</p>
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-50 to-transparent" />
              </div>

              <button
                id="export_cv_btn"
                onClick={handleExportCV}
                className="w-full bg-black text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" /> Rezyume (PDF) eksport qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Website Preview Interface (Apple Fitness styled elegant generated portfolio website) */}
      {activeView === 'website_preview' && (
        <div className="bg-stone-50 p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8 max-w-4xl mx-auto" id="website_preview_container">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400 font-mono ml-2">https://{profile.fullName.toLowerCase().replace(/\s+/g, '')}.lifesprint.uz</span>
            </div>
            <span className="text-xs bg-black text-white px-3 py-1 rounded-full font-semibold">Live Site</span>
          </div>

          {/* Rendered elegant minimalist student profile website */}
          <div className="bg-white p-12 rounded-2xl shadow-xs space-y-12 text-gray-800">
            {/* Nav */}
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-base tracking-tight text-black">{profile.fullName}</span>
              <div className="flex gap-4 text-xs font-medium text-gray-500">
                <span>Loyihalar</span>
                <span>Yutuqlar</span>
                <span>Bog'lanish</span>
              </div>
            </div>

            {/* Hero */}
            <div className="space-y-4 max-w-xl">
              <h1 className="text-3xl font-extrabold tracking-tight text-black leading-tight">
                Salom, men {profile.fullName}. Akademik tadqiqotlar va yangi g'oyalarga qiziquvchi talabaman.
              </h1>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {profile.bio}
              </p>
            </div>

            {/* Stats list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">GPA Ko'rsatkich</span>
                <p className="text-xl font-bold text-black font-mono">{profile.education.gpa}</p>
                <p className="text-[11px] text-gray-500">{profile.education.school}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">SAT SCORE</span>
                <p className="text-xl font-bold text-black font-mono">{profile.satScore}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">IELTS CERTIFICATE</span>
                <p className="text-xl font-bold text-black font-mono">{profile.ieltsScore}</p>
              </div>
            </div>

            {/* Projects list */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              <h3 className="text-base font-bold text-black uppercase tracking-wider text-[10px]">Mustaqil Loyihalarim</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.projects.map((proj, idx) => (
                  <div key={idx} className="space-y-2 border border-gray-100 p-5 rounded-2xl">
                    <h4 className="font-bold text-sm text-black">{proj.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-100 text-[10px] text-gray-400 font-medium font-mono">
              LifeSprint Platform Website Generator orqali yaratilgan shaxsiy sahifa. © 2026.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
