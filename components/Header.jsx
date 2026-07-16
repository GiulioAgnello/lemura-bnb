'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getBrandForPath } from '@/lib/brands';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Strutture', href: '/strutture' },
  { label: 'Spa', href: '/spa' },
  { label: 'Galleria', href: '/galleria' },
  { label: 'Esperienze', href: '/esperienze' },
  { label: 'Recensioni', href: '/recensioni' },
  { label: 'Contatti', href: '/contatti' },
];

export default function Header() {
  const pathname = usePathname();
  const brand = getBrandForPath(pathname);
  const isAgenda = pathname.startsWith('/agenda');
  const isWelcome = pathname.startsWith('/welcome');

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  // Pagina ospiti /welcome: l'header del sito non compare
  // (la pagina ha una sua barra compatta con logo + Benvenuti + lingua).
  if (isWelcome) return null;

  // Header ridotto per la pagina gestionale /agenda:
  // nessuna voce di menu, solo il logo e la scritta "Agenda arrivi".
  if (isAgenda) {
    return (
      <nav className="navbar navbar-bnb sticky-top">
        <div className="container d-flex align-items-center justify-content-between">
          <Link className="navbar-brand navbar-brand-bnb" href="/agenda">
            <img className="logoFace" src={brand.logo} alt={brand.name} key={brand.logo} />
            {brand.name}
          </Link>
          <span className="navbar-text fw-semibold text-uppercase" style={{ letterSpacing: '0.06em' }}>
            Agenda arrivi
          </span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-bnb sticky-top">
      <div className="container">
        <Link className="navbar-brand navbar-brand-bnb" href="/">
          <img className="logoFace" src={brand.logo} alt={brand.name} key={brand.logo} />
          {brand.name}
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Apri menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="mainNav">
          <ul className="navbar-nav align-items-center gap-0">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <li className="nav-item" key={item.href}>
                  <Link
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
