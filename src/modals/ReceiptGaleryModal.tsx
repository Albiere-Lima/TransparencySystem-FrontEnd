import { useState } from 'react';
import { X, FileText, Upload, Trash2, ExternalLink } from 'lucide-react';
import { receiptService } from '../services/ReceiptAPI';
import { useAuth } from '../contexts/AuthContext';

interface Expense {
  id?: number;
  description: string;
  amount: number | string;
  date: string;
  category: string;
  receiptUrl?: string | null;
}

interface ReceiptGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  onRefresh?: () => void;
}

export function ReceiptGalleryModal({ isOpen, onClose, expenses, onRefresh }: ReceiptGalleryModalProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const [loadingExpenseId, setLoadingExpenseId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (expenseId: number, file: File) => {
    try {
      setLoadingExpenseId(expenseId);
      setError(null);
      await receiptService.uploadReceipt(expenseId, file);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar arquivo');
    } finally {
      setLoadingExpenseId(null);
    }
  };

  const handleDeleteReceipt = async (expenseId: number) => {
    if (!window.confirm('Deseja realmente remover este comprovante?')) return;

    try {
      setLoadingExpenseId(expenseId);
      setError(null);
      await receiptService.deleteReceipt(expenseId);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover arquivo');
    } finally {
      setLoadingExpenseId(null);
    }
  };

  const formatBRL = (value: number | string) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)',
        borderRadius: '12px', width: '100%', maxWidth: '640px', maxHeight: '85vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', margin: 0 }}>
            <FileText size={20} color="var(--primary-color)" /> Central de Comprovantes
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Feedback Alert */}
        {error && (
          <div style={{ padding: '10px 16px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Lista de Despesas e Comprovantes */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {expenses.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhuma despesa cadastrada.</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} style={{
                padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                backgroundColor: 'var(--input-bg)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{expense.description}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {expense.date} • {expense.category} • <strong>{formatBRL(expense.amount)}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {expense.receiptUrl ? (
                    <>
                      <a
                        href={expense.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          color: 'var(--primary-color)', fontSize: '13px', fontWeight: 700, textDecoration: 'none'
                        }}
                      >
                        Visualizar <ExternalLink size={14} />
                      </a>
                      {isAdmin && expense.id && (
                        <button
                          onClick={() => handleDeleteReceipt(expense.id!)}
                          disabled={loadingExpenseId === expense.id}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                          title="Excluir comprovante"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </>
                  ) : isAdmin && expense.id ? (
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px',
                      cursor: loadingExpenseId === expense.id ? 'not-allowed' : 'pointer',
                      fontSize: '12px', color: 'var(--text-primary)', fontWeight: 700
                    }}>
                      <Upload size={14} color="var(--primary-color)" />
                      {loadingExpenseId === expense.id ? 'Enviando...' : 'Anexar'}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        style={{ display: 'none' }}
                        disabled={loadingExpenseId === expense.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && expense.id) handleFileUpload(expense.id, file);
                        }}
                      />
                    </label>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Sem anexo</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}