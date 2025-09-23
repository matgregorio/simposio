import { BrButton, BrCard, Container, Row, Col } from '@govbr-ds/react-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useSubeventos } from '../../services/api/hooks';

export const HomePage = () => {
  const { t } = useTranslation();
  const { data: subeventos } = useSubeventos();

  const destaque = subeventos?.slice(0, 3) ?? [];

  return (
    <Container className="py-4">
      <header className="mb-4" aria-labelledby="titulo-home">
        <h1 id="titulo-home" className="h3">
          {t('welcome')}
        </h1>
        <p>Conheça o evento, inscreva-se nas atividades e acompanhe as submissões.</p>
        <div className="d-flex gap-2">
          <BrButton type="button" onClick={() => (window.location.href = '/entrar')}>
            Acessar área do participante
          </BrButton>
          <BrButton type="button" secondary onClick={() => (window.location.href = '/programacao')}>
            Ver programação completa
          </BrButton>
        </div>
      </header>

      <section aria-labelledby="destaques">
        <h2 id="destaques" className="h4">
          Destaques da programação
        </h2>
        <Row>
          {destaque.map((subevento) => (
            <Col sm={12} md={4} key={subevento._id} className="mb-3">
              <BrCard
                title={subevento.titulo}
                subtitle={`${new Date(subevento.data).toLocaleDateString('pt-BR')} • ${subevento.tipo}`}
                text={subevento.descricao}
              >
                <Link to="/programacao" className="br-button">
                  Detalhes
                </Link>
              </BrCard>
            </Col>
          ))}
        </Row>
      </section>

      <section className="mt-5" aria-labelledby="lgpd-acessibilidade">
        <h2 id="lgpd-acessibilidade" className="h4">
          Governança de Dados e Acessibilidade
        </h2>
        <p>
          O sistema foi projetado com foco em segurança, privacidade (LGPD) e experiência inclusiva. Os
          dados são criptografados, há registro de consentimentos e todos os fluxos respeitam as diretrizes
          WCAG 2.1.
        </p>
        <ul>
          <li>Autenticação segura com MFA opcional e cookies HttpOnly.</li>
          <li>Exportação de dados do titular em poucos cliques.</li>
          <li>Componentes GovBR responsivos e com suporte a leitores de tela.</li>
        </ul>
      </section>
    </Container>
  );
};
