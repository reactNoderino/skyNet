import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoards } from "../../redux/slices/boardsSlice";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import MainDashboard from "../../components/MainDashboard/MainDashboard";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: boards } = useSelector((state) => state.boards);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/welcome", { replace: true });
      return;
    }
    dispatch(fetchBoards());
  }, [isAuthenticated, dispatch, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header - fixed at top */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile, visible on md+ */}
        <div className="hidden md:block md:w-56 lg:w-64">
          <Sidebar />
        </div>

        {/* Main Content - scrollable */}
        <MainDashboard />
      </div>
    </div>
  );
}

export default HomePage;
