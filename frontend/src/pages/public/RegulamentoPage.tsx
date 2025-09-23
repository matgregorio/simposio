import DOMPurify from 'dompurify';
import { useMemo } from 'react';

import { Container } from '@govbr-ds/react-components';

import { useConteudo } from '../../services/api/hooks';

export const RegulamentoPage = () => {
  const { data } = useConteudo('regulamento');

  const html = useMemo(() => {
    if (!data?.htmlSanitizado) return '<p>Conteúdo em atualização.</p>';
    return DOMPurify.sanitize(data.htmlSanitizado, {
      ALLOWED_TAGS: ['p', 'b', 'i', 'u', 'em', 'strong', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }, [data]);

  return (
    <Container className="py-4">
      <h1 className="h3">Regulamento e normas</h1>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </Container>
  );
};
