import { useState } from 'react';
import { Search, Plus, Trash2, Banknote, ListOrdered, Tag, X, PieChart, FileText } from 'lucide-react';
import { api } from '../services/api';
import { ExpenseChartModal } from '../modals/ExpenseChartModal.tsx';
import { styles } from '../styles/ManegementView.styles';
import { ReceiptModal } from '../modals/ReceiptModal.tsx';
import { useAuth } from '../contexts/AuthContext'; // Importação do usuário

interface Expense {
  id?: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  receiptUrl?: string | null; // Adicionado para suporte ao comprovante
}

interface ManagementViewProps {
  expenses: Expense[];
  onRefresh: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Eventos: { bg: '#FEF3C7', text: '#92400E' },
  Infraestrutura: { bg: '#D1FAE5', text: '#065F46' },
  Marketing: { bg: '#FFE4E6', text: '#9F1239' },
  'Recursos Humanos': { bg: '#FCE7F3', text: '#9D174D' },
  Suprimentos: { bg: '#E0E7FF', text: '#3730A3' },
  Tecnologia: { bg: '#F3E8FF', text: '#6B21A8' },
};

export function ManagementView({ expenses, onRefresh }: ManagementViewProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  // Estado para controlar qual despesa está com o modal de comprovante aberto
  const [selectedExpenseForReceipt, setSelectedExpenseForReceipt] = useState<Expense | null>(null);

  const [form, setForm] = useState<Expense>({
    description: '',
    amount: 0,
    category: 'Suprimentos',
    date: new Date().toISOString().split('T')[0],
  });

  const totalGasto = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRegistros = expenses.length;

  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoriaTop = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'TODAS' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id?: number) => {
    if (!id || !confirm('Deseja realmente excluir esta despesa?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      onRefresh();
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/expenses', form);
      onRefresh();
      setIsModalOpen(false);
      setForm({
        description: '',
        amount: 0,
        category: 'Suprimentos',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
    }
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <div>
          <h1 style={styles.headerTitle}>Painel de Despesas</h1>
          <p style={styles.headerSubtitle}>Exercício 2026 • Atualizado em 09/09/2026</p>
        </div>

        {/* Cards Responsivos */}
        <div style={styles.cardsGrid}>
          <div style={styles.totalSpentCard}>
            <span style={styles.cardLabel}>Total Gasto</span>
            <h2 style={styles.cardValue}>{formatBRL(totalGasto)}</h2>
            <div style={styles.cardIconWrapper}>
              <Banknote size="2.2vh" />
            </div>
          </div>

          <div style={styles.surfaceCard}>
            <span style={styles.surfaceCardLabel}>Total de Registros</span>
            <h2 style={styles.surfaceCardValue}>{totalRegistros}</h2>
            <div style={styles.surfaceCardIconWrapper}>
              <ListOrdered size="2.2vh" />
            </div>
          </div>

          <div style={styles.surfaceCard}>
            <span style={styles.surfaceCardLabel}>Categoria Top</span>
            <h2 style={styles.surfaceCardValue}>{categoriaTop}</h2>
            <div style={styles.surfaceCardIconWrapper}>
              <Tag size="2.2vh" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={styles.filtersRow}>
          <div style={styles.filtersGroup}>
            <div style={styles.searchInputWrapper}>
              <Search size="1.95vh" style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar por descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.categorySelect}
            >
              <option value="TODAS">Todas as Categorias</option>
              <option value="Eventos">Eventos</option>
              <option value="Infraestrutura">Infraestrutura</option>
              <option value="Marketing">Marketing</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Suprimentos">Suprimentos</option>
              <option value="Tecnologia">Tecnologia</option>
            </select>
          </div>

          <div style={styles.filtersGroup}>
            <button
              onClick={() => setIsChartModalOpen(true)}
              style={styles.chartBtn}
            >
              <PieChart size="1.95vh" /> Ver Gráfico
            </button>
            <ExpenseChartModal
              isOpen={isChartModalOpen}
              onClose={() => setIsChartModalOpen(false)}
              expenses={expenses}
            />
            
            <button
              onClick={() => setIsModalOpen(true)}
              style={styles.newExpenseBtn}
            >
              <Plus size="1.95vh" /> Nova Despesa
            </button>
          </div>
        </div>

        {/* Tabela de Despesas */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.thCell}>Data</th>
                <th style={styles.thCell}>Descrição</th>
                <th style={styles.thCell}>Categoria</th>
                <th style={styles.thCellRight}>Valor</th>
                <th style={styles.thCellCenter}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => {
                const badgeStyle = CATEGORY_COLORS[expense.category] || { bg: '#334155', text: 'var(--text-primary)' };
                return (
                  <tr key={expense.id} style={styles.tableRow}>
                    <td style={styles.tdDate}>{formatDate(expense.date)}</td>
                    <td style={{ ...styles.tdDesc, color: 'var(--text-secondary)' }}>{expense.description}</td>
                    <td style={styles.tdCategory}>
                      <span style={styles.getBadgeStyle(badgeStyle.bg, badgeStyle.text)}>
                        {expense.category}
                      </span>
                    </td>
                    <td style={styles.tdAmount}>
                      {formatBRL(expense.amount)}
                    </td>
                    <td style={styles.tdActions}>
                      <div style={styles.actionsGroup}>
                        <button
                          onClick={() => setSelectedExpenseForReceipt(expense)}
                          title="Ver / Anexar Comprovante"
                          style={styles.actionIconButton}
                        >
                          <FileText size="1.95vh" />
                        </button>

                        <button
                          onClick={() => handleDelete(expense.id)}
                          title="Excluir despesa"
                          style={styles.actionIconButton}
                        >
                          <Trash2 size="1.95vh" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredExpenses.length === 0 && (
            <div style={styles.emptyTableMessage}>
              Nenhuma despesa encontrada com os filtros atuais.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Comprovante (Isolado e chamado condicionalmente) */}
      <ReceiptModal
        isOpen={!!selectedExpenseForReceipt}
        onClose={() => setSelectedExpenseForReceipt(null)}
        protocol={selectedExpenseForReceipt?.id?.toString() || ''}
        receiptUrl={selectedExpenseForReceipt?.receiptUrl}
        userRole={user?.role || 'ROLE_USER'}
        onUploadSuccess={() => {
          onRefresh();
        }}
      />

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Cadastrar Nova Despesa</h3>
              <button onClick={() => setIsModalOpen(false)} style={styles.modalCloseBtn}>
                <X size="2.2vh" />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div>
                <label style={styles.fieldLabel}>Descrição</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  style={styles.fieldInput}
                />
              </div>
              <div>
                <label style={styles.fieldLabel}>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.amount || ''}
                  onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                  required
                  style={styles.fieldInput}
                />
              </div>
              <div>
                <label style={styles.fieldLabel}>Categoria</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={styles.fieldInput}
                >
                  {Object.keys(CATEGORY_COLORS).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button type="submit" style={styles.formSubmitBtn}>
                Salvar Despesa
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}