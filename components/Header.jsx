'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-bnb sticky-top">
      <div className="container">
        <Link className="navbar-brand navbar-brand-bnb" href="/">
          <img className="logoFace" src="/logo_no_background.png" alt="Le Mura degli Angeli" />
          Le Mura degli Angeli
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
