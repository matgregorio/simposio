import { Link, NavLink, Outlet } from 'react-router-dom';

import { BrButton, BrFooter, BrHeader } from '@govbr-ds/react-components';

import { useAuth } from '../../stores/AuthContext';

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/programacao', label: 'Programação' },
  { to: '/anais', label: 'Anais' },
  { to: '/regulamento', label: 'Regulamento' },
  { to: '/certificados/validar', label: 'Validar Certificado' },
];

export const PublicLayout = () => {
  const { user } = useAuth();

  return (
    <div className="public-layout">
      <BrHeader
        title={<Link to="/">Simpósio Acadêmico IF Sudeste MG</Link>}
        subTitle="Diretoria de Pesquisa e Pós-Graduação"
        urlLogo="https://www.gov.br/infraestrutura/pt-br/assuntos/dnit/painel-dnit-2022/imagens/logo-governo-federal"
        quickAccessLinks={navLinks.map((link) => ({ label: link.label, href: link.to }))}
        showLoginButton={!user}
        loggedIn={Boolean(user)}
        onClickLogin={() => {
          window.location.href = '/entrar';
        }}
        avatar={user ? <span aria-label="Usuário logado">{user.nome}</span> : undefined}
        menuId="public-menu"
      />
      <nav aria-label="Menu principal" className="br-menu" id="public-menu">
        <div className="menu-container">
          <div className="menu-body">
            <div className="menu-content">
              <ul>
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to}>{link.label}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <BrFooter
        urlLogo="https://www.gov.br/infraestrutura/pt-br/assuntos/dnit/painel-dnit-2022/imagens/logo-governo-federal"
        userLicenseText={<small>Conteúdo em conformidade com LGPD e acessibilidade WCAG 2.1.</small>}
        socialNetworks={[
          { icon: 'fab fa-instagram', link: 'https://www.instagram.com', name: 'Instagram' },
          { icon: 'fab fa-youtube', link: 'https://www.youtube.com', name: 'YouTube' },
        ]}
      >
        {!user ? (
          <div className="d-flex justify-content-end gap-2">
            <BrButton type="button" onClick={() => (window.location.href = '/entrar')}>
              Entrar
            </BrButton>
            <BrButton type="button" secondary onClick={() => (window.location.href = '/cadastro')}>
              Inscreva-se
            </BrButton>
          </div>
        ) : (
          <div className="d-flex justify-content-end">
            <BrButton type="button" onClick={() => (window.location.href = '/painel')}>
              Acessar painel
            </BrButton>
          </div>
        )}
      </BrFooter>
    </div>
  );
};
