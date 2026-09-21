import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PieChart as PieIcon, BarChart3 as BarIcon, ListFilter, FileText } from 'lucide-react';
import { styles } from '../styles/AnalyticsView.styles';
import { ReceiptModal } from '../modals/ReceiptModal.tsx';
import { useAuth } from '../contexts/AuthContext';

interface Expense {
  id?: number;
  description: string;
  amount: number | string;
  date: string;
  category: string;
  receiptUrl?: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  Eventos: '#F59E0B',
  Infraestrutura: '#10B981',
  Marketing: '#EC4899',
  'Recursos Humanos': '#F43F5E',
  Suprimentos: '#3B82F6',
  Tecnologia: '#8B5CF6',
};

const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

function getCenteredMonthsWindow() {
  const months = [];
  const now = new Date();

  for (let i = -5; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthName = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    const year = d.getFullYear();
    const monthNum = String(d.getMonth() + 1).padStart(2, '0');
    const key = `${year}-${monthNum}`;

    months.push({ key, label: formattedMonth });
  }

  return months;
}

export function AnalyticsView({ expenses, onRefresh }: { expenses: Expense[]; onRefresh?: () => void }) {
  const { user } = useAuth();
  const [selectedExpenseForReceipt, setSelectedExpenseForReceipt] = useState<Expense | null>(null);

  const formatBRL = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const categoryData = Object.entries(
    expenses.reduce((acc, item) => {
      const cat = item.category ? item.category.trim() : 'Outros';
      acc[cat] = (acc[cat] || 0) + Number(item.amount || 0);
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const categorySummary = categoryData
    .map((item) => ({
      ...item,
      percentage: totalAmount > 0 ? (item.value / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const monthWindow = getCenteredMonthsWindow();
  
  const expenseMap = expenses.reduce((acc, item) => {
    if (!item.date) return acc;
    const yearMonth = item.date.substring(0, 7);
    acc[yearMonth] = (acc[yearMonth] || 0) + Number(item.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = monthWindow.map((m) => ({
    month: m.label,
    total: expenseMap[m.key] || 0,
  }));

  const hasData = expenses.length > 0;

  const formatYAxis = (val: number) => {
    if (val === 0) return 'R$ 0';
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
    return `R$ ${val}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.chartsGrid}>
        {/* Card 1: Distribuição por Categoria */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Distribuição por Categoria</h3>
          
          {hasData ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatBRL(Number(value) || 0), 'Gasto']} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={styles.legendWrapper}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={styles.emptyContainer}>
              <PieIcon size={48} strokeWidth={1.5} style={styles.emptyIcon} />
              <p style={styles.emptyText}>Nenhuma despesa para listar</p>
            </div>
          )}
        </div>

        {/* Card 2: Evolução Mensal */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Evolução Mensal de Gastos</h3>
          
          {hasData ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} interval={0} style={styles.xAxisStyle} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} width={65} style={styles.yAxisStyle} />
                <Tooltip formatter={(value) => [formatBRL(Number(value) || 0), 'Total']} />
                <Bar dataKey="total" fill="var(--primary-color)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={styles.emptyContainer}>
              <BarIcon size={48} strokeWidth={1.5} style={styles.emptyIcon} />
              <p style={styles.emptyText}>Sem dados de evolução mensal</p>
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Resumo por Categoria */}
      <div style={styles.card}>
        <div style={{ ...styles.summaryHeader, color: 'var(--text-secondary)' }}>
          <h3 style={styles.summaryTitle}>Resumo por Categoria</h3>
          <span style={styles.summaryTotalText}>
            Total: {formatBRL(totalAmount)}
          </span>
        </div>

        {hasData ? (
          <div style={styles.summaryList}>
            {categorySummary.map((item, idx) => {
              const color = CATEGORY_COLORS[item.name] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
              return (
                <div key={item.name} style={styles.summaryItem}>
                  <div style={{ ...styles.summaryCategoryCol, color: 'var(--text-secondary)' }}>
                    <span style={styles.getCategoryDot(color)} />
                    <span style={styles.categoryName}>{item.name}</span>
                  </div>

                  <div style={styles.progressBarTrack}>
                    <div style={styles.getProgressBarFill(item.percentage, color)} />
                  </div>

                  <span style={styles.percentageText}>
                    {item.percentage.toFixed(1)}%
                  </span>

                  <span style={{ ...styles.amountText, color: 'var(--text-secondary)' }}>
                    {formatBRL(item.value)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptySummary}>
            <ListFilter size={36} strokeWidth={1.5} style={styles.emptyIcon} />
            <p style={styles.emptyText}>Nenhum resumo por categoria disponível</p>
          </div>
        )}
      </div>

      {/* Modal de Comprovante integrado */}
      <ReceiptModal
        isOpen={!!selectedExpenseForReceipt}
        onClose={() => setSelectedExpenseForReceipt(null)}
        protocol={selectedExpenseForReceipt?.id?.toString() || ''}
        receiptUrl={selectedExpenseForReceipt?.receiptUrl}
        userRole={user?.role || 'ROLE_USER'}
        onUploadSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </div>
  );
}