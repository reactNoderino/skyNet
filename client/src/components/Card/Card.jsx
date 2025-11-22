import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCard, moveCard } from "../../redux/slices/cardsSlice";
import { PRIORITY_COLORS } from "../../config";
import MoveCardTooltip from "./MoveCardTooltip";
import EditCardModal from "../Modals/EditCardModal";

function Card({ card, columnId }) {
  const dispatch = useDispatch();
  const [showMoveTooltip, setShowMoveTooltip] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isDeadlineToday = () => {
    if (!card.deadline) return false;
    const today = new Date();
    const deadline = new Date(card.deadline);
    return deadline.toDateString() === today.toDateString();
  };

  const handleDelete = () => {
    if (window.confirm("Bu kartı silmek istediğinize emin misiniz?")) {
      dispatch(deleteCard(card._id));
    }
  };

  const handleMoveCard = (newColumnId) => {
    dispatch(
      moveCard({
        cardId: card._id,
        newColumnId,
      })
    );
    setShowMoveTooltip(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR");
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition">
        {/* Title */}
        <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2">
          {card.title}
        </h4>

        {/* Description */}
        <p className="text-text-secondary text-xs mb-3 line-clamp-3">
          {card.description}
        </p>

        {/* Priority & Deadline */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  PRIORITY_COLORS[card.priority] || PRIORITY_COLORS.none,
              }}
            />
            <span className="text-gray-400">
              {card.priority === "none"
                ? "Önceliksiz"
                : card.priority === "low"
                ? "Düşük"
                : card.priority === "medium"
                ? "Orta"
                : "Yüksek"}
            </span>
          </div>
          {card.deadline && (
            <span className="text-gray-400">{formatDate(card.deadline)}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Move Button */}
          <button
            onClick={() => setShowMoveTooltip(!showMoveTooltip)}
            className="flex-1 p-2 rounded hover:bg-gray-700 transition text-gray-400 hover:text-white relative"
            title="Kolona taşı"
          >
            ⇄
            {showMoveTooltip && (
              <MoveCardTooltip
                cardId={card._id}
                currentColumnId={columnId}
                onMove={handleMoveCard}
                onClose={() => setShowMoveTooltip(false)}
              />
            )}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 p-2 rounded hover:bg-gray-700 transition text-gray-400 hover:text-white"
            title="Düzenle"
          >
            ✎
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="flex-1 p-2 rounded hover:bg-gray-700 transition text-gray-400 hover:text-red-500"
            title="Sil"
          >
            ✕
          </button>

          {/* Bell Button (if deadline is today) */}
          {isDeadlineToday() && (
            <button
              className="flex-1 p-2 rounded bg-yellow-600 hover:bg-yellow-700 transition text-white"
              title="Bugün son tarih"
            >
              🔔
            </button>
          )}
        </div>
      </div>

      {/* Edit Card Modal */}
      {isEditModalOpen && (
        <EditCardModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          card={card}
        />
      )}
    </>
  );
}

export default Card;
