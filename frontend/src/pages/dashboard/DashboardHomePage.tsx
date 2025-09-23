import { BrCard, Container, Row, Col } from '@govbr-ds/react-components';

import { useAuth } from '../../stores/AuthContext';
import { useAcervo, useSubeventos } from '../../services/api/hooks';

export const DashboardHomePage = () => {
  const { user } = useAuth();
  const { data: subeventos } = useSubeventos();
  const { data: acervo } = useAcervo();

  return (
    <Container className="py-3">
      <h1 className="h4">Olá, {user?.nome}</h1>
      <p>Este painel apresenta indicadores e atalhos para gerenciar o simpósio acadêmico.</p>
      <Row>
        <Col sm={12} md={4} className="mb-3">
          <BrCard title="Subeventos publicados" subtitle={`${subeventos?.length ?? 0} atividades`} />
        </Col>
        <Col sm={12} md={4} className="mb-3">
          <BrCard title="Anais disponíveis" subtitle={`${acervo?.length ?? 0} trabalhos`} />
        </Col>
        <Col sm={12} md={4} className="mb-3">
          <BrCard title="Status LGPD" subtitle="Consentimentos e exportação disponíveis" />
        </Col>
      </Row>
    </Container>
  );
};
