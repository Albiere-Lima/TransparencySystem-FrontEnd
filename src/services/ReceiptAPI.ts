export interface ReceiptResponse {
  id: number;
  originalFileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const receiptService = {
  /**
   * Upload ou substituição de comprovante
   */
  async uploadReceipt(expenseId: number, file: File): Promise<ReceiptResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token'); // Ou seu gerenciador de token/AuthContext

    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}/receipt`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao enviar comprovante');
    }

    return response.json();
  },

  /**
   * Busca os dados do comprovante de uma despesa específica
   */
  async getReceipt(expenseId: number): Promise<ReceiptResponse> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}/receipt`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Comprovante não encontrado');
    }

    return response.json();
  },

  /**
   * Remove o comprovante associado a uma despesa
   */
  async deleteReceipt(expenseId: number): Promise<void> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}/receipt`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao remover comprovante');
    }
  },
};