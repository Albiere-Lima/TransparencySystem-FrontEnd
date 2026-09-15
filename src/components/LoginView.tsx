import { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthButton } from './GoogleAuthButton';
import { styles } from '../styles/LoginView.styles';

export function LoginView() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = (userData: any, token: string) => {
    login(token, userData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('users/login', { email, password });
      const { token, user } = response.data;
      login(token, user);
    } catch (err: any) {
      console.error('Erro ao realizar login:', err);
      setError(err.response?.data?.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerIconWrapper}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={styles.title}>Acessar Conta</h2>
          <p style={styles.subtitle}>
            Digite suas credenciais para continuar
          </p>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>E-mail</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputLeftIcon} />
              <input
                type="email"
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.emailInput}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Senha</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputLeftIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePasswordButton}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.getSubmitButton(loading)}
          >
            {loading ? (
              'Entrando...'
            ) : (
              <>
                <LogIn size={18} /> Entrar
              </>
            )}
          </button>

          <div style={styles.googleSection}>
            <span style={styles.googleLabel}>
              Vincular ou atualizar com Conta Google:
            </span>
            <GoogleAuthButton onLoginSuccess={handleGoogleSuccess} />
          </div>
        </form>
      </div>
    </div>
  );
}