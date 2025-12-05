import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <div className="w-full max-w-sm rounded-xl border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
              {/* Icon */}
              <div className="mb-3 flex justify-center">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl shadow-md',
                    variant === 'danger'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-amber-50 text-amber-600'
                  )}
                >
                  <Trash2 className="h-5 w-5" />
                </div>
              </div>

              {/* Content */}
              <div className="mb-4 text-center">
                <h3 className="mb-1 text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {description}
                </p>
                {itemName && (
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    "{itemName}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-xl border-slate-200 bg-white/70 hover:bg-white text-sm py-2"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className={cn(
                    'flex-1 rounded-xl px-4 py-2 text-sm font-semibold shadow-md',
                    variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  )}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
