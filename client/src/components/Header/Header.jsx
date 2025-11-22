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
    <header className="bg-surface border-b border-border px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">TaskPro</h1>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-gray-400">{user.email || user.name}</span>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
