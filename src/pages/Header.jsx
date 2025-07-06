// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { getAuth } from "../utils/auth";

const Header = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const { user } = getAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setAuthUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center mb-4">
      <h1
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Submify
      </h1>
      <nav className="space-x-4">
        {user?.roles?.some(role => role.roleType === 'ADMIN') ? (
          // Admin Navigation
          <>
            <button
              onClick={() => navigate("/admin")}
              className="text-gray-700 hover:text-blue-600"
            >
              Admin Dashboard
            </button>
          </>
        ) : (
          // Regular User Navigation
          <>
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/add-course")}
              className="text-gray-700 hover:text-blue-600"
            >
              Add Course
            </button>
          </>
        )}
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
