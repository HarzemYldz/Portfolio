import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from '../../hooks/useConfirm';
import Card from '../../components/Card';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const navigate = useNavigate();
  const { notify } = useConfirm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors: { username?: string; password?: string } = {};
    if (!credentials.username) {
      newErrors.username = 'Kullanıcı adı zorunludur';
      hasError = true;
    }
    if (!credentials.password) {
      newErrors.password = 'Şifre zorunludur';
      hasError = true;
    }
    setErrors(newErrors);
    if (hasError) return;
    
    // Burada gerçek bir API entegrasyonu yapılabilir
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      notify('Başarıyla giriş yapıldı!', 'success');
      navigate('/admin/dashboard');
    } else {
      notify('Kullanıcı adı veya şifre hatalı!', 'error');
    }
  };

  useEffect(() => {
    document.title = 'Giriş Yap | Admin Paneli';
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = '/favicon.ico';
  }, []);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#e3eafc] via-[#f5f7fa] to-[#90caf9] dark:from-[#1a223f] dark:via-[#2a3a6a] dark:to-[#1a223f] p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/70 dark:bg-[#1a223f]/70 backdrop-blur-2xl p-8 border border-white/30 dark:border-[#3f51b5]/30 shadow-2xl animate-fade-in-up duration-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a223f] dark:text-[#e3eafc] mb-2">Admin Panel</h1>
            <p className="text-[#3f51b5] dark:text-[#00bcd4]">Yönetim paneline hoş geldiniz</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#1a223f] dark:text-[#e3eafc] mb-2">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => {
                  setCredentials(prev => ({ ...prev, username: e.target.value }));
                  setErrors(err => ({ ...err, username: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-[#23395d]/80 border ${errors.username ? 'border-red-500' : 'border-white/30 dark:border-[#3f51b5]/30'} text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition-all duration-200`}
                placeholder="Kullanıcı adınızı girin"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1a223f] dark:text-[#e3eafc] mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials(prev => ({ ...prev, password: e.target.value }));
                  setErrors(err => ({ ...err, password: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-[#23395d]/80 border ${errors.password ? 'border-red-500' : 'border-white/30 dark:border-[#3f51b5]/30'} text-[#1a223f] dark:text-[#e3eafc] placeholder-gray-400 focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition-all duration-200`}
                placeholder="Şifrenizi girin"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00bcd4] to-[#3f51b5] text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98] shadow-lg"
            >
              Giriş Yap
            </button>
          </form>

          <Card className="mt-6 text-center bg-white/80 dark:bg-[#23395d]/60 border border-white/30 dark:border-[#3f51b5]/30 p-4 animate-fade-in-up duration-700 delay-100">
            <p className="text-sm text-[#3f51b5] dark:text-[#00bcd4]">
              <span className="font-semibold">Demo için</span> kullanıcı adı: <span className="font-mono text-[#3f51b5] dark:text-[#00bcd4]">admin</span>, şifre: <span className="font-mono text-[#3f51b5] dark:text-[#00bcd4]">admin123</span>
            </p>
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default Login; 