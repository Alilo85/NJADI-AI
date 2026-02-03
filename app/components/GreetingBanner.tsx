import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { COLORS, FONTS, SPACING, GREETINGS } from '../constants/theme';
import { supabaseUrl, supabaseKey } from '../lib/supabase';

interface GreetingBannerProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function GreetingBanner({ visible, onDismiss }: GreetingBannerProps) {
  const [greeting, setGreeting] = useState(GREETINGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Select random greeting
    const randomIndex = Math.floor(Math.random() * GREETINGS.length);
    setGreeting(GREETINGS[randomIndex]);
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
      
      // Auto-play greeting audio
      playGreeting();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [visible]);

  const playGreeting = async () => {
    try {
      setIsPlaying(true);
      
      // Request audio permissions
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Call the speech edge function
      const response = await fetch(
        `${supabaseUrl}/functions/v1/njadi-speech`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ text: greeting.text }),
        }
      );

      if (response.ok) {
        const audioBlob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          try {
            const base64data = reader.result as string;
            
            const { sound } = await Audio.Sound.createAsync(
              { uri: base64data },
              { shouldPlay: true }
            );
            
            soundRef.current = sound;
            
            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && status.didJustFinish) {
                setIsPlaying(false);
              }
            });
          } catch (err) {
            setIsPlaying(false);
          }
        };
        
        reader.readAsDataURL(audioBlob);
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.log('Audio playback error:', error);
      setIsPlaying(false);
    }
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={isPlaying ? "volume-high" : "chatbubble-ellipses"} 
            size={24} 
            color={COLORS.gold} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>{greeting.text}</Text>
          <Text style={styles.translationText}>{greeting.translation}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
          <Ionicons name="close" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gold + '40',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  translationText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
});
