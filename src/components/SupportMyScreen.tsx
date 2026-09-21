import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  Send, 
  ArrowLeft, 
  Loader2, 
  Search,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../services/userIsMobile';
import { getStyles } from '../styles/SupportMyScreen.styles';

interface OuvidoriaMessage {
  id: number | string;
  sender: 'USER' | 'OUVIDORIA' | 'SYSTEM';
  content: string;
  createdAt: string;
}

interface UserManifestation {
  id?: number;
  protocol: string;
  type: string;
  title: string;
  description: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  createdAt: string;
  messages: OuvidoriaMessage[];
}

const normalizeManifestation = (raw: any): UserManifestation => {
  if (!raw) return {} as UserManifestation;

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

  const protocol = raw.protocol || raw.protocolo || (raw.id ? `PROT-${raw.id}` : 'SEM-PROTOCOLO');

  return {
    id: raw.id,
    protocol: String(protocol),
    type: raw.type || raw.tipo || 'OUTROS',
    title: raw.title || raw.titulo || raw.assunto || 'Sem título',
    description: raw.description || raw.descricao || '',
    status: raw.status ?? 'PENDENTE',
    createdAt: raw.createdAt || raw.dataCriacao || raw.criadoEm || raw.created_at || '',
    messages: normalizedMessages,
  };
};

