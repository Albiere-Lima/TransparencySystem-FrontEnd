import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useIsMobile } from '../services/userIsMobile';
import { styles } from '../styles/AccountSettings.styles';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Lock, 
  Bell, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Shield,
  GraduationCap,
  Loader2
} from 'lucide-react';

interface AccountSettingsProps {
  onNavigateBack?: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ onNavigateBack }) => {
  const { user, updateUser } = useAuth();
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  const [profileData, setProfileData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    registrationNumber: '',
    campus: '',
    department: '',
    bio: '',
  });

  const [notifications, setNotifications] = useState({
    notifyDailySummary: true,
    notifyMonthlyReports: true,
    notifyNewExpenses: true,
    notifySystemAlerts: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        registrationNumber: user.registrationNumber || '',
        campus: user.campus || '',
        department: user.department || '',
        bio: user.bio || '',
      });
      setNotifications({
        notifyDailySummary: user.notifyDailySummary ?? true,
        notifyMonthlyReports: user.notifyMonthlyReports ?? true,
        notifyNewExpenses: user.notifyNewExpenses ?? true,
        notifySystemAlerts: user.notifySystemAlerts ?? true,
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setStatusMessage({ type: 'error', text: 'Sessão inválida. Faça login novamente.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await api.put(`/users/${user.id}/profile`, profileData);
      const updatedUser = response.data || (response.data.id ? response.data : { ...user, ...profileData });

      if (updateUser) {
        updateUser(updatedUser);
      }

      setStatusMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Falha ao atualizar o perfil. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setStatusMessage({ type: 'error', text: 'Sessão inválida. Faça login novamente.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await api.put(`/users/${user.id}/notifications`, notifications);
      if (updateUser) {
        updateUser(response.data);
      }

      setStatusMessage({ type: 'success', text: 'Preferências de notificação salvas!' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Falha ao atualizar notificações.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setStatusMessage({ type: 'error', text: 'Sessão inválida. Faça login novamente.' });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'A nova senha e a confirmação não coincidem.' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      await api.put(`/users/${user.id}/change-password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setStatusMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao alterar a senha. Verifique a senha atual.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container(isMobile)}>
      {/* Cabeçalho */}
      <div style={styles.header}>
        <nav style={styles.breadcrumb}>
          <span 
            style={styles.getBreadcrumbItem(!!onNavigateBack)} 
            onClick={onNavigateBack}
          >
            Dashboard
          </span>
          {' > '}
          <span style={styles.getBreadcrumbItem(false)}>Configurações da Conta</span>
        </nav>
        <h1 style={styles.title(isMobile)}>Configurações da Conta</h1>
        <p style={styles.subtitle}>
          Gerencie seus dados pessoais, preferências de notificação e segurança da conta.
        </p>
      </div>

      {/* Alerta de Status */}
      {statusMessage && (
        <div style={styles.getAlert(statusMessage.type)}>
          {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Navegação por Abas */}
      <div style={styles.tabsContainer}>
        <button
          type="button"
          onClick={() => { setActiveTab('profile'); setStatusMessage(null); }}
          style={styles.getTabButton(activeTab === 'profile', isMobile)}
        >
          <User size={18} /> {isMobile ? 'Perfil' : 'Dados Pessoais'}
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('notifications'); setStatusMessage(null); }}
          style={styles.getTabButton(activeTab === 'notifications', isMobile)}
        >
          <Bell size={18} /> Notificações
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('security'); setStatusMessage(null); }}
          style={styles.getTabButton(activeTab === 'security', isMobile)}
        >
          <Lock size={18} /> Segurança
        </button>
      </div>

      {/* ABA 1: DADOS PESSOAIS */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} style={styles.form}>
          <div style={styles.card(isMobile)}>
            <div style={styles.sectionTitle}>
              <User size={20} />
              <h3 style={styles.sectionTitleText}>Informações Gerais</h3>
            </div>

            <div style={styles.getGrid2Col(isMobile)}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <User size={14} /> Nome
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  style={styles.getInput()}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <User size={14} /> Sobrenome
                </label>
                <input
                  type="text"
                  value={profileData.surname}
                  onChange={(e) => setProfileData({ ...profileData, surname: e.target.value })}
                  style={styles.getInput()}
                />
              </div>
            </div>

            <div style={styles.getGrid2Col(isMobile)}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <Mail size={14} /> E-mail Institucional
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  style={styles.getInput(true)}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <Phone size={14} /> Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="(83) 99999-9999"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  style={styles.getInput()}
                />
              </div>
            </div>

            <div style={{ ...styles.sectionTitle, marginTop: '12px' }}>
              <GraduationCap size={20} />
              <h3 style={styles.sectionTitleText}>Vínculo Acadômico / Profissional</h3>
            </div>

            <div style={styles.getGrid3Col(isMobile)}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <GraduationCap size={14} /> Matrícula / SIAPE
                </label>
                <input
                  type="text"
                  value={profileData.registrationNumber}
                  onChange={(e) => setProfileData({ ...profileData, registrationNumber: e.target.value })}
                  style={styles.getInput()}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <MapPin size={14} /> Campus
                </label>
                <input
                  type="text"
                  placeholder="Ex: Campus I"
                  value={profileData.campus}
                  onChange={(e) => setProfileData({ ...profileData, campus: e.target.value })}
                  style={styles.getInput()}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <Building size={14} /> Departamento
                </label>
                <input
                  type="text"
                  placeholder="Ex: DCX"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  style={styles.getInput()}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <FileText size={14} /> Biografia / Apresentação
              </label>
              <textarea
                rows={3}
                placeholder="Breve resumo sobre suas atividades..."
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                style={styles.textarea}
              />
            </div>
          </div>

          <div style={styles.getActionsRow(isMobile)}>
            <button 
              type="submit" 
              disabled={isLoading} 
              style={styles.getButtonPrimary(isMobile, isLoading)}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      )}

      {/* ABA 2: PREFERÊNCIAS DE NOTIFICAÇÃO */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} style={styles.form}>
          <div style={styles.card(isMobile)}>
            <div style={styles.sectionTitle}>
              <Bell size={20} />
              <h3 style={styles.sectionTitleText}>Alertas e Notificações por E-mail</h3>
            </div>

            <div style={styles.toggleRow}>
              <div style={styles.toggleInfo}>
                <strong style={styles.toggleTitle}>
                  <Bell size={16} /> Resumo Diário
                </strong>
                <span style={styles.toggleDescription}>
                  Receba um e-mail consolidado com o resumo financeiro do dia.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications.notifyDailySummary}
                onChange={(e) => setNotifications({ ...notifications, notifyDailySummary: e.target.checked })}
                style={styles.checkbox}
              />
            </div>

            <div style={styles.toggleRow}>
              <div style={styles.toggleInfo}>
                <strong style={styles.toggleTitle}>
                  <FileText size={16} /> Relatórios Mensais
                </strong>
                <span style={styles.toggleDescription}>
                  Receba relatórios analíticos de gastos no início de cada mês.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications.notifyMonthlyReports}
                onChange={(e) => setNotifications({ ...notifications, notifyMonthlyReports: e.target.checked })}
                style={styles.checkbox}
              />
            </div>

            <div style={styles.toggleRow}>
              <div style={styles.toggleInfo}>
                <strong style={styles.toggleTitle}>
                  <AlertCircle size={16} /> Novas Despesas Registradas
                </strong>
                <span style={styles.toggleDescription}>
                  Notificar sempre que uma nova despesa for adicionada ao sistema.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications.notifyNewExpenses}
                onChange={(e) => setNotifications({ ...notifications, notifyNewExpenses: e.target.checked })}
                style={styles.checkbox}
              />
            </div>

            <div style={styles.toggleRow}>
              <div style={styles.toggleInfo}>
                <strong style={styles.toggleTitle}>
                  <Shield size={16} /> Alertas do Sistema e Segurança
                </strong>
                <span style={styles.toggleDescription}>
                  Avisos sobre novos logins, alterações de privilégios ou manutenção.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications.notifySystemAlerts}
                onChange={(e) => setNotifications({ ...notifications, notifySystemAlerts: e.target.checked })}
                style={styles.checkbox}
              />
            </div>
          </div>

          <div style={styles.getActionsRow(isMobile)}>
            <button 
              type="submit" 
              disabled={isLoading} 
              style={styles.getButtonPrimary(isMobile, isLoading)}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isLoading ? 'Salvando...' : 'Salvar Notificações'}
            </button>
          </div>
        </form>
      )}

      {/* ABA 3: SEGURANÇA E SENHA */}
      {activeTab === 'security' && (
        <form onSubmit={handleSavePassword} style={styles.form}>
          <div style={styles.card(isMobile)}>
            <div style={styles.sectionTitle}>
              <Lock size={20} />
              <h3 style={styles.sectionTitleText}>Alterar Senha de Acesso</h3>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <Lock size={14} /> Senha Atual
              </label>
              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                style={styles.getInput()}
              />
            </div>

            <div style={styles.getGrid2Col(isMobile)}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <Shield size={14} /> Nova Senha
                </label>
                <input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  style={styles.getInput()}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <CheckCircle size={14} /> Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  style={styles.getInput()}
                />
              </div>
            </div>
          </div>

          <div style={styles.getActionsRow(isMobile)}>
            <button 
              type="submit" 
              disabled={isLoading} 
              style={styles.getButtonPrimary(isMobile, isLoading)}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};