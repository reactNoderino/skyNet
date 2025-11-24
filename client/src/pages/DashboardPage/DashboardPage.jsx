import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/DashboardForm/Sidebar";
import NewBoardModal from "../../components/DashboardForm/NewBoardModal";
import DeleteModal from "../../components/DashboardForm/DeleteModal";
import AddColumnModal from "../../components/Modals/AddColumnModal/AddColumnModal";
import Column from "../../components/Column/Column.jsx";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  selectBoard,
} from "../../redux/slices/boardsSlice";
import {
  createColumn,
  deleteColumn,
  fetchColumns,
  updateColumn,
} from "../../redux/slices/columnsSlice.js";
import {
  AUTH_STORAGE_KEY,
  CLOUDINARY_BASE_URL,
  API_BASE_URL,
} from "../../config";
import styles from "./DashboardPage.module.css";
import HomePage from "../HomePage/HomePage.jsx";
import Navbar from "../../components/Header/Navbar.jsx";

function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 💡 Board ve Kolon verileri Redux'tan çekildi
  const {
    items: userBoards,
    currentBoard,
    isLoading: loadingBoards,
  } = useSelector((state) => state.boards);
  const { items: columnsData, isLoading: loadingColumns } = useSelector(
    (state) => state.columns
  );

  // 💡 isDeleteModalToOpen tutarlılığı sağlandı.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalToOpen, setIsDeleteModalToOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState(null);
  const [boardToDeleteId, setBoardToDeleteId] = useState(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  // 💡 currentBoard değiştiğinde Kolonları Redux'a yükle
  useEffect(() => {
    if (!currentBoard) return;

    const fetchAllColumns = () => {
      dispatch(fetchColumns(currentBoard._id));
    };

    fetchAllColumns();
  }, [currentBoard, dispatch]);

  // ------------------ Helpers ------------------
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleActiveBoardChange = (id) => {
    dispatch(selectBoard(id));
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    navigate("/welcome", { replace: true });
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setBoardToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditBoard = (id) => {
    const board = userBoards.find((b) => b._id === id);
    if (board) {
      setBoardToEdit(board);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const openDeleteModal = (id) => {
    setBoardToDeleteId(id);
    setIsDeleteModalToOpen(true);
  };

  const handleBoardCreated = (newBoard) => {
    dispatch(createBoard(newBoard));
    setIsModalOpen(false);
  };

  const handleBoardUpdated = (updatedBoard) => {
    dispatch(
      updateBoard({ boardId: updatedBoard._id, boardData: updatedBoard })
    );
    setIsModalOpen(false);
  };

  const confirmDeleteBoard = () => {
    if (!boardToDeleteId) return;
    dispatch(deleteBoard(boardToDeleteId));
    setIsDeleteModalToOpen(false);
  };

  const handleToggleFavorite = (id, status) => {
    const newStatus = !status;
    dispatch(
      updateBoard({ boardId: id, boardData: { isFavorite: newStatus } })
    );
  };

  // Add Column submit handler
  const handleAddColumn = (title) => {
    console.log("Current Board ID:", currentBoard._id, "Title:", title);
    if (!currentBoard) return;

    dispatch(
      createColumn({
        boardId: currentBoard._id,
        columnData: { title },
      })
    );
    // Yerel state güncellemesi (setColumns) kaldırıldı.
    setIsAddColumnModalOpen(false);
  };

  const handleEditColumn = (columnId, newTitle) => {
    dispatch(
      updateColumn({
        columnId,
        columnData: { title: newTitle },
      })
    );
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await dispatch(deleteColumn(columnId)).unwrap();
      // Yerel state güncellemesi (setColumns) kaldırıldı.
    } catch (err) {
      console.error("Kolon silinirken hata:", err);
    }
  };

  // ------------------ Background ------------------
  let bgImage = null;
  if (
    currentBoard &&
    currentBoard.background &&
    currentBoard.background !== "default"
  ) {
    const bgId = currentBoard.background;
    if (bgId.startsWith("custom_")) {
      bgImage = `url(${CLOUDINARY_BASE_URL}/q_auto,f_auto/${bgId})`;
    } else {
      const safeBgId = bgId.endsWith(".jpg") ? bgId : `${bgId}.jpg`;
      bgImage = `url(${CLOUDINARY_BASE_URL}/w_1920,q_auto,f_auto/${safeBgId})`;
    }
  }

  // ------------------ Render ------------------
  return (
    <>
      <Navbar />
      <div className={styles.dashboardLayout}>
        {/* Sidebar */}
        <Sidebar
          boards={userBoards}
          onCreateNewBoard={openCreateModal}
          isLoading={loadingBoards}
          onDeleteBoard={openDeleteModal}
          onEditBoard={handleEditBoard}
          onToggleFavorite={handleToggleFavorite}
          onLogout={handleLogout}
          activeBoardId={currentBoard?._id}
          onActiveBoardChange={handleActiveBoardChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main
          className={styles.mainContent}
          style={{
            backgroundImage: bgImage,
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            backgroundColor: bgImage ? "transparent" : "#f4f7f6",
          }}
        >
          <header className={styles.mainHeader}>
            <button className={styles.menuButton} onClick={toggleSidebar}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={bgImage ? "#fff" : "#121212"}
                strokeWidth="2"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <h1
              style={{
                color: bgImage ? "#fff" : "#121212",
                textShadow: bgImage ? "0 1px 4px rgba(0,0,0,0.8)" : "none",
              }}
            >
              {currentBoard ? currentBoard.title : "Dashboard"}
            </h1>
          </header>

          {/* Columns */}
          {currentBoard ? (
            <div className={styles.boardColumnsContainer}>
              {/* 💡 Yükleniyor Durumu */}
              {loadingColumns ? (
                <p
                  style={{
                    padding: "20px",
                    color: bgImage ? "#fff" : "#121212",
                  }}
                >
                  Kolonlar Yükleniyor...
                </p>
              ) : (
                // 💡 Kolonlar Redux'tan alınan columnsData üzerinden render ediliyor
                columnsData?.map(
                  (col) =>
                    col && (
                      <Column
                        key={col._id}
                        column={col}
                        onEdit={handleEditColumn}
                        onDelete={() => handleDeleteColumn(col._id)}
                      />
                    )
                )
              )}

              {/* Add Column Button */}
              <button
                style={{
                  minWidth: "335px",
                  height: "56px",
                  background: "#ffffff",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                  color: "#121212",
                  flexShrink: 0,
                }}
                onClick={() => setIsAddColumnModalOpen(true)}
                disabled={loadingColumns} // Yüklenirken butonu devre dışı bırak
              >
                <span
                  style={{
                    background: "#121212",
                    color: "#fff",
                    borderRadius: "4px",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </span>
                Add another column
              </button>

              {/* Add Column Modal */}
              {isAddColumnModalOpen && (
                <AddColumnModal
                  isOpen={isAddColumnModalOpen}
                  onClose={() => setIsAddColumnModalOpen(false)}
                  onSubmit={handleAddColumn}
                />
              )}
            </div>
          ) : (
            <div style={{ padding: "20px", color: bgImage ? "#fff" : "#000" }}>
              Lütfen soldaki menüden bir board seçin veya yeni bir tane
              oluşturun.
            </div>
          )}
        </main>

        {/* Modals */}
        {isModalOpen && (
          <NewBoardModal
            onClose={() => setIsModalOpen(false)}
            isEditMode={isEditMode}
            initialData={boardToEdit}
            onBoardCreated={handleBoardCreated}
            onBoardUpdated={handleBoardUpdated}
          />
        )}

        {isDeleteModalToOpen && (
          <DeleteModal
            isOpen={isDeleteModalToOpen}
            onClose={() => setIsDeleteModalToOpen(false)}
            onConfirm={confirmDeleteBoard}
            title="Delete board"
          />
        )}
      </div>
    </>
  );
}

export default DashboardPage;
