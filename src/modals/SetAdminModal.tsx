import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, UserCheck, AlertCircle, Search } from 'lucide-react';
import { api } from '../services/api';

interface SetAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetAdminModal: React.FC<SetAdminModalProps> = ({ isOpen, onClose }) => {
  const [emailOrSiape, setEmailOrSiape] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ROLE_ADMIN' | 'ROLE_USER'>('ROLE_ADMIN');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmailOrSiape('');
      setSelectedRole('ROLE_ADMIN');
      setStatusMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrSiape.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor, informe o e-mail ou SIAPE do usuário.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      await api.put('/admin/set-role', null, {
        params: {
          email: emailOrSiape,
          role: selectedRole
        }
      });
      setStatusMessage({
        type: 'success',
        text: `Privilégio alterado com sucesso para ${emailOrSiape}!`,
      });
      setEmailOrSiape('');
    } catch (err: any) {
      console.error('Erro ao alterar privilégio:', err);
      const errorMessage =
        err.response?.data?.message || 'Falha ao alterar permissão do usuário. Verifique os dados e tente novamente.';
      
      setStatusMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface, #ffffff)',
          color: 'var(--text-secondary, #1f2937)',
          width: '100%',
          maxWidth: '480px',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-color, #e5e7eb)',
          overflow: 'hidden',
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color, #e5e7eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Gerenciar Administrador</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #6b7280)' }}>
                Defina ou remova privilégios administrativos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary, #6b7280)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {statusMessage && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: statusMessage.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                color: statusMessage.type === 'success' ? '#065F46' : '#991B1B',
                border: `1px solid ${statusMessage.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
              }}
            >
              {statusMessage.type === 'success' ? <UserCheck size={18} /> : <AlertCircle size={18} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Usuário (E-mail ou SIAPE)
            </label>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary, #9ca3af)',
                }}
              />
              <input
                type="text"
                placeholder="Ex: usuario@ufpb.br ou 1234567"
                value={emailOrSiape}
                onChange={(e) => setEmailOrSiape(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, #d1d5db)',
                  backgroundColor: 'var(--bg-main, #f9fafb)',
                  color: 'var(--text-secondary, #111827)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Nível de Acesso
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'ROLE_ADMIN' | 'ROLE_USER')}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #d1d5db)',
                backgroundColor: 'var(--bg-main, #f9fafb)',
                color: 'var(--text-secondary, #111827)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              <option value="ROLE_ADMIN">ROLE_ADMIN (Administrador Completo)</option>
              <option value="ROLE_USER">ROLE_USER (Discente / Usuário Comum)</option>
            </select>
          </div>

          {/* Botões de Ação */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '12px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color, #f3f4f6)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #d1d5db)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary, #374151)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Salvando...' : 'Aplicar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};