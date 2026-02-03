import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, IMAGES } from '../constants/theme';

interface HeaderProps {
  onHistoryPress: () => void;
  onSettingsPress: () => void;
  onInfoPress: () => void;
}

export default function Header({ onHistoryPress, onSettingsPress, onInfoPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.iconButton} onPress={onHistoryPress}>
          <Ionicons name="time-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.centerSection}>
        <Image source={{ uri: IMAGES.wolfLogo }} style={styles.logo} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>NJADI AI</Text>
          <Text style={styles.trademark}>™</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} onPress={onInfoPress}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
          <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  trademark: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gold,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
