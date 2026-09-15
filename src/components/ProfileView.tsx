import React, { useState, useRef } from 'react';
import { Camera, Save, Check, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { getStyles } from '../styles/ProfileView.styles';
import { useIsMobile } from '../services/userIsMobile';



interface ProfileViewProps {
  onNavigateBack?: () => void;
}

const AVATAR_COLORS = [
  '#1E3A8A',
  '#2563EB',
  '#14532D',
  '#4C1D95',
  '#78350F',
  '#0F172A',
];

export function ProfileView({ onNavigateBack }: ProfileViewProps) {
  const styles = getStyles(useIsMobile());
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultInitials =
    user?.initials ||
    user?.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ||
    'User'
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const [displayName, setDisplayName] = useState(user?.name || 'Seu Nome');
  const [department, setDepartment] = useState(user?.department || 'Estudante');
  const [initials, setInitials] = useState(user?.initials || defaultInitials);
  const [bio, setBio] = useState(
    user?.bio || 'Estudante de LCC no Campus IV da Paraíba.'
  );
  const [avatarColor, setAvatarColor] = useState(
    user?.avatarColor || '#1E3A8A'
  );

  const [pictureUrl, setPictureUrl] = useState<string | null>(
    user?.picture || null
  );

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setPictureUrl(compressedBase64);
        setFeedback({
          type: 'success',
          message: 'Imagem carregada e otimizada!',
        });
      } catch (err) {
        setFeedback({ type: 'error', message: 'Erro ao processar imagem.' });
      }
    }
  };

  const handleRemovePhoto = () => {
    setPictureUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFeedback({
      type: 'success',
      message: 'Foto removida. O avatar com iniciais será exibido.',
    });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const payload = {
      name: displayName,
      department: department,
      initials: initials,
      bio: bio,
      avatarColor: avatarColor,
      picture: pictureUrl,
    };

    try {
      const response = await api.put(`/users/${user?.id}/profile`, payload);

      if (updateUser) {
        updateUser(response.data);
      }
      setFeedback({
        type: 'success',
        message: 'Perfil salvo com sucesso no servidor!',
      });
    } catch (err: any) {
      console.error(
        'Erro detalhado da API:',
        err.response?.data || err.message
      );
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Erro ao salvar o perfil.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Breadcrumb e Título */}
      <div style={styles.header}>
        <nav style={styles.breadcrumbNav}>
          <span
            onClick={onNavigateBack}
            style={styles.getBreadcrumbLink(!!onNavigateBack)}
          >
            Dashboard
          </span>
          {' > '}
          <span style={styles.breadcrumbCurrent}>Meu Perfil</span>
        </nav>
        <h2 style={styles.title}>Meu Perfil</h2>
        <p style={styles.subtitle}>
          Gerencie sua foto e nome de exibição público
        </p>
      </div>

      {feedback && (
        <div style={styles.getFeedbackMessage(feedback.type)}>
          {feedback.message}
        </div>
      )}

      <div style={styles.contentWrapper}>
        {/* Card 1: Avatar e Foto */}
        <div style={styles.avatarCard}>
          <div style={styles.avatarWrapper}>
            {/* Se houver foto exibe a imagem, senão exibe o avatar com as iniciais */}
            {pictureUrl ? (
              <img
                src={pictureUrl}
                alt={displayName}
                style={styles.avatarImage}
              />
            ) : (
              <div style={styles.getAvatarInitials(avatarColor)}>
                {initials}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Alterar foto"
              style={styles.cameraButton}
            >
              <Camera size={14} />
            </button>
          </div>

          <div style={styles.avatarDetails}>
            <div>
              <h3 style={styles.displayNameText}>{displayName}</h3>
              <p style={styles.emailText}>
                {user?.email || 'ana.souza@ufpb.edu.br'}
              </p>
            </div>

            <div style={styles.avatarActions}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={styles.changePhotoButton}
              >
                Alterar foto
              </button>

              {pictureUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  style={styles.removePhotoButton}
                >
                  <Trash2 size={14} />
                  Remover
                </button>
              )}

              {!pictureUrl && (
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  style={styles.colorPickerTriggerButton}
                >
                  <span style={styles.getColorDot(avatarColor)} />
                  Cor do avatar
                </button>
              )}

              {showColorPicker && !pictureUrl && (
                <div style={styles.colorPickerDropdown}>
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setAvatarColor(color);
                        setShowColorPicker(false);
                      }}
                      style={styles.getColorSwatchButton(
                        color,
                        avatarColor === color
                      )}
                    >
                      {avatarColor === color && (
                        <Check size={12} color="#FFF" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Formulário */}
        <form onSubmit={handleSave} style={styles.formCard}>
          <h3 style={styles.sectionTitle}>Informações de Exibição</h3>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Nome de exibição</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={styles.input}
            />
            <span style={styles.fieldHint}>
              Aparece no cabeçalho e em publicações
            </span>
          </div>

          <div style={styles.fieldGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Departamento / Unidade</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Iniciais do avatar</label>
              <input
                type="text"
                maxLength={3}
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                style={styles.initialsInput}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Bio / Descrição</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formFooter}>
            <button
              type="submit"
              disabled={isLoading}
              style={styles.getSubmitButton(isLoading)}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isLoading ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}