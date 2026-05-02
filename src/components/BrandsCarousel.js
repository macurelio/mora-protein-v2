import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';

const BRANDS = [
  {
    id: 'b1',
    name: 'VitaPlus',
    category: 'Suplementos',
    logo: require('../../assets/brand-vitaplus.png'),
  },
  {
    id: 'b2',
    name: 'GreenSource',
    category: 'Ingredientes Orgánicos',
    logo: require('../../assets/brand-greensource.png'),
  },
  {
    id: 'b3',
    name: 'NutriWell',
    category: 'Nutrición Natural',
    logo: require('../../assets/brand-nutriwell.png'),
  },
  {
    id: 'b4',
    name: 'FitLab',
    category: 'Ciencia Deportiva',
    logo: require('../../assets/brand-fitlab.png'),
  },
  {
    id: 'b5',
    name: 'Mora Premium',
    category: 'Producción Artesanal',
    logo: require('../../assets/logo-cuadrado.png'),
  },
];

export default function BrandsCarousel() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  // Same responsive logic as FeaturedProductsCarousel
  const CARD_WIDTH = Math.min(width * 0.72, 220);
  const GAP = 12;

  const goToSlide = (index) => {
    const clampedIndex = Math.max(0, Math.min(index, BRANDS.length - 1));
    scrollRef.current?.scrollTo({ x: clampedIndex * (CARD_WIDTH + GAP), animated: true });
    setActiveIndex(clampedIndex);
  };

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + GAP));
    setActiveIndex(index);
  };

  return (
    <View style={styles.section}>
      {/* Section header — identical to FeaturedProductsCarousel & TestimonialsCarousel */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>ALIANZAS</Text>
        <Text style={styles.sectionTitle}>Marcas con las que trabajamos</Text>
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
        {BRANDS.map((brand) => (
          <View key={brand.id} style={[styles.card, { width: CARD_WIDTH }]}>
            {/* Logo area — same style as imageWrapper in FeaturedProductsCarousel */}
            <View style={styles.logoWrapper}>
              <Image
                source={brand.logo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Info — identical paddings & typography as FeaturedProductsCarousel */}
            <View style={styles.cardBody}>
              <Text style={styles.categoryTag}>{brand.category}</Text>
              <Text style={styles.brandName} numberOfLines={1}>
                {brand.name}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dot indicators — exact same pattern as TestimonialsCarousel */}
      <View style={styles.dotsRow}>
        {BRANDS.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goToSlide(i)} style={styles.dotTouchable}>
            <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 4,
    marginBottom: 32,
  },

  // ── Header (matches FeaturedProductsCarousel & TestimonialsCarousel exactly) ──
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#A09385',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },

  // ── ScrollView content ──
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
  },

  // ── Card (matches FeaturedProductsCarousel card style) ──
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4A3C2F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(215, 207, 194, 0.35)',
  },

  // ── Logo area (matches imageWrapper proportions) ──
  logoWrapper: {
    height: 140,
    backgroundColor: '#F7F4F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '90%',
    height: '90%',
  },

  // ── Card body (matches FeaturedProductsCarousel cardBody) ──
  cardBody: {
    padding: 14,
  },
  categoryTag: {
    backgroundColor: '#F0E6D7',
    color: '#4A3C2F',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  brandName: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },

  // ── Dots (matches TestimonialsCarousel exactly) ──
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    gap: 6,
  },
  dotTouchable: {
    padding: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D7CFC2',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#1A1A1A',
  },
});
