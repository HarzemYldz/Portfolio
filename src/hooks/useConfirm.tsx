import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function useConfirm() {
  const confirm = async (title: string, text?: string) => {
    const result = await MySwal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet',
      cancelButtonText: 'Vazgeç',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#1f2937',
      customClass: {
        popup: 'dark:bg-gray-800',
        title: 'dark:text-white',
        htmlContainer: 'dark:text-gray-300',
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
      }
    });
    return result.isConfirmed;
  };

  const notify = (title: string, icon: 'success' | 'error' | 'info') => {
    MySwal.fire({
      title,
      icon,
      timer: 1500,
      showConfirmButton: false,
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#1f2937',
      customClass: {
        popup: 'dark:bg-gray-800',
        title: 'dark:text-white',
        htmlContainer: 'dark:text-gray-300'
      }
    });
  };

  return { confirm, notify };
} 