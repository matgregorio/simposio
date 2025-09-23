import mongoose from '../config/database';
import AreaAtuacao from '../models/AreaAtuacao';
import Conteudo from '../models/Conteudo';
import DatasEvento from '../models/DatasEvento';
import GrandeArea from '../models/GrandeArea';
import Subarea from '../models/Subarea';
import Subevento from '../models/Subevento';
import Submission from '../models/Submission';
import User from '../models/User';
import { AuthService } from '../services/AuthService';

export const runSeeds = async () => {
  await mongoose.connection.dropDatabase();

  const area = await AreaAtuacao.create({ nome: 'Ciências Exatas', descricao: 'STEM' });
  const grandeArea = await GrandeArea.create({ nome: 'Computação', areaAtuacaoId: area.id });
  const subarea = await Subarea.create({ nome: 'Inteligência Artificial', grandeAreaId: grandeArea.id });

  const admin = await AuthService.register({
    nome: 'Administrador',
    email: 'admin@test.com',
    senha: 'ChangeMe123!',
    cpf: '12345678909',
    telefone: '3200000000',
    tipoParticipante: 'Técnico Administrativo',
    curso: 'TI',
    consentimentos: [{ finalidade: 'comunicados', aceito: true }],
  });
  await User.findByIdAndUpdate(admin.id, { role: 'admin' });

  const docente = await AuthService.register({
    nome: 'Docente',
    email: 'docente@test.com',
    senha: 'ChangeMe123!',
    cpf: '98765432100',
    telefone: '3200000001',
    tipoParticipante: 'Docente',
    curso: 'Engenharia',
    consentimentos: [{ finalidade: 'comunicados', aceito: true }],
  });
  await User.findByIdAndUpdate(docente.id, { aprovadoDocente: true });

  const avaliador = await AuthService.register({
    nome: 'Avaliador Externo',
    email: 'avaliador@externo.com',
    senha: 'ChangeMe123!',
    cpf: '11122233344',
    telefone: '3200000002',
    tipoParticipante: 'Outros',
    curso: 'Avaliação',
    consentimentos: [{ finalidade: 'comunicados', aceito: true }],
  });
  await User.findByIdAndUpdate(avaliador.id, { role: 'avaliador-externo' });

  await DatasEvento.insertMany([
    { chave: 'inscricao', startDate: new Date(), endDate: new Date(Date.now() + 10 * 86400000) },
    { chave: 'submissao', startDate: new Date(), endDate: new Date(Date.now() + 15 * 86400000) },
  ]);

  await Conteudo.create({
    slug: 'regulamento',
    htmlSanitizado: '<p>Regulamento do evento.</p>',
    anexos: [],
    historico: [],
  });

  await Subevento.insertMany([
    {
      titulo: 'Palestra de Abertura',
      tipo: 'Palestra',
      data: new Date(),
      horario: '19:00',
      duracao: 120,
      vagas: 200,
      palestrante: 'Prof. Dr. João',
      lattes: 'http://lattes.cnpq.br/123',
      local: 'Auditório Principal',
      descricao: 'Boas vindas ao evento.',
    },
  ]);

  await Submission.create({
    titulo: 'Projeto de Pesquisa em IA',
    autorId: docente.id,
    resumoHTML: '<p>Resumo da pesquisa</p>',
    palavrasChave: ['IA', 'Pesquisa'],
    subareaId: subarea.id,
    tipoTrabalho: 'Pesquisa',
    iniciacaoCientifica: true,
    apoio: 'CNPq',
    status: 'Aprovado',
    tipoApresentacao: 'Apresentação Oral',
  });
};
