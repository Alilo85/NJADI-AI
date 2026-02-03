import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp?: Date;
}

export default function ChatMessage({ role, content, imageUrl, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';
  
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>🐺</Text>
        </View>
      )}
      
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.messageImage} resizeMode="cover" />
        )}
        <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
          {content}
        </Text>
        {timestamp && (
          <Text style={styles.timestamp}>
            {timestamp.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
      
      {isUser && (
        <View style={[styles.avatarContainer, styles.userAvatar]}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  userAvatar: {
    borderColor: COLORS.gold,
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  aiBubble: {
    backgroundColor: COLORS.aiBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  messageText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  aiText: {
    color: COLORS.textPrimary,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  timestamp: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    alignSelf: 'flex-end',
  },
});
