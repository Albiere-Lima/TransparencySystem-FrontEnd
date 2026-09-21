import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { styles } from '../styles/ExpenseChartModal.styles';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface Expense {
  id?: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Eventos': '#F59E0B', 
  'Tecnologia': '#8B5CF6', 
  'Infraestrutura': '#10B981', 
  'Recursos Humanos': '#EC4899', 
  'Suprimentos': '#3B82F6', 
  'Marketing': '#EF4444', 
};

const DEFAULT_COLORS = ['#6366F1', '#14B8A6', '#F43F5E', '#84CC16', '#EAB308'];

export const ExpenseChartModal: React.FC<ExpenseChartModalProps> = ({ isOpen, onClose, expenses }) => {
  if (!isOpen) return null;

  const { categoriesData } = useMemo(() => {
    const totals: Record<string, number> = {};
    let grandTotal = 0;

    expenses.forEach((expense) => {
      const amount = Number(expense.amount) || 0;
      totals[expense.category] = (totals[expense.category] || 0) + amount;
      grandTotal += amount;
    });

    const sortedCategories = Object.entries(totals)
      .map(([category, amount], index) => {
        const percentage = grandTotal > 0 ? (amount / grandTotal) * 100 : 0;
        const color = CATEGORY_COLORS[category] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

        return { category, amount, percentage, color };
      })
      .sort((a, b) => b.amount - a.amount);

    return { categoriesData: sortedCategories, totalExpenses: grandTotal };
  }, [expenses]);

  return (
    <div onClick={onClose} style={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} style={styles.modal}>
        {/* Cabeçalho */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Gráfico de Despesas</h2>
            <p style={styles.subtitle}>
              Distribuição por categoria · Exercício 2026
            </p>
          </div>
          <button type="button" onClick={onClose} style={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Gráfico Donut */}
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={categoriesData}
              innerRadius={60}
              outerRadius={90} 
              paddingAngle={0}
              dataKey="amount"
              nameKey="category"
            >
              {categoriesData.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                if (typeof value === 'number') {
                  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }
                return value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Lista Detalhada com Valores e Porcentagens */}
        <div style={styles.listContainer}>
          {categoriesData.map((item) => (
            <div key={item.category} style={styles.listItem}>
              {/* Esquerda: Indicador e Categoria */}
              <div style={styles.itemLeft}>
                <span style={styles.getCategoryDot(item.color)} />
                <span style={styles.categoryName}>{item.category}</span>
              </div>

              {/* Direita: Porcentagem e Valor formatado */}
              <div style={styles.itemRight}>
                <span style={styles.percentageText}>
                  {item.percentage.toFixed(1)}%
                </span>
                <span style={styles.amountText}>
                  {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};