import React, { useState } from "react";
import * as yup from "yup";
import { PRIORITY_COLORS } from "../../config";

const cardSchema = yup.object({
  title: yup.string().required("Başlık gereklidir").trim(),
  description: yup.string().required("Açıklama gereklidir").trim(),
  priority: yup
    .string()
    .oneOf(["none", "low", "medium", "high"])
    .default("none"),
  deadline: yup.date().nullable().min(new Date(), "Geçmiş tarihi seçemezsiniz"),
});

function AddCardModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      priority: "none",
      deadline: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        priority: validatedData.priority,
        deadline: validatedData.deadline
          ? validatedData.deadline.toISOString()
          : null,
      });

      setFormData({
        title: "",
        description: "",
        priority: "none",
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-96 border border-border max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Yeni Kart Ekle</h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-text-secondary mb-2">Başlık *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`input-field ${errors.title ? "border-red-500" : ""}`}
              placeholder="Başlık girin"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-text-secondary mb-2">Açıklama *</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`input-field resize-none h-24 ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Açıklama girin"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="block text-text-secondary mb-2">Öncelik</label>
            <div className="space-y-2">
              {["none", "low", "medium", "high"].map((priority) => (
                <label
                  key={priority}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="w-4 h-4"
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLORS[priority] }}
                  />
                  <span className="text-white text-sm capitalize">
                    {priority === "none"
                      ? "Önceliksiz"
                      : priority === "low"
                      ? "Düşük"
                      : priority === "medium"
                      ? "Orta"
                      : "Yüksek"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div className="mb-4">
            <label className="block text-text-secondary mb-2">
              Son Teslim Tarihi
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              min={today}
              className="input-field"
              disabled={isSubmitting}
            />
            {errors.deadline && (
              <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
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

export default AddCardModal;
