export const styles = {
  container: (isMobile: boolean) => ({
    maxWidth: '960px',
    margin: '0 auto',
    padding: isMobile ? '16px 12px' : '24px 16px',
    boxSizing: 'border-box' as const,
  }),

  header: {
    marginBottom: '24px',
  },

  breadcrumb: {
    fontSize: '13px',
    color: 'var(--text-secondary, #6b7280)',
    marginBottom: '8px',
  },

  getBreadcrumbItem: (isClickable: boolean) => ({
    cursor: isClickable ? ('pointer' as const) : ('default' as const),
    textDecoration: isClickable ? 'underline' : 'none',
  }),

  title: (isMobile: boolean) => ({
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 'bold',
    margin: '0 0 6px 0',
    color: 'var(--text-secondary, #111827)',
  }),

  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--text-secondary, #6b7280)',
  },

  getAlert: (type: 'success' | 'error') => ({
    marginBottom: '20px',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: type === 'success' ? '#ecfdf5' : '#fef2f2',
    color: type === 'success' ? '#065f46' : '#991b1b',
    border: `1px solid ${type === 'success' ? '#a7f3d0' : '#fecaca'}`,
  }),

  tabsContainer: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid var(--border-color, #e5e7eb)',
    marginBottom: '24px',
    overflowX: 'auto' as const,
    whiteSpace: 'nowrap' as const,
  },

  getTabButton: (isActive: boolean, isMobile: boolean) => ({
    padding: isMobile ? '10px 12px' : '12px 16px',
    border: 'none',
    borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
    backgroundColor: 'transparent',
    color: isActive ? '#2563eb' : 'var(--text-secondary, #6b7280)',
    fontWeight: isActive ? 600 : 500,
    cursor: 'pointer' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: isMobile ? '13px' : '14px',
    transition: 'all 0.2s ease',
  }),

  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },

  card: (isMobile: boolean) => ({
    backgroundColor: 'var(--bg-surface, #ffffff)',
    padding: isMobile ? '16px' : '24px',
    borderRadius: '12px',
    border: '1px solid var(--border-color, #e5e7eb)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    minWidth: 0,
    boxSizing: 'border-box' as const,
  }),

  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  sectionTitleText: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-secondary, #111827)',
  },

  getGrid2Col: (isMobile: boolean) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '16px',
  }),

  getGrid3Col: (isMobile: boolean) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '16px',
  }),

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '6px',
    color: 'var(--text-secondary, #374151)',
  },

  getInput: (disabled?: boolean) => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #d1d5db)',
    backgroundColor: disabled ? 'var(--bg-primary, #f3f4f6)' : 'var(--bg-main, #ffffff)',
    color: 'var(--text-secondary, #111827)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    cursor: disabled ? ('not-allowed' as const) : ('text' as const),
  }),

  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #d1d5db)',
    backgroundColor: 'var(--bg-main, #ffffff)',
    color: 'var(--text-secondary, #111827)',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
  },

  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-color, #f3f4f6)',
    gap: '12px',
  },

  toggleInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  toggleTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: 'var(--text-secondary, #111827)',
    marginBottom: '2px',
  },

  toggleDescription: {
    fontSize: '12px',
    color: 'var(--text-secondary, #6b7280)',
  },

  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer' as const,
    accentColor: '#2563eb',
    flexShrink: 0,
  },

  getActionsRow: (isMobile: boolean) => ({
    display: 'flex',
    justifyContent: isMobile ? 'stretch' : 'flex-end',
  }),

  getButtonPrimary: (isMobile: boolean, disabled?: boolean) => ({
    width: isMobile ? '100%' : 'auto',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: disabled ? ('not-allowed' as const) : ('pointer' as const),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled ? 0.7 : 1,
  }),
};