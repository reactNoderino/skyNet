import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/authSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("taskProAuth") || "{}");
      await dispatch(logoutUser(auth.refreshToken || "")).unwrap();
      localStorage.removeItem("taskProAuth");
      navigate("/welcome", { replace: true });
    } catch (error) {
      localStorage.removeItem("taskProAuth");
      navigate("/welcome", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-surface border-b border-border px-3 md:px-4 lg:px-6 py-3 md:py-4 flex justify-between items-center gap-2">
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
        TaskPro
      </h1>

      <div className="flex items-center gap-2 md:gap-4">
        {user && (
          <>
            <span className="text-gray-400 text-xs md:text-sm lg:text-base line-clamp-1">
              {user.email || user.name}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-2 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 text-xs md:text-sm lg:text-base flex-shrink-0"
            >
              <span className="hidden sm:inline">
                {isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
              </span>
              <span className="sm:hidden">{isLoading ? "..." : "Çık"}</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
