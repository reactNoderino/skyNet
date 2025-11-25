import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import ProfileModal from "./ProfileModal"; // ProfileModal import edildi
import { API_BASE_URL } from "../../config";

function Navbar({ user: initialUser }) {
  // user props ile gelir
  const [user, setUser] = useState(initialUser || null);
  const [themeContent, setThemeContent] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state

  // dropdownunu aç/kapa
  const toggleThemeContent = () => {
    setThemeContent(!themeContent);
  };

  // temayı değiştir
  const changeTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    setThemeContent(false); // seçim yapıldıktan sonra dropdownu kapat
  };
  // Default temayı body'e uygula ve theme değişirse güncelle
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const auth = localStorage.getItem("taskProAuth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);

        // Kullanıcı bilgisini farklı yapıda gelse bile normalize et
        const normalizedUser =
          parsed.user ||
          parsed.userInfo ||
          parsed.userData ||
          parsed.profile ||
          null;

        setUser(normalizedUser);
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleModalClose = (updatedUser) => {
    setIsModalOpen(false);
    if (updatedUser) {
      setUser(updatedUser); // Navbar state’i güncelleniyor
    }
  };

  const avatarSrc = (() => {
    const avatarPath = user?.avatarURL;

    if (!avatarPath || avatarPath.length <= 1) {
      return "/user-profile-icon.svg";
    } // Başı / ile geliyorsa kaldır

    const normalizedPath = avatarPath.startsWith("/")
      ? avatarPath.substring(1)
      : avatarPath;
    const baseUrlWithoutApi = API_BASE_URL.replace("/api", "");
    return `${baseUrlWithoutApi}/${normalizedPath}?t=${Date.now()}`;
  })();

  return (
    <div className={styles.taskPro}>
      <div className={styles.sidebar}>{/* Sol Taraf boş sidebar */}</div>
      <nav className={styles.navbarContainer}>
        <div className={styles.navbarMenu}>
          {/* 1. Tema Seçim Bölümü */}
          <div className={styles.themeSelector}>
            <div className={styles.themeContent} onClick={toggleThemeContent}>
              <p className={styles.themeTittle}>Theme</p>
              <img src="/theme-arrow-icon.svg" />
            </div>
            {themeContent && (
              <div className={styles.themeDropdown}>
                <p
                  className={styles.themeOption}
                  onClick={() => changeTheme("light")}
                >
                  Light
                </p>
                <p
                  className={styles.themeOption}
                  onClick={() => changeTheme("dark")}
                >
                  Dark
                </p>
                <p
                  className={styles.themeOption}
                  onClick={() => changeTheme("violet")}
                >
                  Violet
                </p>
              </div>
            )}
          </div>

          {/* 2. Kullanıcı Profili Bölümü */}
          <div
            className={styles.userProfile}
            onClick={() => setIsModalOpen(true)}
          >
            <span className={styles.userName}>{user?.name || "User"}</span>     
                 {" "}
            <img
              src={avatarSrc} // **Düzeltildi: avatarURL yerine avatarSrc kullanılmalı**
              alt="User Avatar Icon"
              className={styles.userAvatar}
            />
          </div>
        </div>
      </nav>

      {/* Profile Modal */}

      {isModalOpen &&
        (user ? (
          <ProfileModal user={user} onClose={handleModalClose} />
        ) : (
          <div className={styles.modal}>Loading user...</div>
        ))}
    </div>
  );
}

export default Navbar;
