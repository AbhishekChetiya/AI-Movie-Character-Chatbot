import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider =   ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = localStorage.getItem("token");  
        if (response) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
