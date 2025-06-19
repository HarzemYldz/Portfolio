import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Project {
  id: number;
  title: string;
  category: string;
  status: string;
  date: string;
  image: string;
  description?: string;
  link?: string;
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'E-Ticaret Platformu',
    category: 'Web Geliştirme',
    status: 'Aktif',
    date: '2024-05-01',
    image: '',
    description: 'Modern ve ölçeklenebilir bir e-ticaret platformu.',
    link: 'https://eticaret.com',
  },
  {
    id: 2,
    title: 'Blog Sitesi',
    category: 'Kişisel',
    status: 'Pasif',
    date: '2024-04-15',
    image: '',
    description: 'Kişisel yazılar ve makaleler için blog sitesi.',
    link: '',
  },
  {
    id: 3,
    title: 'CRM Sistemi',
    category: 'Kurumsal',
    status: 'Aktif',
    date: '2024-03-20',
    image: '',
    description: 'Müşteri ilişkileri yönetimi için CRM uygulaması.',
    link: '',
  },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem('projects');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('projects', JSON.stringify(initialProjects));
    return initialProjects;
  });
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<string | null>(null);
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const itemsPerPage = 10;

  // LocalStorage senkronizasyonu
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  // Filtreleme ve sıralama
  const filteredProjects = projects
    .filter(project =>
      (project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.category.toLowerCase().includes(search.toLowerCase()) ||
        project.status.toLowerCase().includes(search.toLowerCase())) &&
      (filterCategory ? project.category === filterCategory : true) &&
      (filterStatus ? project.status === filterStatus : true) &&
      (filterDateFrom ? project.date >= filterDateFrom : true) &&
      (filterDateTo ? project.date <= filterDateTo : true)
    )
    .sort((a, b) => {
      const aValue = a[sortKey as keyof Project];
      const bValue = b[sortKey as keyof Project];
      if (aValue === undefined || bValue === undefined) return 0;
      return sortDir === 'asc'
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

  // Sayfalama
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Proje ekleme
  function handleAddProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newProject: Project = {
      id: Date.now(),
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
      date: formData.get('date') as string,
      image: newImage || '',
      description: formData.get('description') as string,
      link: formData.get('link') as string,
    };
    
    setProjects(prev => [newProject, ...prev]);
    setShowAddModal(false);
    setNewImage(null);
    form.reset();
    showToast('Proje başarıyla eklendi!', 'success');
  }

  // Proje düzenleme
  function handleEditProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editProject) return;
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    setProjects(prev => prev.map(p =>
      p.id === editProject.id
        ? {
            ...p,
            title: formData.get('title') as string,
            category: formData.get('category') as string,
            status: formData.get('status') as string,
            date: formData.get('date') as string,
            image: editImage !== null ? editImage : p.image,
            description: formData.get('description') as string,
            link: formData.get('link') as string,
          }
        : p
    ));
    setShowEditModal(false);
    setEditProject(null);
    setEditImage(null);
    showToast('Proje başarıyla güncellendi!', 'success');
  }

  // Proje silme
  async function handleDeleteProject(id: number) {
    const isConfirmed = await confirm(
      'Bu projeyi silmek istediğinize emin misiniz?',
      'Bu işlem geri alınamaz.'
    );
    
    if (isConfirmed) {
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast('Proje başarıyla silindi!', 'success');
    }
  }

  // Sıralama işlemi
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  useEffect(() => {
    document.title = 'Projeler | Admin Paneli';
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = '/favicon.ico';
  }, []);

  return (
    <div className="p-6 bg-white/60 dark:bg-[#1a223f]/55 rounded-lg shadow-2xl transition-colors duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Projeler</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00bcd4] to-[#3f51b5] text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98]"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Yeni Proje</span>
          </button>
          <button
            onClick={() => {
              const data = JSON.stringify(projects, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'projeler.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3f51b5] to-[#00bcd4] text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-3-3m3 3l3-3M4.5 19.5A9 9 0 1119.5 4.5a9 9 0 01-15 15z" />
            </svg>
            <span>Dışa Aktar</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00bcd4] to-[#3f51b5] text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98] cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m0-8l-3 3m3-3l3 3M4.5 19.5A9 9 0 1119.5 4.5a9 9 0 01-15 15z" />
            </svg>
            <span>İçe Aktar</span>
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    const imported = JSON.parse(ev.target?.result as string);
                    if (Array.isArray(imported)) {
                      setProjects(imported);
                      localStorage.setItem('projects', JSON.stringify(imported));
                      showToast('Projeler başarıyla içe aktarıldı!', 'success');
                    } else {
                      showToast('Geçersiz dosya formatı.', 'error');
                    }
                  } catch {
                    showToast('Dosya okunamadı.', 'error');
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        <input
          type="text"
          placeholder="Proje ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-4 py-2 rounded-xl bg-white/80 dark:bg-[#23395d]/70 border border-white/30 dark:border-[#3f51b5]/30 shadow-[0_2px_12px_0_rgba(60,80,180,0.08)] dark:shadow-md text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] transition-all duration-200"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="w-full md:w-40 px-3 py-2 rounded-xl bg-white/80 dark:bg-[#23395d]/70 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4]"
        >
          <option value="">Kategori (Tümü)</option>
          {[...new Set(projects.map(p => p.category))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="w-full md:w-32 px-3 py-2 rounded-xl bg-white/80 dark:bg-[#23395d]/70 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4]"
        >
          <option value="">Durum (Tümü)</option>
          <option value="Aktif">Aktif</option>
          <option value="Pasif">Pasif</option>
        </select>
        <input
          type="date"
          value={filterDateFrom}
          onChange={e => setFilterDateFrom(e.target.value)}
          className="w-full md:w-36 px-3 py-2 rounded-xl bg-white/80 dark:bg-[#23395d]/70 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4]"
          placeholder="Başlangıç Tarihi"
        />
        <input
          type="date"
          value={filterDateTo}
          onChange={e => setFilterDateTo(e.target.value)}
          className="w-full md:w-36 px-3 py-2 rounded-xl bg-white/80 dark:bg-[#23395d]/70 border border-white/30 dark:border-[#3f51b5]/30 text-[#1a223f] dark:text-[#e3eafc] focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4]"
          placeholder="Bitiş Tarihi"
        />
      </div>

      {/* DataTable */}
      <div className="overflow-x-auto rounded-xl border border-white/30 dark:border-[#3f51b5]/30">
        <table className="w-full min-w-[700px] md:min-w-full">
          <thead>
            <tr className="bg-white/80 dark:bg-[#23395d]/70">
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#1a223f] dark:text-[#e3eafc]">Görsel</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#1a223f] dark:text-[#e3eafc] cursor-pointer hover:bg-white/90 dark:hover:bg-[#23395d]/90 transition-colors duration-200" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-2">Başlık{sortKey === 'title' && (sortDir === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#1a223f] dark:text-[#e3eafc] cursor-pointer hover:bg-white/90 dark:hover:bg-[#23395d]/90 transition-colors duration-200" onClick={() => handleSort('category')}>
                <div className="flex items-center gap-2">Kategori{sortKey === 'category' && (sortDir === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#1a223f] dark:text-[#e3eafc] cursor-pointer hover:bg-white/90 dark:hover:bg-[#23395d]/90 transition-colors duration-200" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-2">Durum{sortKey === 'status' && (sortDir === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#1a223f] dark:text-[#e3eafc] cursor-pointer hover:bg-white/90 dark:hover:bg-[#23395d]/90 transition-colors duration-200" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-2">Tarih{sortKey === 'date' && (sortDir === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-[#1a223f] dark:text-[#e3eafc]">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((project) => (
              <tr key={project.id} className="border-b border-white/30 dark:border-[#3f51b5]/30 hover:bg-white/50 dark:hover:bg-[#23395d]/50 transition-colors duration-300">
                <td className="px-4 py-3">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="h-12 w-12 object-cover rounded-lg border border-gray-200 dark:border-[#3f51b5]/30 bg-white dark:bg-[#23395d]/70" />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#3f51b5]/30 bg-gray-100 dark:bg-[#23395d]/70 text-gray-400 text-xs">
                      Yok
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-[#1a223f] dark:text-[#e3eafc]">{project.title}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.category === 'Web Geliştirme' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : project.category === 'Kişisel' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' : project.category === 'Kurumsal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}`}>{project.category}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border ${project.status === 'Aktif' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700' : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700'}`}>{project.status}</span>
                </td>
                <td className="px-4 py-3 text-sm text-[#1a223f] dark:text-[#e3eafc]">{project.date}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setDetailProject(project);
                        setShowDetailModal(true);
                      }}
                      className="p-2 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors duration-200"
                      title="Detayları Gör"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C2.25 12 5.25 5.25 12 5.25s9.75 6.75 9.75 6.75-3 6.75-9.75 6.75S2.25 12 2.25 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setEditProject(project);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                      title="Düzenle"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      title="Sil"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-[#1a223f] dark:text-[#e3eafc]">
          Toplam {filteredProjects.length} proje
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 text-[#3f51b5] dark:text-[#00bcd4] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki
          </button>
          <span className="px-3 py-1 text-[#1a223f] dark:text-[#e3eafc]">
            Sayfa {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-lg bg-white/60 dark:bg-[#1a223f]/55 border border-white/30 dark:border-[#3f51b5]/30 text-[#3f51b5] dark:text-[#00bcd4] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
          </button>
        </div>
      </div>

      {/* Add Modal */}
      <Transition appear show={showAddModal} as={React.Fragment}>
        <Dialog
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white dark:bg-[#1a223f] p-4 sm:p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                    Yeni Proje Ekle
                  </Dialog.Title>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Başlık
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kategori
                    </label>
                    <input
                      type="text"
                      name="category"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Durum
                    </label>
                    <select
                      name="status"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Pasif">Pasif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tarih
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Proje Görseli
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setNewImage(reader.result as string);
                          reader.readAsDataURL(file);
                        } else {
                          setNewImage(null);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3f51b5] file:text-white hover:file:bg-[#00bcd4] dark:file:bg-[#00bcd4] dark:file:text-white dark:hover:file:bg-[#3f51b5]"
                    />
                    {newImage && (
                      <div className="mt-2">
                        <img src={newImage} alt="Önizleme" className="rounded-lg h-32 object-cover w-full" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Proje Linki
                    </label>
                    <input
                      type="url"
                      name="link"
                      className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-[#00bcd4] to-[#3f51b5] text-white rounded-lg hover:opacity-90 transition-all duration-200"
                    >
                      Ekle
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Modal */}
      <Transition appear show={showEditModal} as={React.Fragment}>
        <Dialog
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white dark:bg-[#1a223f] p-4 sm:p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                    Proje Düzenle
                  </Dialog.Title>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                {editProject && (
                  <form onSubmit={handleEditProject} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Başlık
                      </label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editProject.title}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kategori
                      </label>
                      <input
                        type="text"
                        name="category"
                        defaultValue={editProject.category}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Durum
                      </label>
                      <select
                        name="status"
                        defaultValue={editProject.status}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Pasif">Pasif</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tarih
                      </label>
                      <input
                        type="date"
                        name="date"
                        defaultValue={editProject.date}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Proje Görseli
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setEditImage(reader.result as string);
                            reader.readAsDataURL(file);
                          } else {
                            setEditImage(null);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3f51b5] file:text-white hover:file:bg-[#00bcd4] dark:file:bg-[#00bcd4] dark:file:text-white dark:hover:file:bg-[#3f51b5]"
                      />
                      {(editImage || editProject.image) && (
                        <div className="mt-2">
                          <img src={editImage || editProject.image} alt="Önizleme" className="rounded-lg h-32 object-cover w-full" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Açıklama
                      </label>
                      <textarea
                        name="description"
                        defaultValue={editProject?.description}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Proje Linki
                      </label>
                      <input
                        type="url"
                        name="link"
                        defaultValue={editProject?.link}
                        className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-[#23395d]/70 border border-gray-300 dark:border-[#3f51b5]/30 focus:ring-2 focus:ring-[#3f51b5] dark:focus:ring-[#00bcd4] focus:border-[#3f51b5] dark:focus:border-[#00bcd4] text-gray-900 dark:text-white"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-[#00bcd4] to-[#3f51b5] text-white rounded-lg hover:opacity-90 transition-all duration-200"
                      >
                        Güncelle
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Proje Detay Modalı */}
      <Transition appear show={showDetailModal} as={React.Fragment}>
        <Dialog
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white dark:bg-[#1a223f] p-4 sm:p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                    Proje Detayları
                  </Dialog.Title>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                {detailProject && (
                  <div className="space-y-4">
                    <div>
                      {detailProject.image ? (
                        <img src={detailProject.image} alt={detailProject.title} className="rounded-lg w-full h-48 object-cover border border-gray-200 dark:border-[#3f51b5]/30 bg-white dark:bg-[#23395d]/70" />
                      ) : (
                        <div className="h-48 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#3f51b5]/30 bg-gray-100 dark:bg-[#23395d]/70 text-gray-400 text-lg">
                          Görsel Yok
                        </div>
                      )}
                    </div>
                    <div className="bg-white/80 dark:bg-[#23395d]/70 rounded-xl p-4 shadow-sm border border-white/30 dark:border-[#3f51b5]/30">
                      <div className="text-lg font-bold text-[#1a223f] dark:text-[#e3eafc] mb-1">{detailProject.title}</div>
                      <div className="flex gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${detailProject.category === 'Web Geliştirme' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : detailProject.category === 'Kişisel' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : detailProject.category === 'Kurumsal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}
                        `}>
                          {detailProject.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border 
                          ${detailProject.status === 'Aktif'
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700'
                            : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700'}
                        `}>
                          {detailProject.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">Tarih: {detailProject.date}</div>
                      {detailProject.description && (
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                          <span className="font-semibold">Açıklama: </span>{detailProject.description}
                        </div>
                      )}
                      {detailProject.link && (
                        <div className="mt-2">
                          <a href={detailProject.link} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-600 dark:text-cyan-400 underline break-all font-medium hover:opacity-80 transition">
                            Proje Linkini Aç
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Projects; 