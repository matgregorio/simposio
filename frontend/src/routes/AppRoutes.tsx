import { Navigate, Route, Routes } from 'react-router-dom';

import { PublicLayout } from '../components/layouts/PublicLayout';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/public/HomePage';
import { ProgramacaoPage } from '../pages/public/ProgramacaoPage';
import { AnaisPage } from '../pages/public/AnaisPage';
import { RegulamentoPage } from '../pages/public/RegulamentoPage';
import { ValidarCertificadoPage } from '../pages/public/ValidarCertificadoPage';
import { LoginPage } from '../pages/public/LoginPage';
import { CadastroPage } from '../pages/public/CadastroPage';
import { DashboardHomePage } from '../pages/dashboard/DashboardHomePage';
import { SubmissoesPage } from '../pages/dashboard/SubmissoesPage';
import { ProgramacaoAdminPage } from '../pages/dashboard/ProgramacaoAdminPage';
import { ConteudosPage } from '../pages/dashboard/ConteudosPage';
import { CertificadosPage } from '../pages/dashboard/CertificadosPage';
import { DadosPage } from '../pages/dashboard/DadosPage';

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/programacao" element={<ProgramacaoPage />} />
      <Route path="/anais" element={<AnaisPage />} />
      <Route path="/regulamento" element={<RegulamentoPage />} />
      <Route path="/certificados/validar" element={<ValidarCertificadoPage />} />
      <Route path="/entrar" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
    </Route>

    <Route
      path="/painel"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardHomePage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/painel/submissoes"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <SubmissoesPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/painel/programacao"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <ProgramacaoAdminPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/painel/conteudos"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <ConteudosPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/painel/certificados"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <CertificadosPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/painel/dados"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <DadosPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
