import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { BrButton, BrInput, BrMessage, BrSelect, Container } from '@govbr-ds/react-components';

import api from '../../services/api/client';
import { useSubeventos } from '../../services/api/hooks';

const TIPOS_SUBEVENTO = ['Palestra', 'Minicurso', 'Oficina', 'Mesa Redonda', 'Apresentação de Trabalho'] as const;

const schema = z.object({
  titulo: z.string().min(3),
  tipo: z.enum(TIPOS_SUBEVENTO),
  data: z.string(),
  horario: z.string(),
  duracao: z.coerce.number().min(15),
  vagas: z.coerce.number().min(1),
  palestrante: z.string().min(3),
  lattes: z.string().optional(),
  local: z.string().min(2),
  descricao: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const ProgramacaoAdminPage = () => {
  const { refetch } = useSubeventos();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const tipos = TIPOS_SUBEVENTO;

  const onSubmit = async (data: FormData) => {
    await api.post('/subeventos', { ...data, data: new Date(data.data) });
    reset();
    refetch();
  };

  return (
    <Container className="py-3">
      <h1 className="h4">Gerenciar programação</h1>
      <p>Cadastre novos subeventos garantindo acessibilidade, lotação controlada e conflitos evitados.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3" noValidate>
        <div>
          <label htmlFor="titulo" className="br-label">
            Título
          </label>
          <BrInput id="titulo" {...register('titulo')} aria-invalid={Boolean(errors.titulo)} />
        </div>
        <div>
          <label htmlFor="tipo" className="br-label">
            Tipo
          </label>
          <BrSelect id="tipo" {...register('tipo')} aria-invalid={Boolean(errors.tipo)}>
            <option value="">Selecione</option>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </BrSelect>
        </div>
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="data" className="br-label">
              Data
            </label>
            <BrInput id="data" type="date" {...register('data')} aria-invalid={Boolean(errors.data)} />
          </div>
          <div className="col-md-4">
            <label htmlFor="horario" className="br-label">
              Horário
            </label>
            <BrInput id="horario" type="time" {...register('horario')} aria-invalid={Boolean(errors.horario)} />
          </div>
          <div className="col-md-2">
            <label htmlFor="duracao" className="br-label">
              Duração (min)
            </label>
            <BrInput id="duracao" type="number" {...register('duracao')} aria-invalid={Boolean(errors.duracao)} />
          </div>
          <div className="col-md-2">
            <label htmlFor="vagas" className="br-label">
              Vagas
            </label>
            <BrInput id="vagas" type="number" {...register('vagas')} aria-invalid={Boolean(errors.vagas)} />
          </div>
        </div>
        <div>
          <label htmlFor="palestrante" className="br-label">
            Palestrante
          </label>
          <BrInput id="palestrante" {...register('palestrante')} aria-invalid={Boolean(errors.palestrante)} />
        </div>
        <div>
          <label htmlFor="lattes" className="br-label">
            Currículo Lattes
          </label>
          <BrInput id="lattes" {...register('lattes')} />
        </div>
        <div>
          <label htmlFor="local" className="br-label">
            Local
          </label>
          <BrInput id="local" {...register('local')} aria-invalid={Boolean(errors.local)} />
        </div>
        <div>
          <label htmlFor="descricao" className="br-label">
            Descrição
          </label>
          <textarea
            id="descricao"
            className="br-textarea"
            rows={3}
            {...register('descricao')}
            aria-invalid={Boolean(errors.descricao)}
          />
        </div>
        <BrButton type="submit" loading={isSubmitting}>
          Salvar subevento
        </BrButton>
      </form>
      <BrMessage
        status="info"
        className="mt-3"
        title="Boas práticas"
        message="Configure horários sem conflitos, limite de vagas e vincule apresentações orais aprovadas para geração automática de certificados."
      />
    </Container>
  );
};
