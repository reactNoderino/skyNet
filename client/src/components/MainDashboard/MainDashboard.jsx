import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} from "../../redux/slices/columnsSlice";
import Column from "../Column/Column";
import AddColumnModal from "../Modals/AddColumnModal";

function MainDashboard() {
  const dispatch = useDispatch();
  const { items: columns, isLoading } = useSelector((state) => state.columns);
  const { currentBoard } = useSelector((state) => state.boards);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (currentBoard?._id) {
      dispatch(fetchColumns(currentBoard._id));
    }
  }, [currentBoard, dispatch]);

  const handleAddColumn = (columnTitle) => {
    if (!currentBoard) return;

    dispatch(
      createColumn({
        boardId: currentBoard._id,
        columnData: { title: columnTitle },
      })
    );
    setIsAddModalOpen(false);
  };

  const handleEditColumn = (columnId, newTitle) => {
    dispatch(
      updateColumn({
        columnId,
        columnData: { title: newTitle },
      })
    );
  };

  const handleDeleteColumn = (columnId) => {
    dispatch(deleteColumn(columnId));
  };

  if (!currentBoard) {
    return (
      <div className="flex-1 bg-background p-6 flex items-center justify-center">
        <p className="text-text-secondary">Lütfen bir pano seçin</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-background p-3 md:p-4 lg:p-6">
      <div className="flex gap-3 md:gap-4 lg:gap-6 min-w-max pb-2">
        {/* Render existing columns */}
        {columns.map((column) => (
          <Column
            key={column._id}
            column={column}
            onEdit={handleEditColumn}
            onDelete={handleDeleteColumn}
          />
        ))}

        {/* Add Column Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex-shrink-0 w-64 md:w-72 h-10 md:h-12 rounded-lg bg-surface border border-border hover:border-blue-500 transition flex items-center justify-center text-text-secondary hover:text-white cursor-pointer text-sm md:text-base"
        >
          + Add Column
        </button>
      </div>

      {/* Add Column Modal */}
      {isAddModalOpen && (
        <AddColumnModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddColumn}
        />
      )}
    </div>
  );
}

export default MainDashboard;
