import DOMPurify from 'dompurify';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { BrButton, BrMessage, Container } from '@govbr-ds/react-components';

import api from '../../services/api/client';
import { useConteudo } from '../../services/api/hooks';

const schema = z.object({ html: z.string().min(10, 'Informe o conteúdo do regulamento.') });

type FormData = z.infer<typeof schema>;

export const ConteudosPage = () => {
  const { data, refetch } = useConteudo('regulamento');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data?.htmlSanitizado) {
      setValue('html', data.htmlSanitizado);
    }
  }, [data, setValue]);

  const preview = DOMPurify.sanitize(watch('html') ?? '');

  const onSubmit = async (values: FormData) => {
    await api.put('/content/regulamento', { html: values.html });
    refetch();
  };

  return (
    <Container className="py-3">
      <h1 className="h4">Conteúdo institucional</h1>
      <p>Edite o regulamento com histórico de versões e sanitização automática contra scripts maliciosos.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3" noValidate>
        <div>
          <label htmlFor="html" className="br-label">
            HTML permitido
          </label>
          <textarea
            id="html"
            className="br-textarea"
            rows={8}
            {...register('html')}
            aria-invalid={Boolean(errors.html)}
          />
          {errors.html && <span className="feedback text-danger">{errors.html.message}</span>}
        </div>
        <BrButton type="submit" loading={isSubmitting}>
          Salvar alterações
        </BrButton>
      </form>
      {isSubmitSuccessful && (
        <BrMessage
          status="success"
          className="mt-3"
          title="Conteúdo atualizado"
          message="Versão registrada com auditoria e compliance LGPD."
        />
      )}
      <section className="mt-4" aria-live="polite">
        <h2 className="h5">Pré-visualização</h2>
        <article dangerouslySetInnerHTML={{ __html: preview }} />
      </section>
    </Container>
  );
};
