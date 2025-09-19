import { BrCard, Container } from '@govbr-ds/react-components';

import { useAcervo } from '../../services/api/hooks';

export const AnaisPage = () => {
  const { data: acervo, isLoading } = useAcervo();

  return (
    <Container className="py-4" aria-busy={isLoading} aria-live="polite">
      <h1 className="h3">Anais do evento</h1>
      <p>Pesquise por ano, autor ou palavra-chave. Os PDFs são assinados digitalmente e verificados por hash.</p>
      <div className="d-grid gap-3">
        {acervo?.map((item) => (
          <BrCard key={item._id} title={`${item.titulo} (${item.ano})`} subtitle={item.autores.join(', ')}>
            <p>Palavras-chave: {item.palavrasChave.join(', ')}</p>
            <a className="br-button" href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
              Baixar PDF
            </a>
          </BrCard>
        ))}
      </div>
    </Container>
  );
};
