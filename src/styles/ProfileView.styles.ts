export const getStyles = (isMobile: boolean) => ({
  container: {
    minHeight: '100dvh',
    padding: isMobile ? '16px' : '24px 40px',
    maxWidth: '1000px',
    margin: '0 auto',
    color: 'var(--text-secondary)',
    boxSizing: 'border-box' as const,
  },

  header: {
    marginBottom: isMobile ? '16px' : '24px',
  },

  breadcrumbNav: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },

  getBreadcrumbLink: (isClickable?: boolean) => ({
    cursor: isClickable ? ('pointer' as const) : ('default' as const),
  }),

  breadcrumbCurrent: {
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },

  title: {
    margin: 0,
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 'bold',
  },

  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },

  getFeedbackMessage: (type: 'success' | 'error') => ({
    marginBottom: '20px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor:
      type === 'success'
        ? 'rgba(34, 197, 94, 0.15)'
        : 'rgba(239, 68, 68, 0.15)',
    color: type === 'success' ? '#16A34A' : '#DC2626',
    border: `1px solid ${type === 'success' ? '#22C55E' : '#EF4444'}`,
  }),

  contentWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: isMobile ? '16px' : '24px',
  },

  avatarCard: {
    background: 'var(--bg-surface)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    padding: isMobile ? '16px' : '24px',
    display: 'flex',
    flexDirection: isMobile ? ('column' as const) : ('row' as const),
    alignItems: 'center',
    textAlign: isMobile ? ('center' as const) : ('left' as const),
    gap: isMobile ? '16px' : '24px',
  },

  avatarWrapper: {
    position: 'relative' as const,
  },

  avatarImage: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '2px solid var(--border-color)',
  },

  getAvatarInitials: (backgroundColor: string) => ({
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    backgroundColor,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
  }),

  cameraButton: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color, #3B82F6)',
    border: '2px solid var(--bg-surface)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as const,
  },

  avatarDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: isMobile ? 'center' : 'flex-start',
    gap: '12px',
  },

  displayNameText: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
  },

  emailText: {
    margin: '2px 0 0 0',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },

  avatarActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    justifyContent: isMobile ? 'center' : 'flex-start',
    flexWrap: 'wrap' as const,
    position: 'relative' as const,
  },

  changePhotoButton: {
    backgroundColor: 'var(--primary-color, #3B82F6)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer' as const,
  },

  removePhotoButton: {
    backgroundColor: 'transparent',
    color: '#DC2626',
    border: '1px solid #EF4444',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer' as const,
  },

  colorPickerTriggerButton: {
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer' as const,
  },

  getColorDot: (color: string) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
  }),

  colorPickerDropdown: {
    position: 'absolute' as const,
    top: 'calc(100% + 8px)',
    left: isMobile ? '50%' : '120px',
    transform: isMobile ? 'translateX(-50%)' : 'none',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '8px',
    display: 'flex',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 10,
  },

  getColorSwatchButton: (color: string, isSelected: boolean) => ({
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: color,
    border: isSelected ? '2px solid var(--text-primary)' : 'none',
    cursor: 'pointer' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  formCard: {
    background: 'var(--bg-surface)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    padding: isMobile ? '16px' : '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },

  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },

  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: '20px',
  },

  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },

  input: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    outline: 'none',
  },

  initialsInput: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    outline: 'none',
  },

  fieldHint: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },

  textarea: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
  },

  formFooter: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
    display: 'flex',
    justifyContent: isMobile ? 'stretch' : 'flex-end',
  },

  getSubmitButton: (loading?: boolean) => ({
    backgroundColor: 'var(--primary-color, #3B82F6)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 600,
    width: isMobile ? '100%' : 'auto',
    justifyContent: 'center',
    cursor: loading ? ('not-allowed' as const) : ('pointer' as const),
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    opacity: loading ? 0.7 : 1,
  }),
});