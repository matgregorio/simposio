import InputMask from 'react-input-mask';
import { useState, type InputHTMLAttributes } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { BrButton, BrInput, BrMessage, BrSelect, Container } from '@govbr-ds/react-components';

import api from '../../services/api/client';

const schema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  cpf: z.string().min(14, 'CPF obrigatório'),
  telefone: z.string().min(14, 'Telefone obrigatório'),
  tipoParticipante: z.enum([
    'Aluno',
    'Docente',
    'Ex-aluno',
    'Técnico Administrativo',
    'Outros',
    'Não declarado',
  ]),
  curso: z.string().optional(),
  docente: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const tipos = [
  'Aluno',
  'Docente',
  'Ex-aluno',
  'Técnico Administrativo',
  'Outros',
  'Não declarado',
];

export const CadastroPage = () => {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await api.post('/auth/register', {
      ...data,
      consentimentos: [
        { finalidade: 'comunicados', aceito: true },
        { finalidade: 'tratamento-dados', aceito: true },
      ],
    });
    setSuccess(true);
  };

  return (
    <Container className="py-4">
      <h1 className="h3">Criar conta</h1>
      <p>Cadastre-se para acompanhar o evento, submeter trabalhos e emitir certificados.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3" noValidate>
        <div>
          <label htmlFor="nome" className="br-label">
            Nome completo
          </label>
          <BrInput id="nome" {...register('nome')} aria-invalid={Boolean(errors.nome)} />
          {errors.nome && <span className="feedback text-danger">{errors.nome.message}</span>}
        </div>
        <div>
          <label htmlFor="email" className="br-label">
            E-mail
          </label>
          <BrInput id="email" type="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
          {errors.email && <span className="feedback text-danger">{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="senha" className="br-label">
            Senha segura
          </label>
          <BrInput id="senha" type="password" {...register('senha')} aria-invalid={Boolean(errors.senha)} />
          {errors.senha && <span className="feedback text-danger">{errors.senha.message}</span>}
        </div>
        <div>
          <label htmlFor="cpf" className="br-label">
            CPF
          </label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <InputMask mask="999.999.999-99" {...field}>
                {(inputProps: InputHTMLAttributes<HTMLInputElement>) => (
                  <BrInput id="cpf" {...inputProps} aria-invalid={Boolean(errors.cpf)} />
                )}
              </InputMask>
            )}
          />
          {errors.cpf && <span className="feedback text-danger">{errors.cpf.message}</span>}
        </div>
        <div>
          <label htmlFor="telefone" className="br-label">
            Telefone
          </label>
          <Controller
            name="telefone"
            control={control}
            render={({ field }) => (
              <InputMask mask="(99) 99999-9999" {...field}>
                {(inputProps: InputHTMLAttributes<HTMLInputElement>) => (
                  <BrInput id="telefone" {...inputProps} aria-invalid={Boolean(errors.telefone)} />
                )}
              </InputMask>
            )}
          />
          {errors.telefone && <span className="feedback text-danger">{errors.telefone.message}</span>}
        </div>
        <div>
          <label htmlFor="tipoParticipante" className="br-label">
            Perfil
          </label>
          <BrSelect id="tipoParticipante" {...register('tipoParticipante')} aria-invalid={Boolean(errors.tipoParticipante)}>
            <option value="">Selecione</option>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </BrSelect>
          {errors.tipoParticipante && (
            <span className="feedback text-danger">{errors.tipoParticipante.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="curso" className="br-label">
            Curso (opcional)
          </label>
          <BrInput id="curso" {...register('curso')} />
        </div>
        <BrButton type="submit" loading={isSubmitting}>
          Concluir cadastro
        </BrButton>
      </form>
      {success && (
        <BrMessage
          status="success"
          className="mt-3"
          title="Cadastro realizado"
          message="Verifique seu e-mail para ativar a conta. Se marcou a opção Docente, aguarde a aprovação da organização."
        />
      )}
    </Container>
  );
};
