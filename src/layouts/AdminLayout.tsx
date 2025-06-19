import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
  UserCircleIcon,
  MoonIcon,
  SunIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PowerIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useConfirm } from '../hooks/useConfirm'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Projeler', href: '/admin/projects', icon: FolderIcon },
  { name: 'Yetenekler', href: '/admin/skills', icon: WrenchScrewdriverIcon },
  { name: 'Hakkımda', href: '/admin/about', icon: UserIcon },
  { name: 'Mesajlar', href: '/admin/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Profil', href: '/admin/profile', icon: UserCircleIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dark, setDark] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { confirm, notify } = useConfirm()

  // Dark mode toggle
  if (typeof window !== 'undefined') {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = async () => {
    const isConfirmed = await confirm(
      'Çıkış yapmak istediğinize emin misiniz?',
      'Bu işlem sizi login sayfasına yönlendirecektir.'
    )

    if (isConfirmed) {
      localStorage.removeItem('isAuthenticated')
      notify('Başarıyla çıkış yapıldı!', 'success')
      navigate('/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 flex">
      {/* Sidebar */}
      <aside
        className={
          classNames(
            'fixed z-40 top-0 left-0 h-full flex flex-col shadow-xl transition-all duration-300',
            sidebarCollapsed ? 'w-20' : 'w-64',
            'bg-[#f5f6fa] dark:bg-[#23272f] border-r border-gray-200 dark:border-gray-800',
            'rounded-tr-3xl rounded-br-3xl',
            'm-2',
            'neumorph-sidebar',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )
        }
      >
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className={classNames('text-xl font-bold text-gray-900 dark:text-white transition-all duration-300', sidebarCollapsed && 'opacity-0 w-0 overflow-hidden')}>Admin</h1>
          <button
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 hover:scale-110 transition"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label="Sidebarı Aç/Kapat"
          >
            {sidebarCollapsed ? <ChevronDoubleRightIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" /> : <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />}
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-y-2 mt-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                location.pathname === item.href
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800',
                'flex items-center gap-x-3 mx-3 my-1 py-3 rounded-2xl font-semibold shadow-sm transition-all duration-200',
                'neumorph-btn',
                sidebarCollapsed ? 'justify-center px-0' : 'px-4'
              )}
            >
              <span className={classNames('flex items-center justify-center', sidebarCollapsed ? 'w-full' : '')}>
                <item.icon className="h-7 w-7 min-w-[28px] min-h-[28px]" />
              </span>
              <span className={classNames('transition-all duration-200', sidebarCollapsed && 'opacity-0 w-0 overflow-hidden')}>{item.name}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className={classNames(
              'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200',
              sidebarCollapsed ? 'justify-center' : 'justify-start'
            )}
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            <span className={classNames('transition-all duration-200', sidebarCollapsed && 'opacity-0 w-0 overflow-hidden')}>Çıkış Yap</span>
          </button>
        </nav>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-2 mb-6">
          <button
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 hover:scale-110 transition"
            onClick={() => setDark((d) => !d)}
            aria-label="Tema Değiştir"
          >
            {dark ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={classNames('flex-1 flex flex-col min-h-screen transition-all duration-300', sidebarCollapsed ? 'ml-20' : 'ml-64')}> 
        {/* Modern Navbar */}
        <header className="sticky top-0 z-30 h-14 flex items-center px-4 sm:px-8 bg-white/30 dark:bg-[#1a223f]/30 backdrop-blur-xl border-b border-white/20 dark:border-[#3f51b5]/20 shadow-lg">
          {/* Sol: Logo veya başlık */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent">
              PORTFOLIO
            </span>
          </div>
          {/* Orta: Dinamik başlık (örnek olarak Dashboard) */}
          <div className="flex-1 flex justify-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">Admin Paneli</span>
          </div>
          {/* Sağ: Dark mode toggle, avatar, çıkış */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full bg-white/60 dark:bg-[#1a223f]/60 shadow hover:scale-110 transition border border-white/30 dark:border-[#3f51b5]/30"
              onClick={() => setDark((d) => !d)}
              aria-label="Tema Değiştir"
            >
              {dark ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />}
            </button>
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center p-1.5 rounded-full hover:bg-white/20 dark:hover:bg-[#23395d]/20 transition">
                <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-200" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white dark:bg-gray-900 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none neumorph-btn">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/admin/profile"
                        className={classNames(
                          active ? 'bg-gray-50 dark:bg-gray-800' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-200'
                        )}
                      >
                        Profil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? 'bg-gray-50 dark:bg-gray-800' : '',
                          'flex items-center gap-2 w-full px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-200 text-left rounded-md transition'
                        )}
                      >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-500" /> Çıkış Yap
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </header>
        <main className="flex-1 py-10 px-6 bg-gray-100 dark:bg-gray-900 neumorph-main transition-colors duration-500">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Neumorphism custom styles */}
      <style>{`
        .neumorph-sidebar {
          box-shadow: 8px 8px 24px #e0e0e0, -8px -8px 24px #ffffff;
        }
        .dark .neumorph-sidebar {
          box-shadow: 8px 8px 24px #181a20, -8px -8px 24px #23272f;
        }
        .neumorph-btn {
          box-shadow: 4px 4px 12px #e0e0e0, -4px -4px 12px #ffffff;
        }
        .dark .neumorph-btn {
          box-shadow: 4px 4px 12px #181a20, -4px -4px 12px #23272f;
        }
        .neumorph-navbar {
          box-shadow: 4px 4px 16px #e0e0e0, -4px -4px 16px #ffffff;
        }
        .dark .neumorph-navbar {
          box-shadow: 4px 4px 16px #181a20, -4px -4px 16px #23272f;
        }
        .neumorph-main {
          box-shadow: 0 0 0 transparent;
        }
      `}</style>
    </div>
  )
} 