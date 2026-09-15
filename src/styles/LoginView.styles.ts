export const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box' as const,
  },

  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#FFF',
    borderRadius: '16px',
    padding: '36px 32px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
    border: '1px solid #E2E8F0',
    boxSizing: 'border-box' as const,
  },

  header: {
    textAlign: 'center' as const,
    marginBottom: '28px',
  },

  headerIconWrapper: {
    width: '48px',
    height: '48px',
    backgroundColor: '#DBEAFE',
    color: '#2563EB',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
  },

  title: {
    margin: 0,
    fontSize: '24px',
    color: '#0F172A',
    fontWeight: 'bold',
  },

  subtitle: {
    margin: '6px 0 0 0',
    color: '#64748B',
    fontSize: '14px',
  },

  errorMessage: {
    backgroundColor: '#FEF2F2',
    color: '#991B1B',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
    border: '1px solid #FCA5A5',
    fontWeight: 500,
  },

  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },

  label: {
    display: 'block' as const,
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '6px',
  },

  inputWrapper: {
    position: 'relative' as const,
  },

  inputLeftIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94A3B8',
  },

  emailInput: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },

  passwordInput: {
    width: '100%',
    padding: '12px 40px 12px 40px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },

  togglePasswordButton: {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer' as const,
    color: '#94A3B8',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  getSubmitButton: (loading?: boolean) => ({
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: loading ? '#93C5FD' : '#2563EB',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: loading ? ('not-allowed' as const) : ('pointer' as const),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
    transition: 'background-color 0.2s',
  }),

  googleSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  googleLabel: {
    fontSize: '13px',
    color: '#64748B',
  },
};