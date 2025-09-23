import { BrButton, BrCard, Container } from '@govbr-ds/react-components';

import api from '../../services/api/client';
import { useSubmissions } from '../../services/api/hooks';
import { useAuth } from '../../stores/AuthContext';

export const SubmissoesPage = () => {
  const { data: submissions, isLoading, refetch } = useSubmissions();
  const { user } = useAuth();

  const atualizarStatus = async (id: string, status: string) => {
    await api.post(`/submissions/${id}/status`, { status });
    refetch();
  };

  return (
    <Container className="py-3" aria-busy={isLoading}>
      <h1 className="h4">Gestão de submissões</h1>
      <p>Visualize o status, atribua avaliadores e acompanhe médias finais.</p>
      <div className="d-grid gap-3">
        {submissions?.map((submission) => {
          const autorNome =
            typeof submission.autorId === 'string' ? submission.autorId : submission.autorId?.nome ?? '';

          return (
            <BrCard
              key={submission._id}
              title={submission.titulo}
              subtitle={`Status: ${submission.status} • Autor: ${autorNome}`}
            >
              <p dangerouslySetInnerHTML={{ __html: submission.resumoHTML }} />
              <p>
                Tipo: {submission.tipoTrabalho} • Apresentação: {submission.tipoApresentacao} • Palavras-chave:{' '}
                {submission.palavrasChave?.join(', ')}
              </p>
              {user?.role !== 'user' && (
                <div className="d-flex gap-2">
                  <BrButton type="button" secondary onClick={() => atualizarStatus(submission._id, 'Em Avaliação')}>
                    Marcar em avaliação
                  </BrButton>
                  <BrButton type="button" onClick={() => atualizarStatus(submission._id, 'Aprovado')}>
                    Aprovar
                  </BrButton>
                  <BrButton type="button" inverted onClick={() => atualizarStatus(submission._id, 'Reprovado')}>
                    Reprovar
                  </BrButton>
                </div>
              )}
            </BrCard>
          );
        })}
      </div>
    </Container>
  );
};
