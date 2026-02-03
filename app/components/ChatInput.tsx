import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

interface ChatInputProps {
  onSend: (message: string) => void;
  onCameraPress: () => void;
  onVoicePress: () => void;
  isLoading: boolean;
  isRecording: boolean;
}

export default function ChatInput({ 
  onSend, 
  onCameraPress, 
  onVoicePress, 
  isLoading,
  isRecording 
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onCameraPress}
          disabled={isLoading}
        >
          <Ionicons 
            name="camera" 
            size={24} 
            color={isLoading ? COLORS.textMuted : COLORS.primary} 
          />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="اكتب رسالتك هنا..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          maxLength={2000}
          editable={!isLoading}
          onSubmitEditing={handleSend}
        />
        
        <TouchableOpacity 
          style={styles.voiceButton} 
          onPress={onVoicePress}
          disabled={isLoading}
        >
          <Ionicons 
            name="mic" 
            size={24} 
            color={isLoading ? COLORS.textMuted : COLORS.error} 
          />
        </TouchableOpacity>

        
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            (!message.trim() || isLoading) && styles.sendButtonDisabled
          ]} 
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Ionicons name="send" size={20} color={COLORS.background} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 25,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.error + '15',
    borderRadius: 20,
  },

  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    textAlign: 'right',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
});
