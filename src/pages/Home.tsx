import React, { Fragment, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { CheckBadgeIcon, SparklesIcon, ArrowRightIcon, EnvelopeIcon, LinkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { getProjects as getStoredProjects } from '../utils/projectStorage';
import { getSkills as getStoredSkills } from '../utils/skillsStorage';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import Card from '../components/Card';
import { useToast } from '../hooks/useToast';

const skills = [
  { name: 'React', icon: <SparklesIcon className="h-6 w-6 text-indigo-500" /> },
  { name: 'TypeScript', icon: <SparklesIcon className="h-6 w-6 text-blue-500" /> },
  { name: 'TailwindCSS', icon: <SparklesIcon className="h-6 w-6 text-cyan-500" /> },
  { name: 'Node.js', icon: <SparklesIcon className="h-6 w-6 text-green-500" /> },
  { name: 'Express', icon: <SparklesIcon className="h-6 w-6 text-gray-700" /> },
  { name: 'MongoDB', icon: <SparklesIcon className="h-6 w-6 text-green-700" /> },
];

type Project = {
  id: number;
  title: string;
  category: string;
  status: string;
  date: string;
  image?: string;
  description?: string;
  link?: string;
};

type AboutData = {
  title: string;
  description: string;
  image: string;
  experience?: { title: string; period: string; description: string }[];
  education?: { title: string; period: string; description: string }[];
  statistics?: { name: string; percentage: number }[];
};

const defaultAboutData: AboutData = {
  title: '',
  description: '',
  image: '',
  experience: [],
  education: [],
  statistics: [],
};

export default function Home() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'dark';
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);
  const [titleAnim, setTitleAnim] = useState(true);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  useEffect(() => {
    function syncProjects() {
      setProjects(getStoredProjects());
    }
    function syncSkills() {
      setSkills(getStoredSkills());
    }
    function syncAbout() {
      const savedData = localStorage.getItem('aboutData');
      if (savedData) {
        // Fill missing fields with defaults
        const parsed = { ...defaultAboutData, ...JSON.parse(savedData) };
        setAboutData(parsed);
      }
    }
    syncProjects();
    syncSkills();
    syncAbout();
    window.addEventListener('storage', syncProjects);
    window.addEventListener('storage', syncSkills);
    window.addEventListener('storage', syncAbout);
    return () => {
      window.removeEventListener('storage', syncProjects);
      window.removeEventListener('storage', syncSkills);
      window.removeEventListener('storage', syncAbout);
    };
  }, []);

  useEffect(() => {
    document.title = 'Harzem Umut Yıldız | Portfolio';
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement('link') as HTMLLinkElement;
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = '/favicon.ico';
  }, []);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  useEffect(() => {
    setTitleAnim(false);
    const timeout = setTimeout(() => setTitleAnim(true), 10);
    return () => clearTimeout(timeout);
  }, [aboutData.title]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Lütfen tüm alanları doldurun', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Geçerli bir email adresi girin', 'error');
      return;
    }

    // Save message to localStorage
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const newMessage = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString(),
      read: false
    };
    localStorage.setItem('messages', JSON.stringify([...messages, newMessage]));

    // Show success message
    showToast('Mesajınız başarıyla gönderildi!', 'success');

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  // Smooth scroll and highlight effect
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // Header yüksekliği için offset
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setHighlightedSection(id);
      setTimeout(() => setHighlightedSection(null), 1200);
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-white via-[#e3eafc] to-[#f5f7fa] dark:from-[#1a223f] dark:via-[#23395d] dark:to-[#101624] transition-colors duration-500">
      {/* Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/30 dark:bg-[#1a223f]/30 border-b border-white/20 dark:border-[#3f51b5]/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent">
                Harezm
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-[#1a223f] dark:text-[#e3eafc] hover:text-[#3f51b5] dark:hover:text-[#00bcd4] transition-colors text-sm font-medium"
              >
                Hakkımda
              </button>
              <button 
                onClick={() => scrollToSection('projects')} 
                className="text-[#1a223f] dark:text-[#e3eafc] hover:text-[#3f51b5] dark:hover:text-[#00bcd4] transition-colors text-sm font-medium"
              >
                Projeler
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-[#1a223f] dark:text-[#e3eafc] hover:text-[#3f51b5] dark:hover:text-[#00bcd4] transition-colors text-sm font-medium"
              >
                İletişim
              </button>
            </nav>

            {/* Dark Mode Toggle */}
            <button
              className="p-2 rounded-full bg-white/60 dark:bg-[#1a223f]/60 shadow hover:scale-110 transition border border-white/30 dark:border-[#3f51b5]/30"
              onClick={() => setDark((d) => !d)}
              aria-label="Tema Değiştir"
            >
              {dark ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-4 overflow-hidden border-b border-[#e3eafc]/60 dark:border-[#23395d]/40 mt-16">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <span className="animate-pulse absolute w-[600px] h-[600px] bg-[#90caf9]/30 dark:bg-[#23395d]/30 rounded-full blur-3xl opacity-30" />
          <span className="animate-pulse absolute w-[400px] h-[400px] bg-[#00bcd4]/20 dark:bg-[#1a223f]/30 rounded-full blur-3xl opacity-20" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 bg-white/60 dark:bg-[#1a223f]/55 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-[#3f51b5]/30 ring-1 ring-white/20 dark:ring-[#3f51b5]/10 px-8 py-12 max-w-2xl mx-auto flex flex-col items-center gap-6 transition-all duration-500">
          {aboutData.image && (
            <img
              src={aboutData.image}
              alt="Profil"
              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-[#3f51b5] shadow-lg animate-fade-in-up duration-700"
            />
          )}
          <h1 className={`text-4xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg ${titleAnim ? 'animate-fade-in-up duration-700 delay-100' : ''} bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent`}>
            <span className="inline-block">
              {aboutData.title || "I'm Harzem Umut Yıldız"}
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-[#1a223f] dark:text-[#e3eafc] max-w-2xl mb-8 animate-fade-in-up duration-700 delay-200">
            {aboutData.description || 'Full Stack Web Developer olarak modern ve kullanıcı dostu web uygulamaları geliştiriyorum.'}
          </p>
          <div className="flex gap-4 flex-wrap justify-center animate-fade-in-up duration-700 delay-300">
            <Popover className="relative">
              <Popover.Button className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 shadow-md backdrop-blur-md text-[#1a223f] dark:text-[#e3eafc] hover:bg-white/80 dark:hover:bg-[#23395d]/70 hover:scale-105 hover:shadow-lg">
                Projelerimi Gör <ArrowRightIcon className="h-5 w-5" />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-64 -translate-x-1/2 transform px-4 sm:px-0">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 bg-white dark:bg-gray-900">
                    <div className="p-4">
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">Öne Çıkan Proje</p>
                      <span className="block text-gray-700 dark:text-gray-300 text-sm">E-Ticaret Platformu, Blog Sitesi ve daha fazlası!</span>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
            <a href="#contact" className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 shadow-md backdrop-blur-md text-[#3f51b5] dark:text-[#00bcd4] hover:bg-white/80 dark:hover:bg-[#23395d]/70 hover:scale-105 hover:shadow-lg">
              İletişime Geç <EnvelopeIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative py-24 sm:py-32 border-b border-[#e3eafc]/60 dark:border-[#23395d]/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-12">
            <h2 className="text-base font-semibold leading-7 text-[#3f51b5] dark:text-[#00bcd4] animate-fade-in-up duration-700">Yeteneklerim</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#1a223f] dark:text-[#e3eafc] sm:text-4xl animate-fade-in-up duration-700 delay-100 bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent">
              Kullandığım Teknolojiler
            </p>
            <p className="mt-6 text-lg leading-8 text-[#23395d] dark:text-[#b0bec5] animate-fade-in-up duration-700 delay-200">
              Modern web teknolojileri ile kullanıcı dostu ve performanslı uygulamalar geliştiriyorum.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-none">
            <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up duration-700 delay-300">
              {skills.length === 0 ? (
                <span className="text-[#b0bec5] dark:text-[#90caf9]">Henüz yetenek eklenmedi.</span>
              ) : (
                skills.map((skill) => (
                  <Card
                    key={skill.id}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[#1a223f] dark:text-[#e3eafc] font-semibold text-lg shadow-2xl border border-white/30 dark:border-[#3f51b5]/30 backdrop-blur-2xl bg-white/60 dark:bg-[#1a223f]/55 ring-1 ring-white/20 dark:ring-[#3f51b5]/10 hover:scale-105 hover:shadow-[#00bcd4]/30 transition-all duration-300"
                  >
                    {skill.name}
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className={`relative py-24 sm:py-32 border-b border-[#e3eafc]/60 dark:border-[#23395d]/40 transition-shadow duration-500 ${highlightedSection === 'projects' ? 'ring-4 ring-[#00bcd4]/40 dark:ring-[#00bcd4]/40' : ''}`}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1a223f] dark:text-[#e3eafc] mb-12 flex items-center justify-center gap-2 animate-fade-in-up duration-700 bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent">
            <SparklesIcon className="h-7 w-7 text-[#3f51b5] animate-bounce" /> Projelerim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-fade-in-up duration-700 delay-100">
            {projects.length === 0 ? (
              <div className="col-span-3 text-center text-[#b0bec5] dark:text-[#90caf9]">Henüz proje eklenmedi.</div>
            ) : (
              projects.map((project) => (
                <Card
                  key={project.id}
                  className="flex flex-col group p-0 overflow-hidden hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 relative"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={project.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Projeyi aç"
                        className="absolute top-3 right-3 bg-white/80 dark:bg-[#23395d]/80 p-2 rounded-full shadow-md hover:bg-blue-100 dark:hover:bg-cyan-900/80 transition group/link"
                      >
                        <LinkIcon className="h-5 w-5 text-[#3f51b5] dark:text-[#00bcd4] group-hover/link:scale-110 group-hover/link:text-blue-700 dark:group-hover/link:text-cyan-300 transition-transform" />
                      </a>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col px-5 py-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                      {project.title}
                    </h3>
                    <span className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 w-fit">
                      {project.category}
                    </span>
                    {project.description && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border ${project.status === 'Aktif' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700' : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700'}`}>{project.status}</span>
                      <span className="text-xs text-gray-400 ml-2">{project.date}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="relative py-24 sm:py-32 border-b border-[#e3eafc]/60 dark:border-[#23395d]/40" id="contact">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-white/60 dark:bg-[#1a223f]/55 backdrop-blur-2xl rounded-2xl shadow-2xl p-10 border border-white/30 dark:border-[#3f51b5]/30 ring-1 ring-white/20 dark:ring-[#3f51b5]/10 animate-fade-in-up duration-700">
            <h2 className="text-3xl font-bold text-center text-[#1a223f] dark:text-[#e3eafc] mb-8 flex items-center justify-center gap-2 animate-fade-in-up duration-700 bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent">
              <EnvelopeIcon className="h-7 w-7 text-[#3f51b5] animate-bounce" /> İletişime Geç
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 dark:bg-[#23395d]/40 backdrop-blur-sm border border-white/30 dark:border-[#3f51b5]/30 hover:scale-105 transition-all duration-300">
                  <div className="p-3 rounded-full bg-[#3f51b5]/10 dark:bg-[#00bcd4]/10">
                    <EnvelopeIcon className="h-6 w-6 text-[#3f51b5] dark:text-[#00bcd4]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a223f] dark:text-[#e3eafc]">Email</h3>
                    <a href="mailto:yildizharzem@gmail.com" className="text-[#3f51b5] dark:text-[#00bcd4] hover:underline">
                      yildizharzem@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 dark:bg-[#23395d]/40 backdrop-blur-sm border border-white/30 dark:border-[#3f51b5]/30 hover:scale-105 transition-all duration-300">
                  <div className="p-3 rounded-full bg-[#3f51b5]/10 dark:bg-[#00bcd4]/10">
                    <FaLinkedin className="h-6 w-6 text-[#3f51b5] dark:text-[#00bcd4]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a223f] dark:text-[#e3eafc]">LinkedIn</h3>
                    <a 
                      href="https://www.linkedin.com/in/harzem-umut-yıldız-2356801b7/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#3f51b5] dark:text-[#00bcd4] hover:underline"
                    >
                      Harzem Umut Yıldız
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 dark:bg-[#23395d]/40 backdrop-blur-sm border border-white/30 dark:border-[#3f51b5]/30 hover:scale-105 transition-all duration-300">
                  <div className="p-3 rounded-full bg-[#3f51b5]/10 dark:bg-[#00bcd4]/10">
                    <FaGithub className="h-6 w-6 text-[#3f51b5] dark:text-[#00bcd4]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a223f] dark:text-[#e3eafc]">GitHub</h3>
                    <a 
                      href="https://github.com/HarzemYldz" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#3f51b5] dark:text-[#00bcd4] hover:underline"
                    >
                      @HarzemYldz
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#1a223f] dark:text-[#e3eafc] mb-1">
                    İsim
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/60 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent transition-all duration-300"
                    placeholder="Adınız"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1a223f] dark:text-[#e3eafc] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/60 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent transition-all duration-300"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#1a223f] dark:text-[#e3eafc] mb-1">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/60 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent transition-all duration-300"
                    placeholder="Mesajınızın konusu"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#1a223f] dark:text-[#e3eafc] mb-1">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/60 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#3f51b5] to-[#00bcd4] hover:from-[#00bcd4] hover:to-[#3f51b5] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Gönder
                </button>
              </form>
            </div>
          </Card>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="relative py-24 sm:py-32 border-b border-[#e3eafc]/60 dark:border-[#23395d]/40" id="about">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-white/60 dark:bg-[#1a223f]/55 backdrop-blur-2xl rounded-2xl shadow-2xl p-10 border border-white/30 dark:border-[#3f51b5]/30 ring-1 ring-white/20 dark:ring-[#3f51b5]/10 animate-fade-in-up duration-700">
            <h2 className="text-3xl font-bold text-center text-[#1a223f] dark:text-[#e3eafc] mb-8 flex items-center justify-center gap-2 animate-fade-in-up duration-700 bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent">
              <SparklesIcon className="h-7 w-7 text-[#3f51b5] animate-bounce" /> Hakkımda
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                {aboutData.image && (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#3f51b5] to-[#00bcd4] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <img
                      src={aboutData.image}
                      alt="Profil"
                      className="relative w-64 h-64 rounded-full object-cover border-4 border-white dark:border-[#3f51b5] shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="mt-6 flex gap-4">
                  <a
                    href="https://www.linkedin.com/in/harzem-umut-yıldız-2356801b7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#3f51b5]/10 dark:bg-[#00bcd4]/10 hover:bg-[#3f51b5]/20 dark:hover:bg-[#00bcd4]/20 transition-colors"
                  >
                    <FaLinkedin className="h-6 w-6 text-[#3f51b5] dark:text-[#00bcd4]" />
                  </a>
                  <a
                    href="https://github.com/HarzemYldz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#3f51b5]/10 dark:bg-[#00bcd4]/10 hover:bg-[#3f51b5]/20 dark:hover:bg-[#00bcd4]/20 transition-colors"
                  >
                    <FaGithub className="h-6 w-6 text-[#3f51b5] dark:text-[#00bcd4]" />
                  </a>
                </div>
              </div>

              {/* About Content */}
              <div className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-[#1a223f] dark:text-[#e3eafc] mb-4">
                    {aboutData.title || "Harzem Umut Yıldız"}
                  </h3>
                  <p className="text-lg text-[#1a223f] dark:text-[#b0bec5] leading-relaxed">
                    {aboutData.description || "Full Stack Web Developer olarak modern ve kullanıcı dostu web uygulamaları geliştiriyorum."}
                  </p>
                </div>

                {/* Skills Preview */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-[#1a223f] dark:text-[#e3eafc] mb-4">Yeteneklerim</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 6).map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-[#3f51b5]/10 dark:bg-[#00bcd4]/10 text-[#3f51b5] dark:text-[#00bcd4]"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {skills.length > 6 && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#3f51b5]/10 dark:bg-[#00bcd4]/10 text-[#3f51b5] dark:text-[#00bcd4]">
                        +{skills.length - 6} daha
                      </span>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-[#1a223f] dark:text-[#e3eafc] mb-4">Deneyim</h4>
                  <div className="space-y-4">
                    {aboutData.experience?.map((exp, index) => (
                      <div key={index} className="p-4 rounded-xl bg-white/40 dark:bg-[#23395d]/40 backdrop-blur-sm border border-white/30 dark:border-[#3f51b5]/30">
                        <h5 className="font-semibold text-[#1a223f] dark:text-[#e3eafc]">{exp.title}</h5>
                        <p className="text-sm text-[#3f51b5] dark:text-[#00bcd4]">{exp.period}</p>
                        <p className="mt-2 text-[#1a223f] dark:text-[#b0bec5]">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-[#1a223f] dark:text-[#e3eafc] mb-4">Eğitim</h4>
                  <div className="space-y-4">
                    {aboutData.education?.map((edu, index) => (
                      <div key={index} className="p-4 rounded-xl bg-white/40 dark:bg-[#23395d]/40 backdrop-blur-sm border border-white/30 dark:border-[#3f51b5]/30">
                        <h5 className="font-semibold text-[#1a223f] dark:text-[#e3eafc]">{edu.title}</h5>
                        <p className="text-sm text-[#3f51b5] dark:text-[#00bcd4]">{edu.period}</p>
                        <p className="mt-2 text-[#1a223f] dark:text-[#b0bec5]">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-[#1a223f] dark:text-[#e3eafc] mb-4">İstatistikler</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {aboutData.statistics?.map((stat, index) => (
                      <div key={index} className="p-4 rounded-xl bg-white/40 dark:bg-[#23395d]/40 backdrop-blur-sm border border-white/30 dark:border-[#3f51b5]/30">
                        <h5 className="font-semibold text-[#1a223f] dark:text-[#e3eafc]">{stat.name}</h5>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-full h-2 bg-[#3f51b5]/20 dark:bg-[#00bcd4]/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#3f51b5] to-[#00bcd4] rounded-full" style={{ width: `${stat.percentage}%` }}></div>
                          </div>
                          <span className="text-sm font-medium text-[#3f51b5] dark:text-[#00bcd4]">{stat.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 w-screen overflow-x-hidden border-t-0 bg-gradient-to-tr from-indigo-600/90 via-indigo-800/90 to-blue-900/90 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 shadow-2xl mt-0">
        <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* About/Brand */}
          <div className="flex flex-col items-center md:items-start gap-3 text-white">
            <div className="flex items-center gap-3 text-xl font-bold tracking-wide drop-shadow-lg">
              <span className="inline-block bg-white/10 rounded-full p-2">
                <FaGithub className="text-2xl text-white" />
              </span>
              <span>Harezm Portfolio</span>
            </div>
            <p className="text-sm text-white/80 max-w-xs mt-2">
              Modern, yenilikçi ve kullanıcı odaklı web uygulamaları geliştiriyorum. Bu portfolyo, projelerimi ve yeteneklerimi sergilemek için tasarlandı.
            </p>
            <a
              href="mailto:yildizharzem@gmail.com"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/40 dark:bg-[#23395d]/40 dark:hover:bg-[#00bcd4]/20 text-white dark:text-[#00bcd4] font-semibold transition-all duration-200 shadow group"
              aria-label="E-posta Gönder"
            >
              <EnvelopeIcon className="h-5 w-5 group-hover:animate-pulse" /> E-posta Gönder
            </a>
          </div>
          {/* Center: Navigation & Motto */}
          <div className="flex flex-col items-center gap-4 text-white/90">
            <nav className="flex flex-wrap gap-3 justify-center text-sm font-medium">
              <button onClick={() => scrollToSection('about')} className="hover:text-[#00bcd4] transition-colors">Hakkımda</button>
              <span className="text-white/30">|</span>
              <button onClick={() => scrollToSection('projects')} className="hover:text-[#00bcd4] transition-colors">Projeler</button>
              <span className="text-white/30">|</span>
              <button onClick={() => scrollToSection('contact')} className="hover:text-[#00bcd4] transition-colors">İletişim</button>
            </nav>
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#00bcd4] via-[#3f51b5] to-[#90caf9] opacity-40 my-1" />
            <blockquote className="italic text-xs text-white/70 max-w-xs text-center">"Hayal et, kodla, geliştir. Her satırda bir adım ileri!"</blockquote>
          </div>
          {/* Socials */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/harzem-umut-yıldız-2356801b7/"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-white hover:text-indigo-300 transition-colors text-3xl p-2 rounded-full bg-white/10 hover:bg-indigo-700/80 shadow-lg border border-white/20 hover:scale-110 duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="group-hover:animate-bounce" />
              </a>
              <a
                href="https://github.com/HarzemYldz"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-white hover:text-indigo-300 transition-colors text-3xl p-2 rounded-full bg-white/10 hover:bg-indigo-700/80 shadow-lg border border-white/20 hover:scale-110 duration-200"
                aria-label="GitHub"
              >
                <FaGithub className="group-hover:animate-bounce" />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-white/80 dark:text-gray-300 pb-6 tracking-wide flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 justify-center">
            <span className="font-bold text-yellow-300 animate-pulse">© {new Date().getFullYear()} Harezm</span>
            <span className="text-white/60">|</span>
            <span className="text-white/80 dark:text-gray-300">Tüm hakları saklıdır.</span>
            <span className="hidden sm:inline text-white/60">|</span>
            <span className="hidden sm:inline text-white/80 dark:text-gray-300">Designed & coded with <span className='text-pink-400'>♥</span> by Harzem Umut Yıldız</span>
          </div>
          <span className="text-xs text-white/40 dark:text-gray-500">Bu site React, TypeScript ve TailwindCSS ile geliştirilmiştir.</span>
        </div>
        {/* Scroll to Top Floating Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#00bcd4] to-[#3f51b5] text-white font-semibold shadow-2xl hover:from-[#3f51b5] hover:to-[#00bcd4] hover:scale-110 transition-all duration-300 animate-fade-in-up border-2 border-white/30 dark:border-[#3f51b5]/30 group"
            aria-label="Yukarı Çık"
            title="Yukarı Çık"
          >
            <svg className="h-5 w-5 group-hover:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
            <span className="hidden sm:inline">Yukarı Çık</span>
          </button>
        )}
      </footer>
    </div>
  );
}