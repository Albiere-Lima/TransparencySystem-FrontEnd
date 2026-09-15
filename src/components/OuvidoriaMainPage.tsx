import React, { useState } from 'react';
import { SupportScreen } from './SupportScreen';
import { UserManifestationsScreen } from './SupportMyScreen';
import { PlusCircle, ListOrdered } from 'lucide-react';
import { useIsMobile } from '../services/userIsMobile';
import { getStyles } from '../styles/OuvidoriaMainPage.styles';

export const OuvidoriaMainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'MY_LIST'>('NEW');
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  return (
    <div style={styles.container}>
      {/* Botões de Navegação no Topo */}
      <div style={styles.tabNav}>
        <button
          type="button"
          onClick={() => setActiveTab('NEW')}
          style={styles.getTabBtn(activeTab === 'NEW')}
        >
          <PlusCircle size={isMobile ? 16 : 18} />
          <span>Nova Manifestação</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MY_LIST')}
          style={styles.getTabBtn(activeTab === 'MY_LIST')}
        >
          <ListOrdered size={isMobile ? 16 : 18} />
          <span>Minhas Manifestações</span>
        </button>
      </div>

      {/* Exibição da Tela Ativa */}
      {activeTab === 'NEW' ? <SupportScreen /> : <UserManifestationsScreen />}
    </div>
  );
};