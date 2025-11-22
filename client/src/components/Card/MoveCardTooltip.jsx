import React from "react";
import { useSelector } from "react-redux";

function MoveCardTooltip({ cardId, currentColumnId, onMove, onClose }) {
  const columns = useSelector((state) => state.columns.items);

  // Filter out current column
  const availableColumns = columns.filter((col) => col._id !== currentColumnId);

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-gray-700 rounded-lg p-2 w-32 z-10 shadow-lg">
      {availableColumns.length > 0 ? (
        availableColumns.map((column) => (
          <button
            key={column._id}
            onClick={() => onMove(column._id)}
            className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition"
          >
            {column.title}
          </button>
        ))
      ) : (
        <p className="px-3 py-2 text-xs text-gray-400">Başka kolon yok</p>
      )}
    </div>
  );
}

export default MoveCardTooltip;
