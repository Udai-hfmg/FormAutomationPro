import React from "react";
import { FiArchive } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";

interface Props {
  selectedCount: number;
  onArchive: () => void;
  onDelete: () => void;
  onSend: () => void;
  onClear: () => void;
}

const FloatingActionBar: React.FC<Props> = ({
  selectedCount,
  onArchive,
  onDelete,
  onSend,
  onClear,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl border rounded-xl px-6 py-3 flex items-center gap-6 z-40 transition-all animate-slideUp">
      
      <button
        onClick={onArchive}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
      >
        <FiArchive />
        Archive
      </button>

      <span className="text-gray-600">{selectedCount} selected</span>

      <button
        onClick={onDelete}
        className="flex items-center gap-2 text-red-500 hover:text-red-700"
      >
        <FiTrash2 />
        Delete
      </button>

      <div className="border-l h-6"></div>

      <button
        onClick={onSend}
        className="flex items-center gap-2 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900"
      >
        <IoIosSend />
        Send
      </button>

      <button
        onClick={onClear}
        className="ml-2 text-gray-500 hover:text-black"
      >
        ✕
      </button>
    </div>
  );
};

export default FloatingActionBar;