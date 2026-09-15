import React, { useState } from 'react';
import { 
  Send, 
  Info, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldAlert,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../services/userIsMobile';
import { getStyles } from '../styles/SupportScreen.styles';

interface ChatMessage {
  id: string | number;
  sender: 'USER' | 'OUVIDORIA' | 'SYSTEM' | 'user' | 'ouvidoria' | 'system';
  content?: string;
  text?: string;
  createdAt?: string;
  timestamp?: string;
}

export const SupportScreen: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useAuth();
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!user?.email) {
      setIsSubmitting(false);
      return setErrorMessage('Usuário não autenticado. Por favor, faça login para enviar uma manifestação.');
    }

    console.log('Submitting Manifestation:', { isAnonymous, name, email: user.email, phone, category, title, description });
    const payload = {
      isAnonymous,
      name: isAnonymous ? undefined : name,
      email: user.email,
      phone: isAnonymous ? undefined : phone,
      type: category,
      title,
      description,
    };

    try {
      const response = await api.post('/ouvidoria', payload);

      if (!response.data) {
        throw new Error('Erro ao enviar a manifestação. Tente novamente.');
      }

      const data = await response.data;
      setActiveProtocol(data.protocol);

      const isChatCategory = category === 'RECLAMACAO' || category === 'DENUNCIA';

      if (isChatCategory) {
        setMessages(data.messages || []);
        setShowChat(true);
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha na conexão com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeProtocol || isSendingMessage) return;

    setIsSendingMessage(true);
    setErrorMessage(null);

    try {
      const response = await api.post(`/ouvidoria/${activeProtocol}/messages`, {
        content: inputMessage,
        conteudo: inputMessage,
      });

      if (!response.data) {
        throw new Error('Não foi possível enviar a mensagem.');
      }

      const updatedManifestation = await response.data;
      console.log('Updated Manifestation:', updatedManifestation);
      setMessages(updatedManifestation.messages || []);
      setInputMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao enviar mensagem.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const resetForm = () => {
    setShowChat(false);
    setIsSuccess(false);
    setActiveProtocol(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setErrorMessage(null);
  };

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Ouvidoria UFPB</h1>
        <p style={styles.subtitle}>
          Registre denúncias, reclamações, sugestões ou elogios. Sua voz importa.
        </p>
      </div>

      {/* Alerta de Erro Global */}
      {errorMessage && (
        <div style={styles.errorAlert}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MODO CHAT */}
      {showChat ? (
        <div style={styles.chatContainer}>
          {/* Header do Chat */}
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderTitleGroup}>
              <button onClick={resetForm} style={styles.backBtn} title="Voltar">
                <ArrowLeft size={20} />
              </button>
              <div>
                <div style={styles.chatHeaderTitle}>
                  <ShieldAlert size={18} color="#f59e0b" /> Protocolo: {activeProtocol}
                </div>
                <div style={styles.chatHeaderSubtitle}>
                  {category === 'DENUNCIA' ? 'Denúncia Sigilosa' : 'Reclamação Registrada'} · Em Atendimento
                </div>
              </div>
            </div>

            <button onClick={resetForm} style={styles.newManifestationBtn}>
              Nova Manifestação
            </button>
          </div>

          {/* Área de Mensagens */}
          <div style={styles.chatMessagesBox}>
            {messages.map((msg) => {
              const sender = (msg.sender || '').toLowerCase();
              const messageText = msg.content || msg.text;
              const time = msg.createdAt || msg.timestamp;

              if (sender === 'system') {
                return (
                  <div key={msg.id} style={styles.systemMsgContainer}>
                    <span style={styles.systemMsgText}>{messageText}</span>
                  </div>
                );
              }

              const isUser = sender === 'user';
              return (
                <div key={msg.id} style={styles.getBubbleContainer(isUser)}>
                  <div style={styles.getBubble(isUser)}>
                    {String(messageText)}
                  </div>
                  <span style={styles.bubbleMeta}>
                    {isUser ? (isAnonymous ? 'Você (Anônimo)' : 'Você') : 'Atendimento Ouvidoria'} · {String(time)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input do Chat */}
          <form onSubmit={handleSendMessage} style={styles.chatForm}>
            <input
              type="text"
              placeholder="Escreva uma mensagem..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isSendingMessage}
              style={styles.chatInput}
            />
            <button
              type="submit"
              disabled={isSendingMessage}
              style={styles.getSendBtn(isSendingMessage)}
            >
              {isSendingMessage ? (
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Send size={16} />
              )}
              <span>Enviar</span>
            </button>
          </form>
        </div>
      ) : isSuccess ? (
        /* Card de Sucesso */
        <div style={styles.successCard}>
          <CheckCircle2 size={56} color="#16a34a" style={{ marginBottom: '16px' }} />
          <h2 style={styles.successTitle}>Manifestação Enviada com Sucesso!</h2>
          <p style={styles.successText}>
            Seu protocolo para acompanhamento é: <strong>{activeProtocol}</strong>
          </p>
          <button onClick={resetForm} style={styles.successBtn}>
            Enviar Nova Manifestação
          </button>
        </div>
      ) : (
        /* ESTRUTURA DO FORMULÁRIO PRINCIPAL */
        <div style={styles.formLayout}>
          <form onSubmit={handleSubmit} style={styles.formContainer}>
            {/* Card 1: Manifestação Anônima */}
            <div style={styles.card}>
              <div style={styles.cardAnonHeader}>
                <div>
                  <div style={styles.cardAnonTitle}>Manifestação anônima</div>
                  <div style={styles.cardAnonDesc}>Seus dados de contato não serão enviados</div>
                </div>

                <label style={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    style={styles.toggleInput}
                  />
                  <span style={styles.getToggleTrack(isAnonymous)}>
                    <span style={styles.getToggleThumb(isAnonymous)} />
                  </span>
                </label>
              </div>
            </div>

            {/* Card 2: Dados de Contato */}
            <div style={styles.getContactCard(isAnonymous)}>
              <div style={styles.sectionHeader}>DADOS DE CONTATO</div>

              <div style={{ marginBottom: '14px' }}>
                <label style={styles.label}>Nome completo *</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  disabled={isAnonymous}
                  value={isAnonymous ? 'Anônimo' : name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  required={!isAnonymous}
                />
              </div>

              <div style={styles.contactGrid}>
                <div>
                  <label style={styles.label}>E-mail *</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    disabled={isAnonymous}
                    value={isAnonymous ? '' : email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required={!isAnonymous}
                  />
                </div>
                <div>
                  <label style={styles.label}>Telefone (opcional)</label>
                  <input
                    type="text"
                    placeholder="(83) 9 0000-0000"
                    disabled={isAnonymous}
                    value={isAnonymous ? '' : phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Detalhes da Manifestação */}
            <div style={styles.card}>
              <div style={styles.sectionHeader}>DETALHES DA MANIFESTAÇÃO</div>

              <div style={{ marginBottom: '14px' }}>
                <label style={styles.label}>Categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={styles.input}
                  required
                >
                  <option value="">Selecione uma categoria...</option>
                  <option value="SUGESTAO">💡 Sugestão</option>
                  <option value="ELOGIO">👏 Elogio</option>
                  <option value="RECLAMACAO">⚠️ Reclamação (Abre Mini Chat)</option>
                  <option value="DENUNCIA">🛡️ Denúncia (Abre Mini Chat)</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={styles.label}>Título *</label>
                <input
                  type="text"
                  maxLength={120}
                  placeholder="Resumo breve do assunto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={styles.input}
                  required
                />
                <div style={styles.fieldCounter}>{title.length}/120</div>
              </div>

              <div>
                <label style={styles.label}>Descrição detalhada *</label>
                <textarea
                  rows={5}
                  placeholder="Descreva com o máximo de detalhes possível..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...styles.input, resize: 'vertical' }}
                  required
                />
                <div style={styles.fieldCounter}>{description.length} caracteres</div>
              </div>
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={styles.getSubmitBtn(isSubmitting)}
            >
              {isSubmitting ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Send size={18} />
              )}
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Manifestação'}</span>
            </button>
          </form>

          {/* LATERAL */}
          <div style={styles.sidebar}>
            <div style={styles.card}>
              <div style={styles.sidebarTitle}>COMO FUNCIONA</div>
              <div style={styles.stepList}>
                <StepItem number="1" title="Preencha o formulário" description="Informe seus dados (opcional) e descreva a situação." />
                <StepItem number="2" title="Envio por e-mail" description="Sua manifestação é enviada diretamente à equipe responsável." />
                <StepItem number="3" title="Protocolo gerado" description="Guarde o número para acompanhar sua solicitação." />
                <StepItem number="4" title="Resposta em 30 dias" description="A ouvidoria retornará dentro do prazo legal." />
              </div>
            </div>

            <div style={styles.infoBox}>
              <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                Manifestações anônimas são válidas e recebem o mesmo tratamento. Porém, para que possamos retornar com a resposta, informe seu e-mail.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StepItem: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => {
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  return (
    <div style={styles.stepItemContainer}>
      <div style={styles.stepBadge}>{number}</div>
      <div>
        <div style={styles.stepTitle}>{title}</div>
        <div style={styles.stepDescription}>{description}</div>
      </div>
    </div>
  );
};