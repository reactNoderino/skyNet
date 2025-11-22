import React, { useState } from "react";
import * as yup from "yup";

const columnSchema = yup.object({
  title: yup.string().required("Başlık gereklidir").trim(),
});

function AddColumnModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await columnSchema.validate({ title });
      onSubmit(title.trim());
      setTitle("");
    } catch (error) {
      if (error.path) {
        setErrors({ [error.path]: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-96 border border-border">
        <h2 className="text-xl font-bold text-white mb-4">Yeni Kolon Ekle</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-secondary mb-2">
              Kolon Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`input-field ${errors.title ? "border-red-500" : ""}`}
              placeholder="Başlık girin"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
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
              {isSubmitting ? "Ekleniyor..." : "Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddColumnModal;
