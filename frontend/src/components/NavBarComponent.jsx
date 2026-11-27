import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const baseLink =
    "px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap";

const linkClass = ({ isActive }) =>
    `${baseLink} ${
        isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

export default function NavBarComponent() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const isLoggedIn = Boolean(token);

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    return (
        <nav
            aria-label="Navegación principal"
            className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-lg"
        >
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto">

                    {!isLoggedIn ? (
                        <>
                            <NavLink to="/registro" className={linkClass}>
                                Registrarse
                            </NavLink>

                            <NavLink
                                to="/login"
                                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg transition whitespace-nowrap"
                            >
                                Iniciar sesión
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/chats" className={linkClass}>
                                💬 Mis chats
                            </NavLink>

                            <NavLink to="/editarperfil" className={linkClass}>
                                👤 Mi perfil
                            </NavLink>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="ml-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-sm font-semibold transition whitespace-nowrap"
                            >
                                 Cerrar sesión
                            </button>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
}