import React, { useState } from "react";
import * as yup from "yup";
import styles from "./AddCardModal.module.css";
import { LABELS } from "../../../config";

const PRIORITY_MAP = {
  Low: "low",
  Medium: "medium",
  High: "high",
  Without: "none",
};

const cardSchema = yup.object({
  title: yup.string().required("Title is required").trim(),
  description: yup.string().required("Description is required").trim(),
  priority: yup.string().oneOf(["Low", "Medium", "High", "Without"]).default("none"),
  deadline: yup.date().nullable().min(new Date(), "You cannot select a past date"),
});

function AddCardModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      priority: "Without",
      deadline: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = await cardSchema.validate({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        deadline: formData.deadline ? new Date(formData.deadline) : null,
      });

      onSubmit({
        title: validatedData.title.trim(),
        description: validatedData.description.trim(),
        priority: PRIORITY_MAP[validatedData.priority],
        deadline: validatedData.deadline ? validatedData.deadline.toISOString() : null,
      });

      setFormData({
        title: "",
        description: "",
        priority: "Without",
        deadline: "",
      });
    } catch (error) {
      if (error.path) {
        setErrors({ [error.path]: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={`${styles.addCardModalOverlay}`}>
      <div className={`${styles.addCardModalContainer}`}>
        <h2 className={`text-xl font-bold text-white mb-4 ${styles.addCardModalHeader}`}>Add Card</h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`${styles.addCardModalInput} ${errors.title ? "border-red-500" : ""}`}
              placeholder="Title"
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${styles.addCardModalTextArea} ${errors.description ? "border-red-500" : ""}`}
              placeholder="Description"
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Priority */}
          <div className="mb-4">
            <p className="block text-text-secondary mb-2">Label Color</p>
            <div className={styles.labelContainer}>
              {LABELS.map((label) => (
                <label key={label.name} className={styles.labelOptions}>
                  <input
                    type="radio"
                    name="label"
                    value={label.name}
                    checked={formData.priority === label.name}
                    onChange={(event) => setFormData({ ...formData, priority: event.target.value })}
                  />
                  <span style={{ background: label.color }}></span>
                </label>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div className="mb-4">
            <label className="block text-text-secondary mb-2">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              min={today}
              className="input-field"
              disabled={isSubmitting}
            />
            {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCardModal;
