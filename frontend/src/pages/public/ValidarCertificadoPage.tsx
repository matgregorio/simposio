import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { BrButton, BrInput, BrMessage, Container } from '@govbr-ds/react-components';

import { useValidarCertificado } from '../../services/api/hooks';

const schema = z.object({ codigo: z.string().min(6, 'Informe o código do certificado.') });

type FormData = z.infer<typeof schema>;

export const ValidarCertificadoPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const validar = useValidarCertificado();

  const onSubmit = (data: FormData) => {
    validar.mutate(data.codigo);
  };

  return (
    <Container className="py-4">
      <h1 className="h3">Validar certificado</h1>
      <p>Informe o código alfanumérico presente no QR Code para validar a autenticidade do certificado.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3" noValidate>
        <div>
          <label htmlFor="codigo" className="br-label">
            Código do certificado
          </label>
          <BrInput id="codigo" {...register('codigo')} aria-invalid={Boolean(errors.codigo)} />
          {errors.codigo && <span className="feedback text-danger">{errors.codigo.message}</span>}
        </div>
        <BrButton type="submit" loading={validar.isPending}>
          Validar
        </BrButton>
      </form>
      {validar.isSuccess && (
        <BrMessage
          status="success"
          className="mt-3"
          title="Certificado válido"
          message={
            <p>
              Titular: {validar.data.certificate.userId} • Evento: {validar.data.certificate.evento} • Período:
              {validar.data.certificate.periodo}
            </p>
          }
        />
      )}
      {validar.isError && (
        <BrMessage
          status="danger"
          className="mt-3"
          title="Não foi possível validar"
          message="Verifique o código informado e tente novamente."
        />
      )}
    </Container>
  );
};