export const UserManifestationsScreen: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  const [manifestations, setManifestations] = useState<UserManifestation[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMyManifestations = useCallback(async (isBackground = false) => {
    if (!user?.email) return;
    try {
      if (!isBackground) setIsLoading(true);
      if (!isBackground) setError(null);

      const response = await api.get(`/ouvidoria/users/${user.email}`);
      const rawList = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.content || []);

      const normalizedData = rawList.map(normalizeManifestation);
      setManifestations(normalizedData);
    } catch (err: any) {
      if (!isBackground) {
        setError(err.response?.data?.message || err.message || 'Erro ao conectar ao servidor.');
      }
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchMyManifestations(false);
  }, [fetchMyManifestations]);


const fetchActiveProtocolDetails = useCallback(async (protocol: string) => {
  try {

    const response = await api.get(`/ouvidoria/${protocol}`);
    const updatedItem = normalizeManifestation(response.data);

    setManifestations((prev) => {
      const current = prev.find((m) => m.protocol === protocol);


      if (
        current &&
        current.status === updatedItem.status &&
        current.messages.length === updatedItem.messages.length &&
        current.messages[current.messages.length - 1]?.id === updatedItem.messages[updatedItem.messages.length - 1]?.id
      ) {
        return prev; 
      }

      return prev.map((item) => (item.protocol === protocol ? updatedItem : item));
    });
  } catch (err) {
    console.error("Erro no polling do chat:", err);
  }
}, []);


useEffect(() => {
  if (!selectedProtocol) return;

  const intervalId = setInterval(() => {
    fetchActiveProtocolDetails(selectedProtocol);
  }, 3000);

  return () => clearInterval(intervalId);
}, [selectedProtocol, fetchActiveProtocolDetails]);

  const currentItem = manifestations.find((m) => m.protocol === selectedProtocol);

  useEffect(() => {
    if (selectedProtocol) {
      scrollToBottom();
    }
  }, [currentItem?.messages?.length, selectedProtocol]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedProtocol || isSending) return;

    const messageText = inputMessage;
    setInputMessage('');

    try {
      setIsSending(true);

      const response = await api.post(`/ouvidoria/${selectedProtocol}/messages`, {
        content: messageText,
        conteudo: messageText,
        sender: 'USER'
      });

      setManifestations((prev) =>
        prev.map((item) => {
          if (item.protocol !== selectedProtocol) return item;

          if (response.data && (response.data.protocol || response.data.protocolo || response.data.title || response.data.titulo)) {
            return normalizeManifestation(response.data);
          }

          const rawMsg = response.data;
          const newMsg: OuvidoriaMessage = {
            id: rawMsg?.id ?? Date.now(),
            sender: 'USER',
            content: rawMsg?.content || rawMsg?.conteudo || messageText,
            createdAt: rawMsg?.createdAt || rawMsg?.dataCriacao || 'Agora'
          };

          return {
            ...item,
            messages: [...(item.messages || []), newMsg]
          };
        })
      );
    } catch (err: any) {
      setInputMessage(messageText);
      alert(err.response?.data?.message || err.message || 'Erro ao enviar resposta.');
    } finally {
      setIsSending(false);
    }
  };

  const filteredItems = manifestations.filter((item) => {
    if (!item) return false;
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;

    const protocolStr = String(item.protocol ?? '').toLowerCase();
    const titleStr = String(item.title ?? '').toLowerCase();

    return protocolStr.includes(search) || titleStr.includes(search);
  });

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Minhas Manifestações</h1>
        <p style={styles.subtitle}>
          Acompanhe o andamento das suas solicitações e responda à equipe da Ouvidoria.
        </p>
      </div>

      {/* Alerta de Erro */}
      {error && (
        <div style={styles.errorAlert}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => fetchMyManifestations(false)} style={styles.retryBtn}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* VIEW DETALHADA / CHAT */}
      {selectedProtocol && currentItem ? (
        <div style={styles.chatContainer}>
          {/* Header do Chamado */}
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderTitleGroup}>
              <button onClick={() => setSelectedProtocol(null)} style={styles.backBtn} title="Voltar">
                <ArrowLeft size={20} />
              </button>
              <div>
                <div style={styles.chatHeaderTitle}>
                  <ShieldAlert size={18} color="#f59e0b" /> Protocolo: {currentItem.protocol}
                </div>
                <div style={styles.chatHeaderSubtitle}>
                  {currentItem.type} · Criado em {currentItem.createdAt}
                </div>
              </div>
            </div>

            <span style={styles.getStatusBadge(currentItem.status)}>
              {(currentItem.status ?? 'PENDENTE').replace('_', ' ')}
            </span>
          </div>

          {/* Resumo do Assunto */}
          <div style={styles.summaryBox}>
            <div style={styles.summaryTitle}>{currentItem.title}</div>
            <div style={styles.summaryDescription}>{currentItem.description}</div>
          </div>

          {/* Chat de Mensagens */}
          <div style={styles.chatMessagesBox}>
            {(currentItem.messages || []).length === 0 ? (
              <div style={styles.emptyMessages}>Nenhuma mensagem registrada.</div>
            ) : (
              (currentItem.messages || []).map((msg, index) => {
                const msgKey = msg.id ? `msg-${msg.id}` : `msg-idx-${index}`;

                if (msg.sender === 'SYSTEM') {
                  return (
                    <div key={msgKey} style={styles.systemMsgContainer}>
                      <span style={styles.systemMsgText}>{msg.content}</span>
                    </div>
                  );
                }

                const isUser = msg.sender === 'USER';

                return (
                  <div key={msgKey} style={styles.getBubbleContainer(isUser)}>
                    <div style={styles.getBubble(isUser)}>{msg.content}</div>
                    <span style={styles.bubbleMeta}>
                      {isUser ? 'Você' : 'Ouvidoria UFPB'} {msg.createdAt && `· ${msg.createdAt}`}
                    </span>
                  </div>
                );
              })
            )}
            {/* Elemento invisível para scroll automático */}
            <div ref={chatEndRef} />
          </div>

          {/* Envio de mensagem */}
          {currentItem.status !== 'CONCLUIDO' ? (
            <form onSubmit={handleSendMessage} style={styles.chatForm}>
              <input
                type="text"
                placeholder="Enviar novas informações ou resposta..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isSending}
                style={styles.chatInput}
              />
              <button type="submit" disabled={isSending} style={styles.getSendBtn(isSending)}>
                {isSending ? (
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Send size={16} />
                )}
                <span>Enviar</span>
              </button>
            </form>
          ) : (
            <div style={styles.concludedBox}>Este chamado foi concluído pela Ouvidoria.</div>
          )}
        </div>
      ) : (
        /* LISTA DE MANIFESTAÇÕES */
        <div>
          <div style={styles.searchContainer}>
            <Search size={16} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por protocolo ou título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {isLoading ? (
            <div style={styles.loadingBox}>
              <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={styles.emptyListCard}>
              <MessageSquare size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <div style={styles.emptyListTitle}>Nenhuma manifestação encontrada</div>
              <div style={styles.emptyListSub}>
                Quando você registrar uma denúncia, reclamação ou sugestão, ela aparecerá aqui.
              </div>
            </div>
          ) : (
            <div style={styles.listContainer}>
              {filteredItems.map((item, index) => {
                const itemKey = item.protocol ? `user-item-${item.protocol}` : `user-item-idx-${index}`;

                return (
                  <div
                    key={itemKey}
                    onClick={() => setSelectedProtocol(item.protocol)}
                    style={styles.listItem}
                  >
                    <div style={styles.listItemMain}>
                      <div style={styles.listItemHeader}>
                        <span style={styles.protocolBadge}>{item.protocol}</span>
                        <span style={styles.typeText}>• {item.type}</span>
                      </div>

                      <div style={styles.itemTitle}>{item.title}</div>

                      <div style={styles.itemMeta}>
                        <Clock size={12} /> {item.createdAt}
                      </div>
                    </div>

                    <div style={styles.itemRight}>
                      <span style={styles.getStatusBadge(item.status)}>
                        {(item.status ?? 'PENDENTE').replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};