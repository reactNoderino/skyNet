import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCards, createCard } from "../../redux/slices/cardsSlice";
import Card from "../Card/Card";
import AddCardModal from "../Modals/AddCardModal/AddCardModal.jsx";
import { selectCardsByColumn } from "../../redux/selectors/columnsSelectors.js";
import EditColumnModal from "../Modals/EditColumnModal/EditColumnModal.jsx";
import { updateColumn } from "../../redux/slices/columnsSlice.js";

function Column({ column, onEdit, onDelete }) {
  const dispatch = useDispatch();
  const selectCards = selectCardsByColumn();
  const cards = useSelector((state) => selectCards(state, column._id));

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditColumnOpen, setIsEditColumnOpen] = useState(false);

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

  const handleEditColumnTitle = (newTitle) => {
    newTitle = newTitle.trim();

    if (!newTitle || newTitle === column.title) {
      setIsEditColumnOpen(false);
      return;
    }

    onEdit(column._id, newTitle);
    setIsEditColumnOpen(false);
  };

  return (
    <div className="flex-shrink-0 w-64 md:w-72 lg:w-80 bg-surface rounded-lg border border-border flex flex-col h-full">
      {/* Column Header */}
      <div className="p-3 md:p-4 border-b border-border flex justify-between items-center gap-2">
        {isEditColumnOpen && (
          <EditColumnModal
            currentTitle={column.title}
            onSubmit={handleEditColumnTitle}
            onClose={() => setIsEditColumnOpen(false)}
          />
        )}

        <h3 className="text-base md:text-lg font-semibold text-white line-clamp-1">{column.title}</h3>

        <div className="flex gap-1 md:gap-2 flex-shrink-0">
          <button
            onClick={() => setIsEditColumnOpen(true)}
            className="text-gray-400 hover:text-white p-1 text-sm md:text-base"
            title="Düzenle"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(column._id)}
            className="text-gray-400 hover:text-red-500 p-1 text-sm md:text-base"
            title="Sil"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Cards Container - with scrolling */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
        {cards.length > 0 ? (
          cards.map((card) => <Card key={card._id} card={card} columnId={column._id} />)
        ) : (
          <p className="text-text-secondary text-xs md:text-sm text-center py-8">Kart yok</p>
        )}
      </div>

      {/* Add Card Button - sticky at bottom */}
      <div className="p-3 md:p-4 border-t border-border flex-shrink-0">
        <button
          onClick={() => setIsAddCardModalOpen(true)}
          className="w-full px-3 md:px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-xs md:text-sm font-medium"
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
