import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, IMAGES, CREATOR } from '../constants/theme';

interface WelcomeMessageProps {
  onSuggestionPress: (suggestion: string) => void;
}

const SUGGESTIONS = [
  { icon: 'chatbubble-outline', text: 'من أنت؟', query: 'من أنت؟ ومن صنعك؟' },
  { icon: 'camera-outline', text: 'حلل صورة', query: 'أريد تحليل صورة' },
  { icon: 'code-slash-outline', text: 'ساعدني في البرمجة', query: 'ساعدني في كتابة كود برمجي' },
  { icon: 'bulb-outline', text: 'أعطني فكرة', query: 'أعطني فكرة إبداعية لمشروع جديد' },
];

export default function WelcomeMessage({ onSuggestionPress }: WelcomeMessageProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: IMAGES.wolfLogo }} style={styles.logo} />
      
      <Text style={styles.title}>NJADI AI™</Text>
      <Text style={styles.subtitle}>مساعدك الذكي الجزائري</Text>
      
      <View style={styles.creatorBadge}>
        <Ionicons name="person" size={14} color={COLORS.gold} />
        <Text style={styles.creatorText}>صنعه {CREATOR.nameArabic}</Text>
      </View>
      
      <Text style={styles.description}>
        مرحباً بك! أنا نجادي، مساعدك الذكي. يمكنني مساعدتك في الإجابة على أسئلتك، 
        تحليل الصور، والمزيد. جرب أحد الاقتراحات أدناه أو اكتب سؤالك.
      </Text>
      
      <View style={styles.suggestionsContainer}>
        {SUGGESTIONS.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => onSuggestionPress(suggestion.query)}
            activeOpacity={0.7}
          >
            <Ionicons name={suggestion.icon as any} size={18} color={COLORS.primary} />
            <Text style={styles.suggestionText}>{suggestion.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: SPACING.xs,
    textShadowColor: COLORS.gold + '50',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
  },
  creatorText: {
    color: COLORS.gold,
    fontSize: FONTS.sizes.sm,
    marginLeft: SPACING.xs,
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  suggestionText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.sm,
    marginLeft: SPACING.xs,
  },
});
