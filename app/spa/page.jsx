export const metadata = {
  title: 'Spa & Wellness — B&B Le Mura degli Angeli Salento',
  description: 'La nostra spa nelle cantine dell\'antica dimora di Corigliano d\'Otranto. Trattamenti benessere nel Salento. Prossimamente disponibile.',
};

export default function Spa() {
  return (
    <div className="section-padding text-center">
      <div className="container">
        <span className="section-label">Benessere</span>
        <h1 className="section-title">Spa & Wellness</h1>
        <hr className="section-divider section-divider-center" />
        <p style={{ maxWidth: 500, margin: '0 auto' }}>
          La nostra spa nelle cantine dell'antica dimora di Corigliano d'Otranto sta per aprire. Presto disponibile per i nostri ospiti.
        </p>
      </div>
    </div>
  );
}
