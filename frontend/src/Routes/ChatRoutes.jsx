import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage";

function ChatRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage></LoginPage>} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<h1>INICIO FUNCIONANDO</h1>} />
        <Route path="/registro" element={<h1>REGISTRO</h1>} />
      </Route>
    </Routes>
  );
}

export default ChatRoutes;