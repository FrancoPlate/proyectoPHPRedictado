export default function FooterComponent() {
  const integrantes = ["Leonardo Fernandez", "Franco Plate"];

  return (
    <footer className="w-full text-center text-slate-400 py-2 border-t border-slate-800">
      <p>Integrantes: {integrantes.join(" · ")}</p>
      <p>© {new Date().getFullYear()}</p>
    </footer>
  );
}