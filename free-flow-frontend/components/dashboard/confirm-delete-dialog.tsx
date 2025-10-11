import { Trash2, X, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteDialogProps {
    isOpen: boolean,
    onClose: () => void
    onConfirm: () => void
    element: any
}

// Confirmation Dialog Component
const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, element }: ConfirmDeleteDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Task?
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            Are you sure you want to delete this task?
          </p>
          {element?.title && (
            <p className="text-sm font-medium text-gray-900 mt-2 px-4 py-2 bg-gray-50 rounded border border-gray-200">
              "{element.title}"
            </p>
          )}
          <p className="text-xs text-red-600 mt-3">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};