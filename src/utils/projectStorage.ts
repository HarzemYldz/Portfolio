const initialProjects = [
  {
    id: 1,
    title: 'E-Ticaret Platformu',
    category: 'Web Geliştirme',
    status: 'Aktif',
    date: '2024-05-01',
  },
  {
    id: 2,
    title: 'Blog Sitesi',
    category: 'Kişisel',
    status: 'Pasif',
    date: '2024-04-15',
  },
  {
    id: 3,
    title: 'CRM Sistemi',
    category: 'Kurumsal',
    status: 'Aktif',
    date: '2024-03-20',
  },
];

export function getProjects() {
  const stored = localStorage.getItem('projects');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('projects', JSON.stringify(initialProjects));
  return initialProjects;
}

export function setProjects(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
} 