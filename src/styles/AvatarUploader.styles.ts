export const styles = {
  container: {
    position: 'relative' as const,
    width: '96px',
    height: '96px',
    flexShrink: 0,
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '3px solid var(--border-color, #E2E8F0)',
    boxSizing: 'border-box' as const,
  },

  hiddenInput: {
    display: 'none',
  },

  getButton: (disabled?: boolean) => ({
    position: 'absolute' as const,
    bottom: '0',
    right: '0',
    backgroundColor: '#2563EB',
    color: '#FFF',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? ('not-allowed' as const) : ('pointer' as const),
    opacity: disabled ? 0.8 : 1,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
  }),
};