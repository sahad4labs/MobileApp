import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Animated,
  Easing,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function QRScannerScreen() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scannedValue, setScannedValue] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  const translateY = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 200,
            duration: 2000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 2000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    startAnimation();
  }, [translateY]);

  useEffect(() => {
    if (scannedValue) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [scannedValue]);

  useEffect(() => {
    const checkPermission = async () => {
      if (!hasPermission) {
        const result = await requestPermission();
        setPermissionGranted(result);
      } else {
        setPermissionGranted(true);
      }
    };
    checkPermission();
  }, [hasPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'upc-a'],
    onCodeScanned: codes => {
      if (codes.length > 0 && !scanned) {
        const value = codes[0].value;
        console.log('Scanned:', value);

        setScanned(true);
        setScannedValue(value);

        setTimeout(() => {
          const lowerValue = value.toLowerCase();

          if (lowerValue.startsWith('tel:')) {
            const phoneNumber = value.substring(4);
            const url = `tel:${phoneNumber}`;

            Linking.openURL(url).catch(err =>
              console.error('Error opening dialer:', err),
            );
          } else if (/^[\d\s\+\-\(\)]{6,20}$/.test(value)) {
            const cleanNumber = value.replace(/[\s\-\(\)]/g, '');
            const phoneNumber = cleanNumber.startsWith('+')
              ? cleanNumber
              : `+91${cleanNumber}`;
            const url = `tel:${phoneNumber}`;

            Linking.openURL(url).catch(err =>
              console.error('Error opening dialer:', err),
            );
          } else if (lowerValue.startsWith('http')) {
            Linking.openURL(value).catch(err =>
              console.error('Error opening URL:', err),
            );
          } else {
            console.log("Scanned value doesn't match known formats:", value);
          }
        }, 500);
      }
    },
  });

  if (!device) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.permissionContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📷</Text>
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDescription}>
            We need camera permission to scan QR codes and barcodes
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.primaryButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!scanned}
        codeScanner={codeScanner}
      />

      <View style={styles.topOverlay}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <ChevronLeft color="black" size={22} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerOverlay}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {!scanned && (
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY }] }]}
            />
          )}
        </View>
      </View>

      <View style={styles.bottomOverlay}>
        <Text style={styles.supportedText}>Supports QR codes & barcodes</Text>
      </View>

      {scannedValue && (
        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => {
              setScanned(false);
              setScannedValue(null);
            }}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconText: {
    fontSize: 50,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#d1d5db',
  },
  centerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#0380C7',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'relative',
    top: 40,
    width: '100%',
    height: 3,
    backgroundColor: '#0380C7',
    borderRadius: 2,
    shadowColor: '#0380C7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  supportedText: {
    color: '#9ca3af',
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 2,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,

    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  successIconText: {
    fontSize: 32,
    color: '#22c55e',
    fontWeight: '700',
  },
  resultLabel: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 8,
    fontFamily: 'satoshi-Regular',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  scanAgainButton: {
    backgroundColor: '#0380C7',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: 50,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  topOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 60,
  backgroundColor: '#fff',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 15,
  zIndex: 10,
},

backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},

backText: {
  color: 'black',
  fontSize: 16,
  fontFamily: 'Satoshi-Bold',
},

});
