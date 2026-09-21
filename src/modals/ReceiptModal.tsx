import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Download, Loader2, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import { api } from '../services/api';
import { useIsMobile } from '../services/userIsMobile';
import { getStyles } from '../styles/ReceiptModal.styles';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'ROLE_ADMIN' | 'ROLE_USER' | string;
  protocol: string; // Representa o expenseId
  receiptUrl?: string | null;
  onUploadSuccess?: (newReceiptUrl: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  userRole,
  protocol,
  receiptUrl,
  onUploadSuccess,
}) => {
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAdmin = userRole === 'ROLE_ADMIN';

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreview(null);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('O ficheiro deve ter no máximo 5MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !isAdmin || isUploading) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);

      // Endpoint ajustado para corresponder ao ReceiptController do backend
      const response = await api.post(`/expenses/${protocol}/receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Extrai a URL devolvida no ReceiptResponseDTO
      const uploadedUrl = response.data?.fileUrl || preview || '';
      
      setSuccess('Comprovativo anexado com sucesso!');
      setSelectedFile(null);
      setPreview(null);

      if (onUploadSuccess && uploadedUrl) {
        onUploadSuccess(uploadedUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao enviar o comprovativo.');
    } finally {
      setIsUploading(false);
    }
  };

  const isPdf = receiptUrl?.toLowerCase().endsWith('.pdf');

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Cabeçalho */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <FileText size={20} color="var(--primary-color)" />
            <span>Comprovativo — Despesa #{protocol}</span>
          </div>
          <button onClick={onClose} style={styles.closeBtn} type="button" title="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Alertas */}
        {error && (
          <div style={styles.alertError}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={styles.alertSuccess}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <div style={styles.body}>
          {/* Secção 1: Visualização */}
          <div style={styles.section}>
            <span style={styles.sectionTitle}>Comprovativo Atual</span>
            
            {receiptUrl ? (
              <div style={styles.viewerBox}>
                {isPdf ? (
                  <div style={styles.pdfCard}>
                    <FileText size={40} color="#dc2626" />
                    <span>Documento PDF anexado</span>
                    <a 
                      href={receiptUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.downloadBtn}
                    >
                      <Download size={16} /> Descarregar PDF
                    </a>
                  </div>
                ) : (
                  <div style={styles.imagePreviewContainer}>
                    <img src={receiptUrl} alt="Comprovativo" style={styles.imagePreview} />
                    <a 
                      href={receiptUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.openExternalLink}
                    >
                      <Eye size={14} /> Abrir imagem original
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.emptyReceipt}>
                Nenhum comprovativo foi anexado a esta despesa até ao momento.
              </div>
            )}
          </div>

          {/* Secção 2: Upload (Exclusivo para ADMIN) */}
          {isAdmin && (
            <div style={styles.uploadSection}>
              <span style={styles.sectionTitle}>Adicionar / Substituir Comprovativo</span>
              
              <form onSubmit={handleUpload} style={styles.uploadForm}>
                <label style={styles.dropZone}>
                  <Upload size={24} color="var(--primary-color)" />
                  <span style={styles.dropText}>
                    {selectedFile ? selectedFile.name : 'Clique para selecionar um ficheiro (PNG, JPG, PDF)'}
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>

                {preview && (
                  <div style={styles.localPreviewBox}>
                    <span style={styles.previewLabel}>Pré-visualização da nova imagem:</span>
                    <img src={preview} alt="Prévia" style={styles.localPreviewImage} />
                  </div>
                )}

                {selectedFile && (
                  <button
                    type="submit"
                    disabled={isUploading}
                    style={styles.submitBtn(isUploading)}
                  >
                    {isUploading ? (
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Upload size={16} />
                    )}
                    <span>{isUploading ? 'Enviando...' : 'Confirmar Envio'}</span>
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};