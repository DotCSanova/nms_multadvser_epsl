import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
      <header>Navbar aquí</header>
      <main>
        <Outlet /> {/* Renderiza las rutas dentro de este layout */}
      </main>
      <footer>Footer aquí</footer>
    </div>
  );
};

export default App;

