import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Image } from 'react-native';

export default function SplashBanner({ onFinish }) {
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo entra
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // Texto aparece
      Animated.timing(textOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      // Tagline aparece
      Animated.timing(taglineOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      // Espera
      Animated.delay(900),
      // Todo se desvanece
      Animated.timing(containerOpacity, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start(() => onFinish?.());
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]} pointerEvents="none">
      <View style={styles.ring}>
        <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
          <Image
            source={require('../../assets/logo-cuadrado.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <Animated.Text style={[styles.brand, { opacity: textOpacity }]}>
        Mora<Text style={styles.brandAccent}>Protein</Text>
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Bienvenidos al catálogo
      </Animated.Text>

      <Animated.View style={[styles.dotsRow, { opacity: taglineOpacity }]}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  ring: {
    width: 120, height: 120,
    borderRadius: 30,
    backgroundColor: '#141414',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(201,169,110,0.35)',
    shadowColor: '#C9A96E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 12,
  },
  logo: { width: 90, height: 90, borderRadius: 18 },
  brand: {
    color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -1,
  },
  brandAccent: { color: '#C9A96E' },
  tagline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13, letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 10,
  },
  dotsRow: {
    flexDirection: 'row', gap: 6, marginTop: 32,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: {
    width: 20, backgroundColor: '#C9A96E',
  },
});
