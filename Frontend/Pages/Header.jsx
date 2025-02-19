import React, { useEffect } from "react";
import {useAuth} from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { toast , ToastContainer } from "react-toastify";
const Header = () => {
    const {isAuth,setIsAuth} = useAuth();
    const navigate = useNavigate(); 
    const handleLogout = async () => {
        try {
          localStorage.removeItem("token");
          setIsAuth(false);
          navigate("/"); 
        } catch (error) {
          toast.error("Error while logging out");
        }
      };
    
    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
        <ToastContainer/>
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