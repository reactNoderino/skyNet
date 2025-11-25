import { useState, useEffect, useMemo } from "react";
import { API_BASE_URL, AUTH_STORAGE_KEY } from "../../config";
import styles from "./ProfileModal.module.css";

const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Form reset
  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      photo: user.avatarURL || "/user-profile-icon.svg",
    });
    setPhotoFile(null);
    setErrors({});
  }, [user]);

  // Avatar URL hesaplama (sade)
  const avatarURL = useMemo(() => {
    if (photoFile) return URL.createObjectURL(photoFile);

    if (
      formData.photo &&
      formData.photo !== "/user-profile-icon.svg" &&
      formData.photo !== "user-profile-icon.svg"
    ) {
      const fileName = formData.photo.split("/").pop();
      const baseUrl = API_BASE_URL.replace("/api", "");
      return `${baseUrl}/uploads/${fileName}?t=${Date.now()}`;
    }

    return "/user-profile-icon.svg";
  }, [photoFile, formData.photo]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoFile(file);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (formData.password && formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const authData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    const token = authData?.token;
    if (!token) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.password) data.append("password", formData.password);
    if (photoFile) data.append("avatar", photoFile);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PATCH",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Update failed:", errorData);
        return;
      }

      const updatedUser = await res.json();

      // Local storage güncelle
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token: updatedUser.token,
          refreshToken: updatedUser.refreshToken,
          user: updatedUser.user,
        })
      );

      setFormData((prev) => ({
        ...prev,
        photo: updatedUser.user.avatarURL || "/user-profile-icon.svg",
      }));
      setPhotoFile(null);

      onClose(updatedUser.user);
    } catch (error) {
      console.log("Update failed:", error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Edit Profile</h3>

        <div className={styles.avatarContainer}>
          <img
            src={avatarURL}
            alt="profile"
            width={68}
            height={68}
            onClick={() => document.getElementById("photoInput").click()}
          />

          <img
            className={styles.plus}
            src="/plus.svg"
            alt="plusIcon"
            width={24}
            height={24}
          />

          <input
            type="file"
            id="photoInput"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          {errors.name && <p>{errors.name}</p>}
        </div>

        <div className={styles.inputGroup}>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email@email.com"
          />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div className={styles.inputGroup}>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password1"
          />
          {errors.password && <p>{errors.password}</p>}
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
