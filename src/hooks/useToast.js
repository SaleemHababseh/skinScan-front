import { useContext } from 'react';
import { ToastContext } from '../store/toast-store';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
