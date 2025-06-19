import { useState, useEffect } from 'react';
import { useConfirm } from '../../hooks/useConfirm';
import Card from '../../components/Card';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  isRead: boolean;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { confirm, notify } = useConfirm();

  useEffect(() => {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    document.title = 'Mesajlar | Admin Paneli';
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = '/favicon.ico';
  }, []);

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm(
      'Bu mesajı silmek istediğinize emin misiniz?',
      'Bu işlem geri alınamaz.'
    );

    if (isConfirmed) {
      const updatedMessages = messages.filter(msg => msg.id !== id);
      setMessages(updatedMessages);
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      notify('Mesaj başarıyla silindi!', 'success');
    }
  };

  const handleToggleRead = async (id: string) => {
    const updatedMessages = messages.map(msg =>
      msg.id === id ? { ...msg, isRead: !msg.isRead } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
    notify('Mesaj durumu güncellendi!', 'success');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-[#1a223f] dark:text-[#e3eafc] animate-fade-in-up duration-700 bg-gradient-to-r from-[#3f51b5] via-[#00bcd4] to-[#90caf9] dark:from-[#90caf9] dark:via-[#00bcd4] dark:to-[#3f51b5] bg-clip-text text-transparent">Mesajlar</h2>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Henüz mesaj bulunmuyor.
          </p>
        ) : (
          messages.map(message => (
            <Card
              key={message.id}
              className={`p-4 ${
                message.isRead
                  ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {message.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {message.email}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleRead(message.id)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      message.isRead
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        : 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {message.isRead ? 'Okundu' : 'Okunmadı'}
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-900/40"
                  >
                    Sil
                  </button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {message.message}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(message.date)}
              </p>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};

export default Messages; 