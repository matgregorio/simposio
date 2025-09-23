import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { BrButton, BrInput, BrMessage, Container } from '@govbr-ds/react-components';

import { useAuth } from '../../stores/AuthContext';

const schema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  senha: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage = () => {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Não foi possível autenticar. Verifique as credenciais.');
    }
  };

  return (
    <Container className="py-4">
      <h1 className="h3">Entrar no sistema</h1>
      <p>Utilize as credenciais cadastradas. O acesso é protegido por autenticação de dois fatores opcional.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3" noValidate>
        <div>
          <label htmlFor="email" className="br-label">
            E-mail institucional
          </label>
          <BrInput id="email" type="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
          {errors.email && <span className="feedback text-danger">{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="senha" className="br-label">
            Senha
          </label>
          <BrInput id="senha" type="password" {...register('senha')} aria-invalid={Boolean(errors.senha)} />
          {errors.senha && <span className="feedback text-danger">{errors.senha.message}</span>}
        </div>
        <BrButton type="submit" loading={isSubmitting}>
          Acessar
        </BrButton>
      </form>
      {errorMessage && (
        <BrMessage
          status="danger"
          className="mt-3"
          title="Erro de autenticação"
          message={errorMessage}
        />
      )}
    </Container>
  );
};
