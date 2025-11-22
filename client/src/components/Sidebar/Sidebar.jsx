import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBoard, selectBoard } from "../../redux/slices/boardsSlice";
import * as yup from "yup";

const boardSchema = yup.object({
  title: yup.string().required("Başlık gereklidir").trim(),
});

function Sidebar() {
  const dispatch = useDispatch();
  const { items: boards, currentBoard } = useSelector((state) => state.boards);
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectBoard = (boardId) => {
    dispatch(selectBoard(boardId));
  };

  const handleAddBoard = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await boardSchema.validate({ title: boardTitle });
      dispatch(createBoard({ title: boardTitle.trim() }));
      setBoardTitle("");
      setIsAddBoardOpen(false);
    } catch (error) {
      if (error.path) {
        setErrors({ [error.path]: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="w-64 bg-surface border-r border-border p-6 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-6">Panolar</h2>

      <div className="space-y-2 mb-6">
        {boards.map((board) => (
          <button
            key={board._id}
            onClick={() => handleSelectBoard(board._id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              currentBoard?._id === board._id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {board.title}
          </button>
        ))}
      </div>

      {isAddBoardOpen ? (
        <form onSubmit={handleAddBoard} className="space-y-3">
          <input
            type="text"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            placeholder="Pano başlığı"
            className="input-field w-full"
            autoFocus
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50"
              disabled={isSubmitting}
            >
              Ekle
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddBoardOpen(false);
                setBoardTitle("");
                setErrors({});
              }}
              className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-sm"
            >
              İptal
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddBoardOpen(true)}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
        >
          + Yeni Pano
        </button>
      )}
    </aside>
  );
}

export default Sidebar;
