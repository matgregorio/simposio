import { BrButton, BrCard, Container, Row, Col, BrTag } from '@govbr-ds/react-components';

import { useInscreverSubevento, useSubeventos } from '../../services/api/hooks';
import { useAuth } from '../../stores/AuthContext';

export const ProgramacaoPage = () => {
  const { data: subeventos, isLoading } = useSubeventos();
  const { user } = useAuth();
  const inscrever = useInscreverSubevento();

  const handleInscricao = (id: string) => {
    if (!user) {
      window.location.href = '/entrar';
      return;
    }
    inscrever.mutate(id);
  };

  return (
    <Container className="py-4" aria-busy={isLoading} aria-live="polite">
      <h1 className="h3">Programação completa</h1>
      <p>Escolha os subeventos que deseja participar. Cada inscrição gera certificado correspondente.</p>
      <Row>
        {subeventos?.map((item) => (
          <Col sm={12} md={6} key={item._id} className="mb-3">
            <BrCard title={item.titulo} subtitle={`${item.tipo} • ${item.local}`}>
              <p>{item.descricao}</p>
              <p>
                {new Date(item.data).toLocaleDateString('pt-BR')} às {item.horario} • Vagas: {item.vagas}
              </p>
              <div className="d-flex gap-2 align-items-center">
                <BrButton type="button" onClick={() => handleInscricao(item._id)}>
                  Inscrever-se
                </BrButton>
                <BrTag>{item.palestrante}</BrTag>
              </div>
            </BrCard>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
