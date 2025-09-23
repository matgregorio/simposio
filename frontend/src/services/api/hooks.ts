import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from './client';

export interface SubeventoDTO {
  _id: string;
  titulo: string;
  tipo: string;
  data: string;
  horario: string;
  duracao: number;
  vagas: number;
  palestrante: string;
  lattes?: string;
  local: string;
  descricao?: string;
  submissionId?: string;
}

export interface AcervoItemDTO {
  _id: string;
  titulo: string;
  ano: number;
  autores: string[];
  palavrasChave: string[];
  downloadUrl: string;
}

export interface SubmissionAuthorDTO {
  _id: string;
  nome: string;
  email?: string;
  tipoParticipante?: string;
}

export interface SubmissionDTO {
  _id: string;
  titulo: string;
  resumoHTML: string;
  palavrasChave: string[];
  status: 'Enviado' | 'Em Avaliação' | 'Aprovado' | 'Reprovado';
  tipoTrabalho: string;
  tipoApresentacao: 'N/A' | 'Apresentação Oral' | 'Pôster';
  iniciacaoCientifica: boolean;
  autorId: SubmissionAuthorDTO | string;
  mediaFinal?: number;
}

export interface CertificateDTO {
  _id: string;
  codigoHash: string;
  tipo: string;
  evento: string;
  periodo: string;
  pdfPath: string;
}

export const useSubeventos = () =>
  useQuery({
    queryKey: ['subeventos'],
    queryFn: async () => {
      const response = await api.get<SubeventoDTO[]>('/subeventos');
      return response.data;
    },
  });

export const useAcervo = () =>
  useQuery({
    queryKey: ['acervo'],
    queryFn: async () => {
      const response = await api.get<AcervoItemDTO[]>('/acervo');
      return response.data;
    },
  });

export const useConteudo = (slug: string) =>
  useQuery({
    queryKey: ['conteudo', slug],
    queryFn: async () => {
      const response = await api.get(`/content/${slug}`);
      return response.data as { htmlSanitizado: string };
    },
  });

export const useSubmissions = () =>
  useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      const response = await api.get<SubmissionDTO[]>('/submissions');
      return response.data;
    },
  });

export const useInscreverSubevento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subeventoId: string) => {
      const response = await api.post(`/subeventos/${subeventoId}/inscrever`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subeventos'] });
    },
  });
};

export const useValidarCertificado = () =>
  useMutation({
    mutationFn: async (codigo: string) => {
      const response = await api.get<{ valido: boolean; certificate: CertificateDTO }>(
        `/certificates/validate/${codigo}`,
      );
      return response.data;
    },
  });

export const useMeusCertificados = () =>
  useQuery({
    queryKey: ['certificates', 'me'],
    queryFn: async () => {
      const response = await api.get<CertificateDTO[]>('/certificates/my');
      return response.data;
    },
  });
