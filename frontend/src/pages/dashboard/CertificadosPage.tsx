import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { BrButton, BrCard, BrInput, BrMessage, BrSelect, Container } from '@govbr-ds/react-components';

import api from '../../services/api/client';
import { useMeusCertificados } from '../../services/api/hooks';
import { useAuth } from '../../stores/AuthContext';

const schema = z.object({
  userId: z.string().min(3),
  tipo: z.enum(['Participação', 'Apresentação']),
});

type FormData = z.infer<typeof schema>;

export const CertificadosPage = () => {
  const { user } = useAuth();
  const { data: certificados, refetch } = useMeusCertificados();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (form: FormData) => {
    await api.post('/certificates/emit', form);
    setStatusMessage('Certificado emitido com sucesso.');
    reset();
    refetch();
  };

  return (
    <Container className="py-3">
      <h1 className="h4">Certificados</h1>
      <p>Gerencie a emissão, acompanhe validações públicas e disponibilize os documentos para download.</p>
      {user?.role !== 'user' && (
        <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3" noValidate>
          <div>
            <label htmlFor="userId" className="br-label">
              ID do participante
            </label>
            <BrInput id="userId" {...register('userId')} />
          </div>
          <div>
            <label htmlFor="tipo" className="br-label">
              Tipo de certificado
            </label>
            <BrSelect id="tipo" {...register('tipo')}>
              <option value="Participação">Participação</option>
              <option value="Apresentação">Apresentação</option>
            </BrSelect>
          </div>
          <BrButton type="submit" loading={isSubmitting}>
            Emitir certificado
          </BrButton>
        </form>
      )}
      {statusMessage && (
        <BrMessage
          status="success"
          className="mt-3"
          title="Operação realizada"
          message={statusMessage}
        />
      )}
      <section className="mt-4">
        <h2 className="h5">Meus certificados</h2>
        <div className="d-grid gap-3">
          {certificados?.map((certificate) => (
            <BrCard
              key={certificate._id}
              title={`${certificate.tipo} • ${certificate.evento}`}
              subtitle={`Código: ${certificate.codigoHash}`}
            >
              <p>Validações: {certificate.verificacoesCount}</p>
              <a className="br-button" href={certificate.pdfPath} target="_blank" rel="noopener noreferrer">
                Baixar PDF
              </a>
            </BrCard>
          ))}
        </div>
      </section>
    </Container>
  );
};
