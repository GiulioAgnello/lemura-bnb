import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import Camere from "./pages/Camere";
import CameraDetail from "./pages/CameraDetail";
import Galleria from "./pages/Galleria";
import Esperienze from "./pages/Esperienze";
import Recensioni from "./pages/Recensioni";
import Contatti from "./pages/Contatti";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/camere" element={<Camere />} />
          <Route path="/camere/:slug" element={<CameraDetail />} />
          <Route path="/galleria" element={<Galleria />} />
          <Route path="/esperienze" element={<Esperienze />} />
          <Route path="/recensioni" element={<Recensioni />} />
          <Route path="/contatti" element={<Contatti />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
