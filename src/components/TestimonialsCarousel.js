import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

const TESTIMONIALS = [
  {
    id: 't1',
    quote:
      '¡Las mejores barras proteicas que he probado en mi vida! Sin azúcar y con un sabor increíble. El tiramisú es mi favorito.',
    author: 'María G.',
    role: 'Atleta CrossFit',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'Los galletones de almendra son completamente adictivos. Los pido cada semana. Calidad artesanal real.',
    author: 'Carlos M.',
    role: 'Nutricionista',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'Encontré en Mora Protein el snack perfecto para mis entrenamientos. Los bombones de pistacho son una joya.',
    author: 'Valentina R.',
    role: 'Entrenadora Personal',
    rating: 5,
  },
  {
    id: 't4',
    quote:
      'Calidad premium en cada bocado. Se nota que cada producto es hecho con cuidado. ¡100% recomendados!',
    author: 'Diego S.',
    role: 'Corredor de maratón',
    rating: 5,
  },
];

export default function TestimonialsCarousel() {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 48; // full-width minus side padding
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const goToSlide = (index) => {
    scrollRef.current?.scrollTo({ x: index * (CARD_WIDTH + 16), animated: true });
    setActiveIndex(index);
  };

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + 16));
    setActiveIndex(index);
  };

  return (
    <View style={styles.section}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>TESTIMONIOS</Text>
        <Text style={styles.sectionTitle}>Lo que dicen nuestros clientes</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 16}
      >
        {TESTIMONIALS.map((item) => (
          <View key={item.id} style={[styles.card, { width: CARD_WIDTH }]}>
            {/* Stars */}
            <View style={styles.starsRow}>
              {Array.from({ length: item.rating }).map((_, i) => (
                <Text key={i} style={styles.star}>★</Text>
              ))}
            </View>

            {/* Quote */}
            <Text style={styles.quote}>"{item.quote}"</Text>

            {/* Author */}
            <View style={styles.authorRow}>
              <View style={styles.authorAvatar}>
                <Text style={styles.avatarInitial}>{item.author[0]}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>{item.author}</Text>
                <Text style={styles.authorRole}>{item.role}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {TESTIMONIALS.map((_, i) => (
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
    marginBottom: 32,
  },
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
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#4A3C2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(215, 207, 194, 0.35)',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  star: {
    color: '#E8A838',
    fontSize: 18,
    marginRight: 2,
  },
  quote: {
    color: '#2C2C2C',
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 18,
    fontWeight: '400',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EBE3',
    paddingTop: 14,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D7CFC2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#4A3C2F',
    fontSize: 16,
    fontWeight: '900',
  },
  authorName: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '800',
  },
  authorRole: {
    color: '#A09385',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
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
