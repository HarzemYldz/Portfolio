import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const useConfirm = () => {
  const confirm = async (title: string, text: string) => {
    const result = await MySwal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Evet',
      cancelButtonText: 'Hayır',
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#ef4444',
      background: document.documentElement.classList.contains('dark') ? '#1a223f' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#e3eafc' : '#1a223f',
      backdrop: `
        rgba(0,0,0,0.4)
        left top
        no-repeat
      `,
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-xl font-bold',
        htmlContainer: 'text-base',
        confirmButton: 'rounded-xl px-6 py-2.5 font-medium transition-all duration-200 hover:opacity-90',
        cancelButton: 'rounded-xl px-6 py-2.5 font-medium transition-all duration-200 hover:opacity-90',
        closeButton: 'rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200',
        actions: 'gap-2',
      },
      buttonsStyling: false,
      reverseButtons: true,
    });

    return result.isConfirmed;
  };

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const colors = {
      success: {
        bg: document.documentElement.classList.contains('dark') ? '#1a223f' : '#ffffff',
        text: document.documentElement.classList.contains('dark') ? '#e3eafc' : '#1a223f',
        icon: '#10b981',
        border: document.documentElement.classList.contains('dark') ? '#3f51b5' : '#e5e7eb',
      },
      error: {
        bg: document.documentElement.classList.contains('dark') ? '#1a223f' : '#ffffff',
        text: document.documentElement.classList.contains('dark') ? '#e3eafc' : '#1a223f',
        icon: '#ef4444',
        border: document.documentElement.classList.contains('dark') ? '#3f51b5' : '#e5e7eb',
      },
      warning: {
        bg: document.documentElement.classList.contains('dark') ? '#1a223f' : '#ffffff',
        text: document.documentElement.classList.contains('dark') ? '#e3eafc' : '#1a223f',
        icon: '#f59e0b',
        border: document.documentElement.classList.contains('dark') ? '#3f51b5' : '#e5e7eb',
      },
      info: {
        bg: document.documentElement.classList.contains('dark') ? '#1a223f' : '#ffffff',
        text: document.documentElement.classList.contains('dark') ? '#e3eafc' : '#1a223f',
        icon: '#3f51b5',
        border: document.documentElement.classList.contains('dark') ? '#3f51b5' : '#e5e7eb',
      },
    };

    const color = colors[type];

    MySwal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: type,
      title: message,
      background: color.bg,
      color: color.text,
      iconColor: color.icon,
      customClass: {
        popup: 'rounded-xl shadow-2xl border border-opacity-20',
        title: 'text-sm font-medium',
        closeButton: 'rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200',
        timerProgressBar: 'bg-opacity-20',
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  };

  return { confirm, notify };
}; 