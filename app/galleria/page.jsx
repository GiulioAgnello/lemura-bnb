import { getGalleryImages } from '@/lib/wordpress';
import GalleriaClient from '@/components/GalleriaClient';

export const revalidate = 3600;

export const metadata = {
  title: 'Galleria Fotografica — Dimora Storica nel Salento',
  description:
    'Scopri Le Mura degli Angeli attraverso le nostre foto: camere con volte a stella, cortile con ulivi, la spa e i paesaggi del Salento. B&B a Corigliano d\'Otranto.',
  openGraph: {
    title: 'Galleria | Le Mura degli Angeli B&B Salento',
  },
};

const PLACEHOLDER_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', alt: 'Esterno dimora' },
  { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80', alt: 'Giardino con ulivi' },
  { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', alt: 'Camera con volta a stella' },
  { url: 'https://images.unsplash.com/photo-1590490360182-c33d3bbe7bba?w=600&q=80', alt: 'Terrazza nel Salento' },
  { url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80', alt: 'Dettaglio pietra leccese' },
  { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', alt: 'Area relax' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', alt: 'Vista panoramica' },
  { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80', alt: 'Colazione salentina' },
  { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80', alt: 'Ingresso dimora storica' },
];

export default async function Galleria() {
  const imagesWP = await getGalleryImages();
  const images = imagesWP?.length > 0 ? imagesWP : PLACEHOLDER_IMAGES;

  return (
    <>
      <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Galleria</span>
          <h1 className="section-title">Scopri i nostri spazi</h1>
          <hr className="section-divider section-divider-center" />
          <p style={{ maxWidth: 600, margin: '0 auto' }}>
            Le immagini della struttura, delle camere, del giardino e dei dintorni nel Salento.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <GalleriaClient images={images} />
        </div>
      </section>
    </>
  );
}
