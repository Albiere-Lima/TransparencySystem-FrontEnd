import React, { useState, useEffect, useCallback } from 'react';
import { Search, Send, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { useIsMobile } from '../services/userIsMobile';
import { getStyles } from '../styles/SupportAdminScreen.styles';

interface OuvidoriaMessage {
  id: number;
  sender: 'USER' | 'OUVIDORIA' | 'SYSTEM';
  content: string;
  createdAt: string;
}

interface Manifestation {
  id: number;
  protocol: string;
  type: string;
  title: string;
  description: string;
  isAnonymous: boolean;
  name?: string;
  email?: string;
  phone?: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  createdAt: string;
  messages: OuvidoriaMessage[];
}

const normalizeManifestation = (raw: any): Manifestation => {
  if (!raw) return {} as Manifestation;

  const rawMessages = raw.messages || raw.mensagens || [];
  
  const normalizedMessages: OuvidoriaMessage[] = rawMessages.map((msg: any, index: number) => {
    let sender = msg.sender || msg.remetente || 'USER';
    if (sender === 'USUARIO') sender = 'USER';
    if (sender === 'SISTEMA') sender = 'SYSTEM';

    return {
      id: msg.id ?? index + 1,
      sender: sender as 'USER' | 'OUVIDORIA' | 'SYSTEM',
      content: msg.content || msg.conteudo || msg.texto || '',
      createdAt: msg.createdAt || msg.dataCriacao || msg.criadoEm || '',
    };
  });

  const isAnon = raw.isAnonymous ?? raw.anonimo ?? raw.isAnonimo ?? false;
  const name = raw.name || raw.nome || (isAnon ? 'Anônimo' : 'Não informado');
  const protocol = raw.protocol || raw.protocolo || (raw.id ? `PROT-${raw.id}` : 'SEM-PROTOCOLO');

  return {
    id: raw.id,
    protocol: String(protocol),
    type: raw.type || raw.tipo || 'OUTROS',
    title: raw.title || raw.titulo || raw.assunto || 'Sem título',
    description: raw.description || raw.descricao || '',
    isAnonymous: Boolean(isAnon),
    name: name,
    email: raw.email || raw.mail || '',
    phone: raw.phone || raw.telefone || raw.celular || '',
    status: raw.status ?? 'PENDENTE',
    createdAt: raw.createdAt || raw.dataCriacao || raw.criadoEm || raw.created_at || '',
    messages: normalizedMessages,
  };
};

export const SupportAdminScreen: React.FC = () => {
  const [manifestations, setManifestations] = useState<Manifestation[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminInput, setAdminInput] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useIsMobile();
  const isDetailOpenMobile = isMobile && selectedProtocol !== null;
  const styles = getStyles(isMobile, isDetailOpenMobile);

  const fetchManifestations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get('/admin/ouvidoria');
      
      const rawList = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.content || []);
      
      const normalizedData = rawList.map(normalizeManifestation);
      setManifestations(normalizedData);

      if (normalizedData.length > 0 && !selectedProtocol && !isMobile) {
        setSelectedProtocol(normalizedData[0].protocol);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Acesso negado (403): Sua conta precisa de permissão Administrador (ROLE_ADMIN).');
      } else {
        setError(err.response?.data?.message || err.message || 'Erro de conexão com o servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedProtocol, isMobile]);

  useEffect(() => {
    fetchManifestations();
  }, []);

  const currentItem = manifestations.find((m) => m.protocol === selectedProtocol);

  const handleStatusChange = async (newStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO') => {
    if (!selectedProtocol) return;

    try {
      const response = await api.patch(`/admin/ouvidoria/${selectedProtocol}/status`, { 
        status: newStatus,
        novoStatus: newStatus
      });

      setManifestations((prev) =>
        prev.map((item) => {
          if (item.protocol !== selectedProtocol) return item;

          if (response.data && (response.data.protocol || response.data.protocolo)) {
            return normalizeManifestation(response.data);
          }

          return { ...item, status: newStatus };
        })
      );
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert('Erro 403: Permissão negada para alterar o status.');
      } else {
        alert(err.response?.data?.message || err.message || 'Não foi possível alterar o status.');
      }
    }
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminInput.trim() || !selectedProtocol || isSending) return;

    const messageText = adminInput;
    setAdminInput('');

    try {
      setIsSending(true);

      const response = await api.post(`/admin/ouvidoria/${selectedProtocol}/messages`, {
        content: messageText,
        conteudo: messageText
      });

      setManifestations((prev) =>
        prev.map((item) => {
          if (item.protocol !== selectedProtocol) return item;

          if (response.data && (response.data.protocol || response.data.protocolo || response.data.titulo)) {
            return normalizeManifestation(response.data);
          }

          const rawMsg = response.data;
          const newMsg: OuvidoriaMessage = {
            id: rawMsg?.id ?? Date.now(),
            sender: 'OUVIDORIA',
            content: rawMsg?.content || rawMsg?.conteudo || messageText,
            createdAt: rawMsg?.createdAt || rawMsg?.dataCriacao || 'Agora'
          };

          return {
            ...item,
            messages: [...item.messages, newMsg]
          };
        })
      );
    } catch (err: any) {
      setAdminInput(messageText);
      if (err.response?.status === 403) {
        alert('Erro 403: Usuário sem autorização ADMIN para enviar respostas.');
      } else {
        alert(err.response?.data?.message || err.message || 'Falha no envio da resposta.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const filteredItems = manifestations.filter((item) => {
    if (!item) return false;

    const matchesStatus = filterStatus === 'TODOS' || item.status === filterStatus;
    const search = searchTerm.toLowerCase().trim();

    if (!search) return matchesStatus;

    const protocolStr = String(item.protocol ?? '').toLowerCase();
    const titleStr = String(item.title ?? '').toLowerCase();
    const descStr = String(item.description ?? '').toLowerCase();
    const nameStr = String(item.name ?? '').toLowerCase();

    return matchesStatus && (
      protocolStr.includes(search) ||
      titleStr.includes(search) ||
      descStr.includes(search) ||
      nameStr.includes(search)
    );
  });

  useEffect(() => {
    if (!selectedProtocol) return;
  
    const intervalId = setInterval(() => {
      fetchManifestations();
    }, 1500);
  
    return () => clearInterval(intervalId);
  }, [selectedProtocol, fetchManifestations]);

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Gestão da Ouvidoria</h1>
        <p style={styles.subtitle}>
          Responda chamados, altere status e gerencie manifestações dos usuários.
        </p>
      </div>

      {/* Alerta de Erro */}
      {error && (
        <div style={styles.errorAlert}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={fetchManifestations} style={styles.retryBtn}>
            Tentar novamente
          </button>
        </div>
      )}

      <div style={styles.gridContainer}>
        {/* COLUNA ESQUERDA: LISTA */}
        <div style={styles.listColumn}>
          <div style={styles.searchHeader}>
            <div style={styles.searchBox}>
              <Search size={16} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar por protocolo ou título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.filterGroup}>
              {['TODOS', 'PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  style={styles.getFilterBtn(filterStatus === st)}
                >
                  {st === 'TODOS' ? 'Todos' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.listContent}>
            {isLoading ? (
              <div style={styles.loaderBox}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : filteredItems.length === 0 ? (
              <div style={styles.emptyBox}>
                Nenhuma manifestação encontrada.
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = item.protocol === selectedProtocol;
                const itemKey = item.id ? `manifestation-${item.id}` : `manifestation-${item.protocol || index}`;
                const safeStatus = (item.status ?? 'PENDENTE').replace('_', ' ');

                return (
                  <div
                    key={itemKey}
                    onClick={() => setSelectedProtocol(item.protocol)}
                    style={styles.getListItem(isSelected)}
                  >
                    <div style={styles.itemTopRow}>
                      <span style={styles.itemProtocol}>{item.protocol}</span>
                      <span style={styles.getStatusBadge(item.status)}>{safeStatus}</span>
                    </div>

                    <div style={styles.itemTitle}>{item.title}</div>

                    <div style={styles.itemFooter}>
                      <span>{item.type}</span>
                      <span>{item.isAnonymous ? '👤 Anônimo' : `👤 ${item.name}`}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: DETALHES E CHAT */}
        {currentItem ? (
          <div style={styles.chatColumn}>
            <div style={styles.chatHeader}>
              <div style={styles.chatTitleGroup}>
                {isMobile && (
                  <button
                    type="button"
                    onClick={() => setSelectedProtocol(null)}
                    style={styles.backBtnMobile}
                    title="Voltar à lista"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div>
                  <div style={styles.chatTitle}>{currentItem.title}</div>
                  <div style={styles.chatMeta}>
                    Protocolo: <strong>{currentItem.protocol}</strong> {currentItem.createdAt && `· Registrado em ${currentItem.createdAt}`}
                  </div>
                </div>
              </div>

              <div style={styles.statusSelectBox}>
                <span style={styles.statusLabel}>Status:</span>
                <select
                  value={currentItem.status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  style={styles.statusSelect}
                >
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                  <option value="CONCLUIDO">CONCLUÍDO</option>
                </select>
              </div>
            </div>

            <div style={styles.applicantBar}>
              <div>
                <strong>Solicitante:</strong> {currentItem.isAnonymous ? '👤 Anônimo' : `👤 ${currentItem.name}`}
              </div>
              {!currentItem.isAnonymous && currentItem.email && (
                <div><strong>E-mail:</strong> {currentItem.email}</div>
              )}
              {!currentItem.isAnonymous && currentItem.phone && (
                <div><strong>Telefone:</strong> {currentItem.phone}</div>
              )}
            </div>

            <div style={styles.messageList}>
              {(currentItem.messages || []).length === 0 ? (
                <div style={styles.emptyBox}>
                  Nenhuma mensagem registrada nesta manifestação.
                </div>
              ) : (
                currentItem.messages.map((msg, index) => {
                  const msgKey = msg.id ? `msg-${msg.id}` : `msg-idx-${index}`;

                  if (msg.sender === 'SYSTEM') {
                    return (
                      <div key={msgKey} style={styles.systemMsgWrapper}>
                        <span style={styles.systemMsgSpan}>{msg.content}</span>
                      </div>
                    );
                  }

                  const isAdmin = msg.sender === 'OUVIDORIA';

                  return (
                    <div key={msgKey} style={styles.getBubbleContainer(isAdmin)}>
                      <div style={styles.getBubble(isAdmin)}>
                        {msg.content}
                      </div>
                      <span style={styles.bubbleMeta}>
                        {isAdmin ? 'Ouvidoria (Você)' : (currentItem.isAnonymous ? 'Usuário Anônimo' : currentItem.name)} {msg.createdAt && `· ${msg.createdAt}`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendAdminMessage} style={styles.inputForm}>
              <input
                type="text"
                placeholder="Escreva uma resposta ao usuário..."
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                disabled={isSending}
                style={styles.inputField}
              />
              <button
                type="submit"
                disabled={isSending}
                style={styles.submitBtn(isSending)}
              >
                {isSending ? (
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Send size={16} />
                )}
                <span>Responder</span>
              </button>
            </form>
          </div>
        ) : (
          <div style={styles.noSelectionBox}>
            Nenhuma manifestação selecionada.
          </div>
        )}
      </div>
    </div>
  );
};