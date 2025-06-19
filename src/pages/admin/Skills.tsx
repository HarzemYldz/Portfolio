import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { getSkills, setSkills as saveSkills } from '../../utils/skillsStorage';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Card from '../../components/Card';

type Skill = {
  id: number;
  name: string;
  color: string;
};

const COLORS = [
  'bg-indigo-500',
  'bg-green-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-red-500',
];

export default function Skills() {
  const [skills, setSkillsState] = useState<Skill[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);

  useEffect(() => {
    setSkillsState(getSkills());
  }, []);

  useEffect(() => {
    saveSkills(skills);
  }, [skills]);

  useEffect(() => {
    document.title = 'Yetenekler | Admin Paneli';
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = '/favicon.ico';
  }, []);

  function handleAddSkill(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const newSkill: Skill = {
      id: Date.now(),
      name: (form.name as any).value,
      color: (form.color as any).value,
    };
    setSkillsState(prev => [newSkill, ...prev]);
    setShowAddModal(false);
    form.reset();
  }

  function handleEditSkill(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSkillsState(prev => prev.map(s =>
      s.id === editSkill?.id
        ? { ...s, name: (form.name as any).value, color: (form.color as any).value }
        : s
    ));
    setShowEditModal(false);
    setEditSkill(null);
  }

  function handleDeleteSkill(id: number) {
    setSkillsState(prev => prev.filter(s => s.id !== id));
  }

  return (
    <Card className="p-6">
      <div className="space-y-8 font-fira">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1a223f] dark:text-[#e3eafc] animate-fade-in-up duration-700 bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent">Yetenekler</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 shadow-md backdrop-blur-md text-[#3f51b5] dark:text-[#00bcd4] hover:bg-white/80 dark:hover:bg-[#23395d]/70 hover:scale-105 hover:shadow-lg animate-fade-in-up duration-700 delay-100"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon className="h-5 w-5" /> Yeni Yetenek
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up duration-700 delay-200">
          {skills.length === 0 ? (
            <div className="col-span-4 text-center text-[#b0bec5] dark:text-[#90caf9]">Henüz yetenek eklenmedi.</div>
          ) : (
            skills.map(skill => (
              <Card key={skill.id} className="flex items-center justify-between p-4">
                <span className={`inline-block px-4 py-2 rounded-full text-[#1a223f] dark:text-[#e3eafc] font-semibold text-sm bg-white/80 dark:bg-[#23395d]/70 border border-white/30 dark:border-[#3f51b5]/30`}>{skill.name}</span>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-full bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 shadow-md backdrop-blur-md hover:bg-white/80 dark:hover:bg-[#23395d]/70 hover:scale-110 hover:shadow-lg transition-all"
                    onClick={() => { setEditSkill(skill); setShowEditModal(true); }}
                  >
                    <PencilSquareIcon className="h-5 w-5 text-[#3f51b5] dark:text-[#00bcd4]" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 shadow-md backdrop-blur-md hover:bg-white/80 dark:hover:bg-[#23395d]/70 hover:scale-110 hover:shadow-lg transition-all"
                    onClick={() => handleDeleteSkill(skill.id)}
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Add Modal */}
        <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="z-[100] font-fira">
          <div className="fixed inset-0 bg-black/40 z-[100]" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center z-[110]">
            <Dialog.Panel className="bg-white/60 dark:bg-[#1a223f]/55 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/30 dark:border-[#3f51b5]/30 backdrop-blur-2xl animate-fade-in-up duration-700">
              <button className="absolute top-3 right-3 p-1 rounded-full bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 hover:bg-white/80 dark:hover:bg-[#23395d]/70" onClick={() => setShowAddModal(false)}><XMarkIcon className="h-5 w-5 text-[#3f51b5] dark:text-[#00bcd4]" /></button>
              <Dialog.Title className="text-lg font-bold mb-4 text-[#1a223f] dark:text-[#e3eafc]">Yeni Yetenek Ekle</Dialog.Title>
              <form onSubmit={handleAddSkill} className="space-y-4">
                <input name="name" required placeholder="Yetenek Adı" className="w-full px-3 py-2 rounded-xl border border-white/30 dark:border-[#3f51b5]/30 bg-white/80 dark:bg-[#23395d]/70 text-[#1a223f] dark:text-[#e3eafc]" />
                <select name="color" className="w-full px-3 py-2 rounded-xl border border-white/30 dark:border-[#3f51b5]/30 bg-white/80 dark:bg-[#23395d]/70 text-[#1a223f] dark:text-[#e3eafc]">
                  {COLORS.map(c => <option key={c} value={c}>{c.replace('bg-', '').replace('-500', '')}</option>)}
                </select>
                <button type="submit" className="w-full py-2 rounded-xl font-semibold bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 shadow-md backdrop-blur-md text-[#3f51b5] dark:text-[#00bcd4] hover:bg-white/80 dark:hover:bg-[#23395d]/70 hover:scale-105 hover:shadow-lg transition-all">Ekle</button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onClose={() => { setShowEditModal(false); setEditSkill(null); }} className="z-[100] font-fira">
          <div className="fixed inset-0 bg-black/40 z-[100]" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center z-[110]">
            <Dialog.Panel className="bg-white/60 dark:bg-[#1a223f]/55 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/30 dark:border-[#3f51b5]/30 backdrop-blur-2xl animate-fade-in-up duration-700">
              <button className="absolute top-3 right-3 p-1 rounded-full bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 hover:bg-white/80 dark:hover:bg-[#23395d]/70" onClick={() => { setShowEditModal(false); setEditSkill(null); }}><XMarkIcon className="h-5 w-5 text-[#3f51b5] dark:text-[#00bcd4]" /></button>
              <Dialog.Title className="text-lg font-bold mb-4 text-[#1a223f] dark:text-[#e3eafc]">Yetenek Düzenle</Dialog.Title>
              {editSkill && (
                <form onSubmit={handleEditSkill} className="space-y-4">
                  <input name="name" required defaultValue={editSkill.name} placeholder="Yetenek Adı" className="w-full px-3 py-2 rounded-xl border border-white/30 dark:border-[#3f51b5]/30 bg-white/80 dark:bg-[#23395d]/70 text-[#1a223f] dark:text-[#e3eafc]" />
                  <select name="color" className="w-full px-3 py-2 rounded-xl border border-white/30 dark:border-[#3f51b5]/30 bg-white/80 dark:bg-[#23395d]/70 text-[#1a223f] dark:text-[#e3eafc]" defaultValue={editSkill.color}>
                    {COLORS.map(c => <option key={c} value={c}>{c.replace('bg-', '').replace('-500', '')}</option>)}
                  </select>
                  <button type="submit" className="w-full py-2 rounded-xl font-semibold bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 shadow-md backdrop-blur-md text-[#3f51b5] dark:text-[#00bcd4] hover:bg-white/80 dark:hover:bg-[#23395d]/70 hover:scale-105 hover:shadow-lg transition-all">Kaydet</button>
                </form>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </Card>
  );
} 