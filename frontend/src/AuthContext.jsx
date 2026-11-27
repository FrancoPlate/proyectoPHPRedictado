
import { createContext, useContext, useState } from "react";
import { CerrarSesion } from "./service/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    // INICIAR SESIÓN
    const login = (nuevoToken) => {
        localStorage.setItem("token", nuevoToken);
        setToken(nuevoToken);
    };

    // CERRAR SESIÓN
    const logout = async () => {
        try {
            await CerrarSesion();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            localStorage.removeItem("token");
            setToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
