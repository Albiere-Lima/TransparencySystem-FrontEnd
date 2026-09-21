import { GoogleLogin } from '@react-oauth/google';
import { api } from '../services/api';
import { styles } from '../styles/GoogleAuthButton.styles';

interface GoogleAuthButtonProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export function GoogleAuthButton({ onLoginSuccess }: GoogleAuthButtonProps) {
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const googleToken = credentialResponse.credential;

      const response = await api.post('/auth/google', { googleToken });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      onLoginSuccess(user, token);
    } catch (err) {
      console.error('Erro na autenticação:', err);
    }
  };

  const handleError = () => {
    console.error('Falha na autenticação com o Google');
  };

  return (
    <div style={styles.container}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}