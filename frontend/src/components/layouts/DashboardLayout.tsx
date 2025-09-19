import { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { BrButton, BrFooter, BrHeader } from '@govbr-ds/react-components';

import { useAuth } from '../../stores/AuthContext';

const menuItems = [
  { to: '/painel', label: 'Visão Geral', roles: ['admin', 'sub-admin', 'user', 'avaliador-externo'] },
  { to: '/painel/submissoes', label: 'Submissões', roles: ['admin', 'sub-admin', 'avaliador-externo'] },
  { to: '/painel/programacao', label: 'Programação', roles: ['admin', 'sub-admin'] },
  { to: '/painel/conteudos', label: 'Conteúdos', roles: ['admin', 'sub-admin'] },
  { to: '/painel/certificados', label: 'Certificados', roles: ['admin', 'sub-admin'] },
  { to: '/painel/dados', label: 'Meus Dados', roles: ['admin', 'sub-admin', 'user', 'avaliador-externo'] },
];

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const filteredMenu = menuItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="dashboard-layout">
      <BrHeader
        title={<Link to="/">Simpósio Acadêmico</Link>}
        subTitle="Painel Administrativo"
        urlLogo="https://www.gov.br/infraestrutura/pt-br/assuntos/dnit/painel-dnit-2022/imagens/logo-governo-federal"
        loggedIn
        avatar={<span aria-label="Perfil">{user.nome}</span>}
        showLoginButton={false}
      />
      <div className="br-page">
        <div className="container-lg py-3">
          <div className="row">
            <aside className="col-12 col-md-3" aria-label="Navegação do painel">
              <nav className="br-menu" id="dashboard-menu">
                <div className="menu-container">
                  <div className="menu-body">
                    <div className="menu-content">
                      <ul>
                        {filteredMenu.map((item) => (
                          <li key={item.to}>
                            <NavLink to={item.to}>{item.label}</NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </nav>
              <BrButton className="w-100 mt-2" type="button" secondary onClick={logout}>
                Sair
              </BrButton>
            </aside>
            <section className="col-12 col-md-9" aria-live="polite">
              {children}
            </section>
          </div>
        </div>
      </div>
      <BrFooter
        inverted
        userLicenseText={<small>Operação monitorada e auditada. Registro automático para LGPD.</small>}
      />
    </div>
  );
};
