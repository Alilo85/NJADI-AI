import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface VoiceRecordingModalProps {
  visible: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
  onTranscribe: (audioBase64: string) => Promise<string>;
}

export default function VoiceRecordingModal({ 
  visible, 
  onClose, 
  onTranscriptionComplete,
  onTranscribe
}: VoiceRecordingModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Waveform animation values
  const waveAnims = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    if (visible) {
      setError(null);
      setRecordingDuration(0);
      startRecording();
    } else {
      stopRecording();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [visible]);

  useEffect(() => {
    if (isRecording) {
      // Animate waveform bars
      const animations = waveAnims.map((anim, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 0.7 + 0.3,
              duration: 150 + Math.random() * 100,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 150 + Math.random() * 100,
              useNativeDriver: true,
            }),
          ])
        );
      });
      
      animations.forEach(anim => anim.start());
      
      return () => {
        animations.forEach(anim => anim.stop());
      };
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setError(null);
      
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('يرجى السماح بالوصول إلى الميكروفون');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recordingRef.current = recording;
      setIsRecording(true);
      
      // Start duration timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('فشل في بدء التسجيل');
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (!recordingRef.current) {
      setIsRecording(false);
      return;
    }

    try {
      setIsRecording(false);
      setIsTranscribing(true);
      
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      
      if (uri) {
        // Read the audio file as base64
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          // Remove the data URL prefix
          const base64Audio = base64data.split(',')[1];
          
          try {
            const transcription = await onTranscribe(base64Audio);
            
            if (transcription && transcription.trim()) {
              onTranscriptionComplete(transcription);
              onClose();
            } else {
              setError('لم يتم التعرف على أي كلام. حاول مرة أخرى.');
              setIsTranscribing(false);
            }
          } catch (err) {
            console.error('Transcription error:', err);
            setError('فشل في تحويل الصوت إلى نص');
            setIsTranscribing(false);
          }
        };
        
        reader.readAsDataURL(blob);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setError('فشل في إيقاف التسجيل');
      setIsTranscribing(false);
    }
    
    // Reset audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setIsTranscribing(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          {/* Title */}
          <Text style={styles.title}>
            {isTranscribing ? 'جاري التحويل...' : 'تسجيل صوتي'}
          </Text>
          
          {/* Waveform visualization */}
          <View style={styles.waveformContainer}>
            {isTranscribing ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <View style={styles.waveform}>
                {waveAnims.map((anim, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.waveBar,
                      {
                        transform: [{ scaleY: anim }],
                        backgroundColor: isRecording ? COLORS.primary : COLORS.textMuted,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
          
          {/* Duration */}
          <Text style={styles.duration}>
            {isTranscribing ? 'يرجى الانتظار...' : formatDuration(recordingDuration)}
          </Text>
          
          {/* Error message */}
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          {/* Recording button */}
          {!isTranscribing && (
            <TouchableOpacity 
              style={[styles.recordButton, isRecording && styles.recordingActive]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View style={styles.recordButtonInner}>
                {isRecording ? (
                  <View style={styles.stopIcon} />
                ) : (
                  <Ionicons name="mic" size={32} color={COLORS.textPrimary} />
                )}
              </View>
            </TouchableOpacity>
          )}
          
          {/* Instructions */}
          <Text style={styles.instructions}>
            {isRecording 
              ? 'اضغط لإيقاف التسجيل وإرسال الرسالة' 
              : isTranscribing 
                ? 'جاري تحويل الصوت إلى نص...'
                : 'اضغط للبدء في التسجيل'}
          </Text>
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
    padding: SPACING.xxl,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
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
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  waveformContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  waveBar: {
    width: 6,
    height: 60,
    marginHorizontal: 3,
    borderRadius: 3,
  },
  duration: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    fontVariant: ['tabular-nums'],
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 4,
    borderColor: COLORS.error + '50',
  },
  recordingActive: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 4,
  },
  instructions: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
