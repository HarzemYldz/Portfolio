import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import Card from '../../components/Card';

interface AboutData {
  title: string;
  description: string;
  image: string;
  experience: {
    title: string;
    period: string;
    description: string;
  }[];
  education: {
    title: string;
    period: string;
    description: string;
  }[];
  statistics: {
    name: string;
    percentage: number;
  }[];
}

export default function About() {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [aboutData, setAboutData] = useState<AboutData>({
    title: '',
    description: '',
    image: '',
    experience: [],
    education: [],
    statistics: []
  });

  useEffect(() => {
    const savedData = localStorage.getItem('aboutData');
    if (savedData) {
      setAboutData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    document.title = 'Hakkımda | Admin Paneli';
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement('link') as HTMLLinkElement;
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = '/favicon.ico';
  }, []);

  const handleSave = async () => {
    const isConfirmed = await confirm('Hakkımda bilgilerini kaydetmek istediğinize emin misiniz?', 'Bu işlem mevcut bilgileri güncelleyecek.');
    if (!isConfirmed) return;
    localStorage.setItem('aboutData', JSON.stringify(aboutData));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aboutData', newValue: JSON.stringify(aboutData) }));
    showToast('Bilgiler başarıyla kaydedildi!', 'success');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAboutData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleStatisticsChange = (index: number, value: number) => {
    setAboutData(prev => ({
      ...prev,
      statistics: prev.statistics.map((stat, i) => 
        i === index ? { ...stat, percentage: value } : stat
      )
    }));
  };

  const addExperience = () => {
    setAboutData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', period: '', description: '' }]
    }));
  };

  const addEducation = () => {
    setAboutData(prev => ({
      ...prev,
      education: [...prev.education, { title: '', period: '', description: '' }]
    }));
  };

  const addStatistic = () => {
    setAboutData(prev => ({
      ...prev,
      statistics: [...prev.statistics, { name: '', percentage: 0 }]
    }));
  };

  const removeExperience = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const removeEducation = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeStatistic = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      statistics: prev.statistics.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-10">
      <Card className="p-8 bg-white/70 dark:bg-[#1a223f]/70 shadow-2xl border border-white/30 dark:border-[#3f51b5]/30 ring-1 ring-white/20 dark:ring-[#3f51b5]/10">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent animate-fade-in-up">Hakkımda Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#1a223f] dark:text-[#e3eafc]">Başlık</label>
              <input
                type="text"
                value={aboutData.title}
                onChange={(e) => setAboutData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent shadow"
                placeholder="Başlık girin"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#1a223f] dark:text-[#e3eafc]">Açıklama</label>
              <textarea
                value={aboutData.description}
                onChange={(e) => setAboutData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent resize-none shadow"
                placeholder="Kendiniz hakkında detaylı bilgi"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#1a223f] dark:text-[#e3eafc]">Profil Fotoğrafı</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent shadow"
              />
              {aboutData.image && (
                <img
                  src={aboutData.image}
                  alt="Profil"
                  className="mt-4 w-32 h-32 rounded-full object-cover border-4 border-white dark:border-[#3f51b5] shadow-lg mx-auto"
                />
              )}
            </div>
          </div>
          {/* Live Preview Card */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-xs p-6 rounded-2xl bg-gradient-to-br from-[#e3eafc]/60 via-[#f5f7fa]/60 to-[#90caf9]/40 dark:from-[#23395d]/60 dark:via-[#1a223f]/60 dark:to-[#3f51b5]/30 shadow-xl border border-white/30 dark:border-[#3f51b5]/30 flex flex-col items-center gap-4 animate-fade-in-up">
              {aboutData.image && (
                <img src={aboutData.image} alt="Profil" className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-[#3f51b5] shadow" />
              )}
              <div className="text-xl font-bold text-[#1a223f] dark:text-[#e3eafc]">{aboutData.title || 'Başlık'}</div>
              <div className="text-sm text-[#3f51b5] dark:text-[#00bcd4] text-center">{aboutData.description || 'Açıklama'}</div>
            </div>
          </div>
        </div>
        {/* Experience */}
        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4 text-[#3f51b5] dark:text-[#00bcd4]">Deneyim</h3>
          <div className="space-y-4">
            {aboutData.experience.map((exp, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    placeholder="Pozisyon"
                    className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent mb-2"
                  />
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                    placeholder="Dönem"
                    className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent mb-2"
                  />
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    placeholder="Açıklama"
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent resize-none"
                  />
                </div>
                <button
                  onClick={() => removeExperience(index)}
                  className="ml-0 md:ml-4 flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 shadow-sm hover:bg-red-100 dark:hover:bg-red-800/60 hover:text-white transition-all duration-200 group"
                  title="Deneyimi Sil"
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 group-hover:animate-pulse' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                  <span className="font-semibold text-xs group-hover:text-white">Sil</span>
                </button>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="mt-2 px-4 py-2 rounded-lg bg-[#3f51b5] text-white hover:bg-[#303f9f] transition-colors shadow"
            >
              Deneyim Ekle
            </button>
          </div>
        </div>
        {/* Education */}
        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4 text-[#3f51b5] dark:text-[#00bcd4]">Eğitim</h3>
          <div className="space-y-4">
            {aboutData.education.map((edu, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={edu.title}
                    onChange={(e) => handleEducationChange(index, 'title', e.target.value)}
                    placeholder="Okul/Bölüm"
                    className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent mb-2"
                  />
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => handleEducationChange(index, 'period', e.target.value)}
                    placeholder="Dönem"
                    className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent mb-2"
                  />
                  <textarea
                    value={edu.description}
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                    placeholder="Açıklama"
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent resize-none"
                  />
                </div>
                <button
                  onClick={() => removeEducation(index)}
                  className="ml-0 md:ml-4 flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 shadow-sm hover:bg-red-100 dark:hover:bg-red-800/60 hover:text-white transition-all duration-200 group"
                  title="Eğitimi Sil"
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 group-hover:animate-pulse' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                  <span className="font-semibold text-xs group-hover:text-white">Sil</span>
                </button>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="mt-2 px-4 py-2 rounded-lg bg-[#3f51b5] text-white hover:bg-[#303f9f] transition-colors shadow"
            >
              Eğitim Ekle
            </button>
          </div>
        </div>
        {/* Statistics */}
        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4 text-[#3f51b5] dark:text-[#00bcd4]">İstatistikler</h3>
          <div className="space-y-4">
            {aboutData.statistics.map((stat, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={stat.name}
                    onChange={(e) => setAboutData(prev => ({
                      ...prev,
                      statistics: prev.statistics.map((s, i) => 
                        i === index ? { ...s, name: e.target.value } : s
                      )
                    }))}
                    placeholder="İstatistik Adı"
                    className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-[#23395d]/90 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent mb-2"
                  />
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stat.percentage}
                      onChange={(e) => handleStatisticsChange(index, parseInt(e.target.value))}
                      className="flex-1 accent-[#3f51b5] dark:accent-[#00bcd4]"
                    />
                    <span className="text-sm font-medium text-[#3f51b5] dark:text-[#00bcd4]">
                      {stat.percentage}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeStatistic(index)}
                  className="ml-0 md:ml-4 flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 shadow-sm hover:bg-red-100 dark:hover:bg-red-800/60 hover:text-white transition-all duration-200 group"
                  title="İstatistiği Sil"
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 group-hover:animate-pulse' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                  <span className="font-semibold text-xs group-hover:text-white">Sil</span>
                </button>
              </div>
            ))}
            <button
              onClick={addStatistic}
              className="mt-2 px-4 py-2 rounded-lg bg-[#3f51b5] text-white hover:bg-[#303f9f] transition-colors shadow"
            >
              İstatistik Ekle
            </button>
          </div>
        </div>
        <div className="mt-10">
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#3f51b5] to-[#00bcd4] hover:from-[#00bcd4] hover:to-[#3f51b5] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Kaydet
          </button>
        </div>
      </Card>
    </div>
  );
} 