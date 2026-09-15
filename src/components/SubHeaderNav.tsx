import React from 'react';
import type { ViewType } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface SubHeaderNavProps {
  activeTab: ViewType;
  setActiveTab: (tab: ViewType) => void;
}


export const SubHeaderNav: React.FC<SubHeaderNavProps> = ({ activeTab, setActiveTab }) => {


    const tabs: {label: string; id: ViewType}[] = [
    {label: 'Painel', id: useAuth().user?.role === "ROLE_ADMIN" ? 'admin' : 'analytics'},
    {label: 'Ouvidoria', id: useAuth().user?.role === "ROLE_ADMIN" ? 'supportAdm' : 'support'}
]

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid #e5e7eb',
      width: '100%',
      paddingLeft: '32px',
      paddingRight: '32px',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                color: isActive ? '#2563eb' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 600,
                padding: '12px 4px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};