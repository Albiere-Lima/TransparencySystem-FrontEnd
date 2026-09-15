import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../styles/AvatarUploader.styles';

export function AvatarUploader() {
  const { user, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result as string;

      try {

        const response = await fetch(`http://192.168.0.7:8080/api/users/${user.id}/avatar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ picture: base64Image }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          login(localStorage.getItem('token') || '', updatedUser);
        }
      } catch (err) {
        console.error('Erro ao atualizar foto de perfil:', err);
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <div style={styles.container}>
      {/* Imagem do Usuário */}
      <img
        src={user?.picture || 'https://via.placeholder.com/96'}
        alt="Foto de perfil"
        style={styles.avatar}
      />

      {/* Input para seleção de arquivo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={styles.hiddenInput}
      />

      {/* Botão circular de Alterar Foto */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        style={styles.getButton(uploading)}
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
      </button>
    </div>
  );
}