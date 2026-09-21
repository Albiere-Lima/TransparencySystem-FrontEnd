import { api } from './api';

export interface ReceiptResponse {
  id: number;
  originalFileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

export const receiptService = {
  async uploadReceipt(expenseId: number, file: File): Promise<ReceiptResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ReceiptResponse>(`/expenses/${expenseId}/receipt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },

  async getReceipt(expenseId: number): Promise<ReceiptResponse> {
    const response = await api.get<ReceiptResponse>(`/expenses/${expenseId}/receipt`);
    return response.data;
  },

  async deleteReceipt(expenseId: number): Promise<void> {
    await api.delete(`/expenses/${expenseId}/receipt`);
  },
};