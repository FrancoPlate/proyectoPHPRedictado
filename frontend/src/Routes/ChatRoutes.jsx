import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function ChatRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<h1>INICIO FUNCIONANDO</h1>} />
        <Route path="/registro" element={<h1>REGISTRO</h1>} />
        <Route path="/login" element={<h1>LOGIN</h1>} />
      </Route>
    </Routes>
  );
}

export default ChatRoutes;