export const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
    boxSizing: 'border-box' as const,
  },

  modal: {
    backgroundColor: 'var(--bg-surface, #FFFFFF)',
    color: 'var(--text-secondary, #0F172A)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--border-color, #E2E8F0)',
    padding: '24px',
    boxSizing: 'border-box' as const,
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },

  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  },

  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: 'var(--text-secondary, #64748B)',
  },

  closeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer' as const,
    padding: '6px',
    borderRadius: '8px',
    color: 'var(--text-secondary, #64748B)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chartWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    margin: '16px 0 24px 0',
  },

  svg: {
    transform: 'rotate(-90deg)',
  },

  circle: {
    transition: 'all 0.3s ease',
  },

  legendWrapper: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '12px 16px',
    marginTop: '16px',
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  getLegendBadge: (color: string) => ({
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    backgroundColor: color,
    flexShrink: 0,
  }),

  legendText: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },

  listContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-primary, #F8FAFC)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
  },

  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  getCategoryDot: (color: string) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
    flexShrink: 0,
  }),

  categoryName: {
    fontWeight: 500,
  },

  itemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  percentageText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },

  amountText: {
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: '14px',
  },
};