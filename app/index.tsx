import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  Alert
} from 'react-native';
import { Audio } from 'expo-av';
import { COLORS, SPACING } from './constants/theme';
import { supabase, supabaseUrl, supabaseKey } from './lib/supabase';

// Components
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import WelcomeMessage from './components/WelcomeMessage';
import SettingsModal from './components/SettingsModal';
import InfoModal from './components/InfoModal';
import HistoryModal from './components/HistoryModal';
import CameraModal from './components/CameraModal';
import GreetingBanner from './components/GreetingBanner';
import VoiceRecordingModal from './components/VoiceRecordingModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function Index() {
  // App state
  const [showSplash, setShowSplash] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Modal states
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showVoiceRecording, setShowVoiceRecording] = useState(false);
  
  // Settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState('ar');
  
  // History
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Refs
  const flatListRef = useRef<FlatList>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Initialize app
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Handle splash finish
  const handleSplashFinish = () => {
    setShowSplash(false);
    setShowGreeting(true);
    
    // Auto-dismiss greeting after 5 seconds
    setTimeout(() => {
      setShowGreeting(false);
    }, 5000);
  };

  // Create new conversation
  const createConversation = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{ title: 'محادثة جديدة', language }])
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  // Save message to database
  const saveMessage = async (conversationId: string, role: string, content: string, imageUrl?: string) => {
    try {
      await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role,
          content,
          image_url: imageUrl
        }]);
      
      // Update conversation title if it's the first user message
      if (role === 'user' && messages.length === 0) {
        const title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        await supabase
          .from('conversations')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      } else {
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Load conversations
  const loadConversations = async () => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load conversation messages
  const loadConversationMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const loadedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        imageUrl: msg.image_url,
        timestamp: new Date(msg.created_at)
      }));
      
      setMessages(loadedMessages);
      setCurrentConversationId(conversationId);
      setShowHistory(false);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);
      
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversationId === conversationId) {
        setMessages([]);
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  // Send message
  const sendMessage = async (text: string, imageBase64?: string, imageUri?: string) => {
    if (!text.trim() && !imageBase64) return;
    
    setIsLoading(true);
    
    // Create conversation if needed
    let convId = currentConversationId;
    if (!convId) {
      convId = await createConversation();
      if (!convId) {
        setIsLoading(false);
        Alert.alert('خطأ', 'فشل في إنشاء المحادثة');
        return;
      }
      setCurrentConversationId(convId);
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      imageUrl: imageUri,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    await saveMessage(convId, 'user', text, imageUri);
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    try {
      // Call AI function
      const { data, error } = await supabase.functions.invoke('njadi-chat', {
        body: {
          message: text,
          conversationHistory: messages.slice(-10),
          imageBase64
        }
      });
      
      if (error) throw error;
      
      const aiResponse = data.response || 'عذراً، حدث خطأ. حاول مرة أخرى.';
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      await saveMessage(convId, 'assistant', aiResponse);
      
      // Play voice if enabled
      if (voiceEnabled) {
        playVoice(aiResponse);
      }
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Play voice
  const playVoice = async (text: string) => {
    try {
      // Unload previous sound
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/njadi-speech`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ text: text.substring(0, 500) }),
        }
      );
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          
          const { sound } = await Audio.Sound.createAsync(
            { uri: base64data },
            { shouldPlay: true }
          );
          
          soundRef.current = sound;
        };
        
        reader.readAsDataURL(audioBlob);
      }
    } catch (error) {
      console.log('Voice playback error:', error);
    }
  };

  // Transcribe audio
  const transcribeAudio = async (audioBase64: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('njadi-transcribe', {
        body: { audioBase64 }
      });
      
      if (error) throw error;
      
      return data.transcription || '';
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  };

  // Handle voice transcription complete
  const handleTranscriptionComplete = (text: string) => {
    if (text.trim()) {
      sendMessage(text);
    }
  };

  // Handle camera capture
  const handleCameraCapture = (imageBase64: string, imageUri: string) => {
    sendMessage('حلل هذه الصورة وأخبرني ماذا ترى فيها', imageBase64, imageUri);
  };

  // Handle voice recording
  const handleVoicePress = () => {
    setShowVoiceRecording(true);
  };

  // Handle suggestion press
  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // Handle new conversation
  const handleNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setShowHistory(false);
  };

  // Handle history press
  const handleHistoryPress = () => {
    loadConversations();
    setShowHistory(true);
  };

  // Render message item
  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <ChatMessage
      role={item.role}
      content={item.content}
      imageUrl={item.imageUrl}
      timestamp={item.timestamp}
    />
  ), []);

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <Header
          onHistoryPress={handleHistoryPress}
          onSettingsPress={() => setShowSettings(true)}
          onInfoPress={() => setShowInfo(true)}
        />
        
        {/* Greeting Banner */}
        <GreetingBanner 
          visible={showGreeting} 
          onDismiss={() => setShowGreeting(false)} 
        />
        
        {/* Chat Area */}
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <WelcomeMessage onSuggestionPress={handleSuggestionPress} />
            }
            ListFooterComponent={isLoading ? <TypingIndicator /> : null}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
          />
        </View>
        
        {/* Input Area */}
        <ChatInput
          onSend={sendMessage}
          onCameraPress={() => setShowCamera(true)}
          onVoicePress={handleVoicePress}
          isLoading={isLoading}
          isRecording={isRecording}
        />
        
        {/* Modals */}
        <SettingsModal
          visible={showSettings}
          onClose={() => setShowSettings(false)}
          voiceEnabled={voiceEnabled}
          onVoiceToggle={setVoiceEnabled}
          language={language}
          onLanguageChange={setLanguage}
        />
        
        <InfoModal
          visible={showInfo}
          onClose={() => setShowInfo(false)}
        />
        
        <HistoryModal
          visible={showHistory}
          onClose={() => setShowHistory(false)}
          conversations={conversations}
          onSelectConversation={loadConversationMessages}
          onNewConversation={handleNewConversation}
          onDeleteConversation={deleteConversation}
          isLoading={historyLoading}
        />
        
        <CameraModal
          visible={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={handleCameraCapture}
        />
        
        <VoiceRecordingModal
          visible={showVoiceRecording}
          onClose={() => setShowVoiceRecording(false)}
          onTranscriptionComplete={handleTranscriptionComplete}
          onTranscribe={transcribeAudio}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
    width: '100%',
  },
  chatContainer: {
    flex: 1,
    width: '100%',
  },
  messageList: {
    flexGrow: 1,
    paddingVertical: SPACING.md,
  },
});
