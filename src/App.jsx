import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookingFAB from "./components/BookingFAB";
import Homepage from "./pages/Homepage";
import Strutture from "./pages/Strutture";
import StrutturaDetail from "./pages/StrutturaDetail";
import CameraDetail from "./pages/CameraDetail";
import Spa from "./pages/Spa";
import Galleria from "./pages/Galleria";
import Esperienze from "./pages/Esperienze";
import Recensioni from "./pages/Recensioni";
import Contatti from "./pages/Contatti";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
      <BookingFAB />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/strutture" element={<Strutture />} />
          <Route path="/strutture/:slug" element={<StrutturaDetail />} />
          <Route path="/camere/:slug" element={<CameraDetail />} />
          <Route path="/spa" element={<Spa />} />
          <Route path="/galleria" element={<Galleria />} />
          <Route path="/esperienze" element={<Esperienze />} />
          <Route path="/recensioni" element={<Recensioni />} />
          <Route path="/contatti" element={<Contatti />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
