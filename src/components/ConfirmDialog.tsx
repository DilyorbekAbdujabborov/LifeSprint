import { useStore } from '../store';

export default function ConfirmDialog() {
  const { confirmDialog, hideConfirm } = useStore();
  if (!confirmDialog?.open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-[#151433] rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 dark:border-slate-800 text-left">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{confirmDialog.title}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">{confirmDialog.message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={hideConfirm}
            className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            type="button"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => {
              confirmDialog.onConfirm();
              hideConfirm();
            }}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            type="button"
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
}
