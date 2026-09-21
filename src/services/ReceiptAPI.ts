import { api } from './api';

export const receiptService = {
  async uploadReceipt(expenseId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/expenses/${expenseId}/receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteReceipt(expenseId: number) {
    const response = await api.delete(`/expenses/${expenseId}/receipt`);
    return response.data;
  },
};