import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage";
import EditUserPage from "../pages/EditUserPage";
import { MostrarChats } from "../components/mostrar";

function ChatRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        <Route
          path="/editarperfil"
          element={<EditUserPage>Editar usuario</EditUserPage>}
        />

        <Route path="/" element={<h1>INICIO FUNCIONANDO</h1>} />

        <Route path="/registro" element={<h1>REGISTRO</h1>} />

        <Route path="/chats" element={<MostrarChats />} />
      </Route>
    </Routes>
  );
}

export default ChatRoutes;