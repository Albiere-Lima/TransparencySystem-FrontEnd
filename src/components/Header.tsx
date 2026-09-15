import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDown, User, LogOut, Check, Settings, ShieldCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeName } from '../contexts/ThemeContext';
import { SetAdminModal } from './SetAdminModal';
import { getStyles } from '../styles/Header.styles';
import { useIsMobile } from '../services/userIsMobile';

interface HeaderProps {
  userName?: string | null;
  userRole?: string | null;
  setCurrentView: (view: 'admin' | 'analytics' | 'profile' | 'account') => void;
}

const THEMES_CONFIG = [
  { id: 'institucional', name: 'Institucional', icon: '🏛️', dots: ['#1E3A8A', '#3B82F6'] },
  { id: 'escuro', name: 'Escuro', icon: '🌑', dots: ['#2563EB', '#60A5FA', '#1F2937'] },
  { id: 'floresta', name: 'Floresta', icon: '🌿', dots: ['#14532D', '#16A34A', '#DCFCE7'] },
  { id: 'violeta', name: 'Violeta', icon: '🔮', dots: ['#4C1D95', '#8B5CF6', '#F5F3FF'] },
  { id: 'areia', name: 'Areia', icon: '🏜️', dots: ['#78350F', '#D97706', '#FEFCE8'] },
] as const;

export const Header: React.FC<HeaderProps> = ({ 
  userName, 
  userRole, 
  setCurrentView 
}) => {
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);
  const { user, logout, isStudentView, toggleStudentView } = useAuth();
  const { theme, setTheme } = useTheme();

  const currentThemeConfig = THEMES_CONFIG.find((t) => t.id === theme) || THEMES_CONFIG[0];

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const defaultInitials = (user?.initials || "User".split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase());

  const handleToggleStudentView = () => {
    const nextState = !isStudentView;
    toggleStudentView();
    if (nextState) {
      setCurrentView('analytics');
    } else {
      setCurrentView('admin');
    }
  };

  const themeRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = userName || user?.name || 'Usuário';
  const displayEmail = user?.email || 'usuario@ufpb.br';
  const currentRole = userRole || user?.role || 'ROLE_USER';
  const isAdmin = currentRole === 'ROLE_ADMIN';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (!document.body.contains(target)) return;

      if (themeRef.current && !themeRef.current.contains(target)) {
        setIsThemeMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profileElement = (
    <div ref={profileRef} style={styles.dropdownContainer}>
      <div
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        style={styles.profileTriggerContainer}
      >
        <div style={styles.profileTextContainer}>
          <p style={styles.profileName}>{displayName}</p>
          <p style={styles.profileRoleText}>
            {isAdmin ? 'Administrador(a)' : 'Discente'}
          </p>
        </div>
        <div style={styles.profileAvatarWrapper}>
          {user?.picture ? (
            <img
              src={user.picture}
              alt={displayName}
              style={styles.headerAvatarImg}
            />
          ) : (
            <div style={styles.headerAvatarFallback(user?.avatarColor)}>
              {defaultInitials}
            </div>
          )}
          <ChevronDown size="2vh" style={{ opacity: 0.8 }} />
        </div>
      </div>

      {/* Menu Roll do Perfil */}
      {isProfileMenuOpen && (
        <div style={styles.profileDropdownMenu}>
          <div style={styles.profileInfoSection}>
            {user?.picture ? (
              <img
                src={user.picture}
                alt={displayName}
                style={styles.dropdownAvatarImg}
              />
            ) : (
              <div style={styles.dropdownAvatarFallback(user?.avatarColor)}>
                {defaultInitials}
              </div>
            )}
            <div style={styles.profileDetailsBox}>
              <p style={styles.profileDetailName}>{displayName}</p>
              <p style={styles.profileDetailEmail}>{displayEmail}</p>
              <span style={styles.getRoleBadge(isAdmin)}>{currentRole}</span>
            </div>
          </div>

          <div style={styles.profileActionsSection}>
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(false);
                setCurrentView('profile');
              }}
              style={styles.actionBtn}
            >
              <User size="2.25vh" />
              <div>
                <div style={styles.actionTitle}>Meu Perfil</div>
                <div style={styles.actionSubtitle}>Foto e nome de exibição</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(false);
                setCurrentView('account');
              }}
              style={styles.actionBtn}
            >
              <Settings size="2.25vh" />
              <div>
                <div style={styles.actionTitle}>Configurações da Conta</div>
                <div style={styles.actionSubtitle}>Senha, notificações e acesso</div>
              </div>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setIsAdminModalOpen(true);
                }}
                style={styles.actionBtn}
              >
                <ShieldCheck size="2.25vh" />
                <div>
                  <div style={styles.actionTitle}>Setar Administrador</div>
                  <div style={styles.actionSubtitle}>Gerenciar privilégios do sistema</div>
                </div>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(false);
                logout();
              }}
              style={styles.logoutBtn}
            >
              <LogOut size="2.25vh" />
              <span style={styles.logoutText}>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header style={styles.header}>
        {/* Linha Superior (No mobile: Logo + Avatar Perfil | No PC: Logo) */}
        <div style={styles.topBarMobile || styles.logoGroup}>
          <div style={styles.logoGroup}>
            <div style={styles.logoBadge}>UFPB</div>
            <div style={styles.titleGroup}>
              <h1 style={styles.mainTitle}>Portal de Transparência</h1>
              <p style={styles.subtitle}>Gestão de Despesas Institucionais</p>
            </div>
          </div>

          {/* No celular, o perfil fica no topo à direita */}
          {isMobile && profileElement}
        </div>

        {/* Linha de Controles (No mobile: Tema + Botão Discente | No PC: Tema + Botão Discente + Perfil) */}
        <div style={styles.controlsGroup}>
          {/* Dropdown de Temas */}
          <div ref={themeRef} style={styles.dropdownContainer}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              style={styles.themeTriggerBtn}
            >
              <span>{currentThemeConfig.icon}</span>
              {currentThemeConfig.name}
              <ChevronDown size="1.8vh" style={{ opacity: 0.7 }} />
            </button>

            {isThemeMenuOpen && (
              <div style={styles.themeMenuDropdown}>
                <div style={styles.menuHeader}>
                  <span style={styles.menuHeaderTitle}>TEMA</span>
                </div>

                <div style={styles.themeOptionList}>
                  {THEMES_CONFIG.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id as ThemeName);
                        setIsThemeMenuOpen(false);
                      }}
                      style={styles.getThemeOptionBtn(theme === t.id)}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--dropdown-hover)')}
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = theme === t.id ? 'var(--dropdown-hover)' : 'transparent')
                      }
                    >
                      <div style={styles.themeDotsGroup}>
                        {t.dots.map((color, i) => (
                          <div key={i} style={styles.themeDot(color)} />
                        ))}
                      </div>
                      <span style={styles.themeIconSpan}>{t.icon}</span>
                      <span style={styles.getThemeNameSpan(theme === t.id)}>
                        {t.name}
                      </span>
                      {theme === t.id && <Check size="2vh" color="#3B82F6" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botão Visão Discente */}
          {isAdmin && (
            <button
              type="button"
              onClick={handleToggleStudentView}
              style={styles.getStudentViewBtn(isStudentView)}
            >
              {isStudentView ? '👁️ Voltar à Visão Admin' : '🎓 Ver como Discente'}
            </button>
          )}

          {/* No PC, o perfil é posicionado no final dos controles */}
          {!isMobile && profileElement}
        </div>
      </header>

      {/* Modal de Gerenciamento de Admin */}
      <SetAdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </>
  );
};