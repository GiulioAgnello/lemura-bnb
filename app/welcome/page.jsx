import WelcomeClient from '@/components/WelcomeClient';

// Pagina pubblica per gli ospiti — NON indicizzare.
export const metadata = {
  title: 'Welcome',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function WelcomePage() {
  return <WelcomeClient />;
}
