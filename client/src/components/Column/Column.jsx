import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCards, createCard } from "../../redux/slices/cardsSlice";
import Card from "../Card/Card";
import AddCardModal from "../Modals/AddCardModal";

function Column({ column, onEdit, onDelete }) {
  const dispatch = useDispatch();
  const cards = useSelector(
    (state) => state.cards.itemsByColumn[column._id] || []
  );
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditColumnOpen, setIsEditColumnOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  useEffect(() => {
    dispatch(fetchCards(column._id));
  }, [column._id, dispatch]);

  const handleAddCard = (cardData) => {
    dispatch(
      createCard({
        columnId: column._id,
        cardData,
      })
    );
    setIsAddCardModalOpen(false);
  };

  const handleEditColumnTitle = () => {
    if (editTitle.trim() !== column.title) {
      onEdit(column._id, editTitle.trim());
    }
    setIsEditColumnOpen(false);
  };

  return (
    <div className="flex-shrink-0 w-80 bg-surface rounded-lg border border-border flex flex-col">
      {/* Column Header */}
      <div className="p-4 border-b border-border flex justify-between items-center">
        {isEditColumnOpen ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEditColumnTitle}
            autoFocus
            className="input-field text-sm flex-1"
          />
        ) : (
          <h3 className="text-lg font-semibold text-white">{column.title}</h3>
        )}

        <div className="flex gap-2 ml-2">
          <button
            onClick={() => setIsEditColumnOpen(true)}
            className="text-gray-400 hover:text-white p-1"
            title="Düzenle"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(column._id)}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Sil"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Cards Container - with scrolling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cards.length > 0 ? (
          cards.map((card) => (
            <Card key={card._id} card={card} columnId={column._id} />
          ))
        ) : (
          <p className="text-text-secondary text-sm text-center py-8">
            Kart yok
          </p>
        )}
      </div>

      {/* Add Card Button - sticky at bottom */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setIsAddCardModalOpen(true)}
          className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
        >
          + Add another card
        </button>
      </div>

      {/* Add Card Modal */}
      {isAddCardModalOpen && (
        <AddCardModal
          isOpen={isAddCardModalOpen}
          onClose={() => setIsAddCardModalOpen(false)}
          onSubmit={handleAddCard}
        />
      )}
    </div>
  );
}

export default Column;
