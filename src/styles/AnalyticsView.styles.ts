export const styles = {
  container: {
    width: '100%',
    padding: '1rem',
    boxSizing: 'border-box' as const,
  },

  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
    width: '100%',
    marginBottom: '1rem',
  },

  
  card: {
    backgroundColor: 'var(--bg-surface, #ffffff)',
    borderRadius: '0.75rem',
    padding: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid var(--border-color, #e5e7eb)',
    width: '100%',
    minWidth: 0,       
    boxSizing: 'border-box' as const,
    overflow: 'hidden',
  },

  cardTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: 'var(--text-primary)',
  },

  legendWrapper: {
    paddingTop: '10px',
    fontSize: '12px',
  },

  emptyContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '280px',
    gap: '0.5rem',
  },

  emptyIcon: {
    color: 'var(--text-secondary, #9ca3af)',
  },

  emptyText: {
    color: 'var(--text-secondary, #6b7280)',
    fontSize: '0.875rem',
  },

  xAxisStyle: {
    fontSize: '0.75rem',
  },

  yAxisStyle: {
    fontSize: '0.75rem',
  },

  summaryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },

  summaryTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: 0,
  },

  summaryTotalText: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },

  summaryList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },

  summaryItem: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr 50px 90px',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
  },

  summaryCategoryCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    overflow: 'hidden',
  },

  getCategoryDot: (color: string) => ({
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    backgroundColor: color,
    flexShrink: 0,
  }),

  categoryName: {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  progressBarTrack: {
    width: '100%',
    height: '0.5rem',
    backgroundColor: 'var(--border-color, #e5e7eb)',
    borderRadius: '999px',
    overflow: 'hidden',
  },

  getProgressBarFill: (percentage: number, color: string) => ({
    width: `${Math.min(100, Math.max(0, percentage))}%`,
    height: '100%',
    backgroundColor: color,
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  }),

  percentageText: {
    textAlign: 'right' as const,
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },

  amountText: {
    textAlign: 'right' as const,
    fontWeight: 600,
  },

  emptySummary: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 0',
    gap: '0.5rem',
  },
};