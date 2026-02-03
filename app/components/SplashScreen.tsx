import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions,
  ImageBackground 
} from 'react-native';
import { COLORS, FONTS, IMAGES, CREATOR } from '../constants/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const creatorFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Logo fade in and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Title fade in
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Subtitle fade in
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Creator fade in
      Animated.timing(creatorFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(800),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <ImageBackground 
      source={{ uri: IMAGES.wolfBackground }} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Animated Logo */}
          <Animated.Image
            source={{ uri: IMAGES.wolfLogo }}
            style={[
              styles.logo,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          
          {/* Title */}
          <Animated.View style={[styles.titleContainer, { opacity: titleFade }]}>
            <Text style={styles.title}>NJADI AI</Text>
            <Text style={styles.trademark}>™</Text>
          </Animated.View>
          
          {/* Subtitle */}
          <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
            مساعدك الذكي الجزائري
          </Animated.Text>
          
          {/* Creator */}
          <Animated.View style={[styles.creatorContainer, { opacity: creatorFade }]}>
            <Text style={styles.creatorLabel}>صنعه</Text>
            <Text style={styles.creatorName}>{CREATOR.nameArabic}</Text>
          </Animated.View>
        </View>
        
        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View 
              style={[
                styles.loadingProgress,
                {
                  width: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]} 
            />
          </View>
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: FONTS.sizes.hero,
    fontWeight: 'bold',
    color: COLORS.gold,
    letterSpacing: 4,
    textShadowColor: COLORS.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  trademark: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.gold,
    marginTop: 8,
  },
  subtitle: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.primary,
    marginBottom: 32,
    letterSpacing: 2,
  },
  creatorContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.gold + '40',
  },
  creatorLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  creatorName: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.gold,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
});
