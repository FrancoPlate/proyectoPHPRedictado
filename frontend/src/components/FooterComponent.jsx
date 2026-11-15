export default function FooterComponent() {
  const integrantes = ["Leonardo Fernandez", "Franco Plate"];

  return (
    <footer className="footer">
      <p>Integrantes: {integrantes.join(" · ")}</p>
      <p>© {new Date().getFullYear()}</p>
    </footer>
  );
}