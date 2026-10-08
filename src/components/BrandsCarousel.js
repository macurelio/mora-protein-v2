import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

const PRODUCERS = [
  { id: 'p1', name: 'Campo Las Vertientes', category: 'Hojas y aromáticas', emoji: '🌱' },
  { id: 'p2', name: 'Huerto San Pedro', category: 'Tubérculos de campo', emoji: '🥔' },
  { id: 'p3', name: 'Frutas del Maipo', category: 'Fruta de temporada', emoji: '🍑' },
  { id: 'p4', name: 'Mora Verduras', category: 'Selección y packing', emoji: '🥬' },
  { id: 'p5', name: 'Vega Central', category: 'Abastecimiento diario', emoji: '🧺' },
];

export default function BrandsCarousel() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const CARD_WIDTH = Math.min(width * 0.72, 220);
  const GAP = 12;

  const goToSlide = (index) => {
    const clampedIndex = Math.max(0, Math.min(index, PRODUCERS.length - 1));
    scrollRef.current?.scrollTo({ x: clampedIndex * (CARD_WIDTH + GAP), animated: true });
    setActiveIndex(clampedIndex);
  };

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + GAP));
    setActiveIndex(index);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>ORIGEN</Text>
        <Text style={styles.sectionTitle}>Productores aliados</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + GAP}
      >
        {PRODUCERS.map((brand) => (
          <View key={brand.id} style={[styles.card, { width: CARD_WIDTH }]}>
            <View style={styles.logoWrapper}>
              <Text style={styles.logoEmoji}>{brand.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.categoryTag}>{brand.category}</Text>
              <Text style={styles.brandName} numberOfLines={1}>{brand.name}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {PRODUCERS.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goToSlide(i)} style={styles.dotTouchable}>
            <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 4, marginBottom: 32 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2.5, color: '#7CB342', marginBottom: 2 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  scrollContent: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  logoWrapper: {
    height: 140,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: { fontSize: 64 },
  cardBody: { padding: 14 },
  categoryTag: {
    backgroundColor: 'rgba(124,179,66,0.12)',
    color: '#7CB342',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(124,179,66,0.25)',
  },
  brandName: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14, gap: 6 },
  dotTouchable: { padding: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { width: 20, backgroundColor: '#7CB342' },
});
