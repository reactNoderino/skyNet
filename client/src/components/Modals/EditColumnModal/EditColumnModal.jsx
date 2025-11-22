import React, { useState } from "react";
import styles from "./EditColumnModal.module.css";

const EditColumnModal = ({ currentTitle, onSubmit, onClose }) => {
  const [newTitle, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);

  const handleSetTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    await onSubmit(newTitle);
    setLoading(false);
    onClose();
  };

  return (
    <div className={styles.editModalWrapper} onClick={onClose}>
      <div className={styles.editModalContainer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          x
        </button>
        <div className={styles.editModalTitle}>Edit Column</div>
        <form className={styles.editModalForm} onSubmit={handleSubmit}>
          <input className={styles.editModalFormInput} type="text" value={newTitle} onChange={handleSetTitle} />
          <button className={styles.addButton} type="submit">
            <span style={{ fontSize: 18, marginRight: 8 }}>+</span>
            {loading ? "Updating..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditColumnModal;
