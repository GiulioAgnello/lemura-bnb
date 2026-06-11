import { Cormorant_Garamond, Nunito_Sans } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingFAB from '@/components/BookingFAB';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--cormorant',
  display: 'swap',
});

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--nunito',
  display: 'swap',
});

export const metadata = {
  verification: {
    google: 'p4VW9CNbZn5IC5rpeKYZuCdJrCTHCtOjh9VuiCkcNl8',
  },
  title: {
    template: '%s | Le Mura degli Angeli',
    default: 'Le Mura degli Angeli — B&B e Dimora Antica nel Salento',
  },
  description:
    "Bed & Breakfast in un'antica dimora nel cuore del Salento, tra Sternatia e Corigliano d'Otranto. Ospitalità autentica, storia pugliese, mare e ulivi.",
  metadataBase: new URL('https://www.lemuradegliangeli.it'),
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://www.lemuradegliangeli.it',
    siteName: 'Le Mura degli Angeli',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Le Mura degli Angeli — B&B nel Salento' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${nunito.variable}`}>
      <body suppressHydrationWarning>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">{children}</main>
          <Footer />
          <BookingFAB />
        </div>
      </body>
    </html>
  );
}
