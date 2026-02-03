import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, IMAGES, CREATOR } from '../constants/theme';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const FEATURES = [
  { icon: 'chatbubbles', title: 'محادثات ذكية', description: 'تحدث معي بأي لغة وسأفهمك' },
  { icon: 'camera', title: 'تحليل الصور', description: 'أرسل صورة وسأحللها لك' },
  { icon: 'mic', title: 'إدخال صوتي', description: 'تحدث معي بصوتك' },
  { icon: 'volume-high', title: 'ردود صوتية', description: 'استمع لردودي بصوت طبيعي' },
  { icon: 'time', title: 'سجل المحادثات', description: 'احفظ محادثاتك للرجوع إليها' },
  { icon: 'language', title: 'متعدد اللغات', description: 'عربي، إنجليزي، فرنسي' },
];

export default function InfoModal({ visible, onClose }: InfoModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo and Title */}
            <View style={styles.headerSection}>
              <Image source={{ uri: IMAGES.wolfLogo }} style={styles.logo} />
              <View style={styles.titleRow}>
                <Text style={styles.title}>NJADI AI</Text>
                <Text style={styles.trademark}>™</Text>
              </View>
              <Text style={styles.subtitle}>مساعدك الذكي الجزائري</Text>
            </View>
            
            {/* Creator Section */}
            <View style={styles.creatorSection}>
              <View style={styles.creatorBadge}>
                <Ionicons name="person" size={20} color={COLORS.gold} />
                <Text style={styles.creatorLabel}>المطور</Text>
              </View>
              <Text style={styles.creatorName}>{CREATOR.nameArabic}</Text>
              <Text style={styles.creatorNameEn}>{CREATOR.name}</Text>
            </View>
            
            {/* Features Section */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>المميزات</Text>
              <View style={styles.featuresGrid}>
                {FEATURES.map((feature, index) => (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureIconContainer}>
                      <Ionicons name={feature.icon as any} size={24} color={COLORS.primary} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Disclaimer */}
            <View style={styles.disclaimerSection}>
              <Text style={styles.disclaimerText}>
                نجادي AI هو مساعد ذكي مطور بالكامل من طرف {CREATOR.nameArabic}. 
                جميع الحقوق محفوظة © 2026
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  container: {
    backgroundColor: COLORS.backgroundModal,
    borderRadius: 24,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
  },
  content: {
    padding: SPACING.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.lg,
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.gold,
    letterSpacing: 2,
  },
  trademark: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gold,
    marginTop: 4,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  creatorSection: {
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.xl,
    borderRadius: 16,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  creatorLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gold,
    marginLeft: SPACING.xs,
  },
  creatorName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  creatorNameEn: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  featuresSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  disclaimerSection: {
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  disclaimerText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
