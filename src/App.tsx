import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { api } from './services/api';

import { Header } from './components/Header';
import { SubHeaderNav } from './components/SubHeaderNav';
import { LoginView } from './components/LoginView';
import { ManagementView } from './components/ManagementView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProfileView } from './components/ProfileView';
import { AccountSettings } from './components/AccountSettingsView';
import { SupportAdminScreen } from './components/SupportAdminScreen';
import { OuvidoriaMainPage } from './components/OuvidoriaMainPage';

import { styles } from './styles/App.styles';

export type ViewType = 'admin' | 'analytics' | 'profile' | 'account' | 'support' | 'supportAdm';

function DashboardContent() {
  const { user } = useAuth(); 

  const [currentView, setCurrentView] = useState<ViewType>(() =>
    user?.role === 'ROLE_ADMIN' ? 'admin' : 'analytics'
  );
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error('Erro ao carregar despesas:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div style={styles.container}>
      <Header
        userName={user?.name}
        userRole={user?.role}
        setCurrentView={setCurrentView}
      />
      <SubHeaderNav activeTab={currentView} setActiveTab={setCurrentView} />
      <main style={styles.mainContent}>
        {currentView === 'admin' && (
          <div style={styles.viewWrapper}>
            <ManagementView expenses={expenses} onRefresh={fetchExpenses} />
          </div>
        )}

        {currentView === 'account' && (
          <div style={styles.viewWrapper}>
            <AccountSettings
              onNavigateBack={() =>
                setCurrentView(user?.role === 'ROLE_ADMIN' ? 'admin' : 'analytics')
              }
            />
          </div>
        )}

        {currentView === 'analytics' && <AnalyticsView expenses={expenses} />}

        {currentView === 'profile' && (
          <ProfileView
            onNavigateBack={() =>
              setCurrentView(user?.role === 'ROLE_ADMIN' ? 'admin' : 'analytics')
            }
          />
        )}

        {currentView === 'support' && (
          <OuvidoriaMainPage />
        )}

        {currentView === 'supportAdm' && (
          <SupportAdminScreen />
        )}
      </main>
    </div>
  );
}

function MainRoutes() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardContent /> : <LoginView />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
          <MainRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}