import { Link } from "react-router";
import { useState } from "react";

export default function NavBarComponent() {
    const [user, setUser] = useState(null);

    return (
        <nav className="navbar">
            {user === null ? (
                <>
                    <Link to="/registro">Registrarse</Link>
                    <Link to="/login">Iniciar sesión</Link>
                </>
            ) : (
                <>
                    <Link to="/mis-chats">Mis chats</Link>
                    <Link to="/home">Home</Link>
                    <Link to="/cerrarSesion">Cerrar sesión</Link>
                </>
            )}
        </nav>
    );
}