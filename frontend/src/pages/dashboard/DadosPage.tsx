import { useEffect, useState } from 'react';

import { BrButton, BrCard, BrMessage, Container } from '@govbr-ds/react-components';

import api from '../../services/api/client';
import { useAuth } from '../../stores/AuthContext';

interface PerfilData {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  tipoParticipante: string;
  consentimentos?: { finalidade: string; aceito: boolean; data: string }[];
}

export const DadosPage = () => {
  const { logout } = useAuth();
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [exportacao, setExportacao] = useState<Record<string, unknown> | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await api.get('/users/me');
      setPerfil(response.data);
    };

    fetchProfile();
  }, []);

  const exportar = async () => {
    const response = await api.get<Record<string, unknown>>('/users/me/export');
    setExportacao(response.data);
  };

  const solicitarExclusao = async () => {
    await api.post('/users/me/delete-request');
    setMensagem('Solicitação de exclusão registrada. A equipe de privacidade avaliará o pedido.');
  };

  const atualizarConsentimentos = async () => {
    await api.post('/users/me/consents', {
      consentimentos: (perfil?.consentimentos ?? []).map((consentimento) => ({
        finalidade: consentimento.finalidade,
        aceito: true,
      })),
    });
    setMensagem('Consentimentos atualizados com sucesso.');
  };

  return (
    <Container className="py-3">
      <h1 className="h4">Meus dados pessoais</h1>
      <p>Gerencie seus dados conforme a Lei Geral de Proteção de Dados. Você pode exportar, corrigir ou solicitar a exclusão.</p>
      {perfil && (
        <BrCard title={perfil.nome} subtitle={perfil.email}>
          <p>CPF: {perfil.cpf}</p>
          <p>Telefone: {perfil.telefone ?? 'Não informado'}</p>
          <p>Perfil: {perfil.tipoParticipante}</p>
          <h2 className="h6">Consentimentos registrados</h2>
          <ul>
            {perfil.consentimentos?.map((consent) => (
              <li key={consent.finalidade}>
                {consent.finalidade} – {consent.aceito ? 'Aceito' : 'Negado'} em{' '}
                {new Date(consent.data).toLocaleString('pt-BR')}
              </li>
            ))}
          </ul>
        </BrCard>
      )}
      <div className="d-flex flex-wrap gap-2 mt-3" role="group" aria-label="Ações LGPD">
        <BrButton type="button" secondary onClick={exportar}>
          Exportar dados
        </BrButton>
        <BrButton type="button" onClick={atualizarConsentimentos}>
          Atualizar consentimentos
        </BrButton>
        <BrButton type="button" inverted onClick={solicitarExclusao}>
          Solicitar exclusão
        </BrButton>
        <BrButton type="button" secondary onClick={logout}>
          Encerrar sessão
        </BrButton>
      </div>
      {exportacao && (
        <BrMessage
          status="info"
          className="mt-3"
          title="Exportação pronta"
          message={<pre>{JSON.stringify(exportacao, null, 2)}</pre>}
        />
      )}
      {mensagem && (
        <BrMessage status="success" className="mt-3" title="Aviso" message={mensagem} />
      )}
    </Container>
  );
};
