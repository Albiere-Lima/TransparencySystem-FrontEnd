import React from 'react';

export const getStyles = (isMobile: boolean) => ({
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: isMobile ? '12px' : '24px 16px',
    color: 'var(--text-primary, #1e293b)',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  tabNav: {
    display: 'flex',
    gap: isMobile ? '8px' : '12px',
    marginBottom: isMobile ? '16px' : '24px',
    borderBottom: '1px solid var(--border-color, #e2e8f0)',
    paddingBottom: isMobile ? '8px' : '12px',
  },
  getTabBtn: (isActive: boolean): React.CSSProperties => ({
    flex: isMobile ? 1 : 'initial',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: isMobile ? '8px 12px' : '10px 18px',
    borderRadius: '8px',
    border: isActive
      ? '1px solid var(--primary-color, #2563eb)'
      : '1px solid var(--border-color, #e2e8f0)',
    backgroundColor: isActive
      ? 'var(--primary-color, #2563eb)'
      : 'var(--bg-surface, #ffffff)',
    color: isActive
      ? '#ffffff'
      : 'var(--text-secondary, #475569)',
    fontWeight: 700,
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
  }),
});