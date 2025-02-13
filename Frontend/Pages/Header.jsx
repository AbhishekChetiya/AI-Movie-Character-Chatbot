import React, { useEffect } from "react";
import {useAuth} from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Header = () => {
    const {isAuth,setIsAuth} = useAuth();
    const navigate = useNavigate(); 
    const handleLogout = async () => {
        try {
          await api.post("/logout", {}, { withCredentials: true });
          setIsAuth(false);
          navigate("/"); 
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };
    
    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-blue-600">Logo</div>
  
        {isAuth && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-semibold"
          >
            Logout
          </button>
        )}
      </nav>
    );
};

export default Header;