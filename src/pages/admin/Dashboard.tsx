import React, { Fragment, useMemo, useState, useEffect } from 'react'
import { Menu, Transition, Dialog } from '@headlessui/react'
import {
  EllipsisVerticalIcon,
  PlusIcon,
  UserCircleIcon,
  BriefcaseIcon,
  SparklesIcon,
  InboxIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { getProjects as getStoredProjects, setProjects as setStoredProjects } from '../../utils/projectStorage'
import Card from '../../components/Card'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const stats = [
  {
    name: 'Toplam Proje',
    icon: BriefcaseIcon,
    color: 'from-indigo-200 to-indigo-400',
  },
  {
    name: 'Yetenek',
    icon: SparklesIcon,
    color: 'from-green-200 to-green-400',
  },
  {
    name: 'Mesaj',
    icon: InboxIcon,
    color: 'from-pink-200 to-pink-400',
  },
]

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
]

const PAGE_SIZE = 5

interface Project {
  id: number;
  title: string;
  category: string;
  status: string;
  date: string;
}

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard | Admin Paneli';
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = '/favicon.ico';
  }, []);

  // Sadece hoş geldin mesajı ve istatistik kartları kalsın
  return (
    <div className="space-y-8">
      {/* Hoş geldin mesajı */}
      <Card className="rounded-3xl p-8 flex items-center gap-4">
        <UserCircleIcon className="h-12 w-12 text-indigo-400 dark:text-indigo-300" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hoş geldin, Admin!</h2>
          <p className="text-gray-600 dark:text-gray-300">Bugün harika işler başarmaya hazır mısın?</p>
        </div>
      </Card>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={stat.name}
            className={
              classNames(
                'p-6 flex items-center gap-4 group transition',
                'bg-gradient-to-br',
                stat.color,
                'dark:from-gray-800 dark:to-gray-900'
              )
            }
          >
            <stat.icon className="h-10 w-10 text-indigo-500 dark:text-indigo-300 group-hover:scale-110 transition" />
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{i === 0 ? 0 : stat.name === 'Yetenek' ? 8 : 5}</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">{stat.name}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 