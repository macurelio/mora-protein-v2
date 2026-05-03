import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, useWindowDimensions, Linking,
} from 'react-native';

const TESTIMONIALS = [
  {
    id: 't1',
    quote: '¡Las mejores barras proteicas que he probado en mi vida! Sin azúcar y con un sabor increíble. El tiramisú es mi favorito.',
    author: 'María G.',
    role: 'Atleta CrossFit',
    rating: 5,
    initials: 'MG',
    avatarColor: '#8B5E3C',
    instagramUrl: 'https://www.instagram.com/mora.protein',
  },
  {
    id: 't2',
    quote: 'Los galletones de almendra son completamente adictivos. Los pido cada semana. Calidad artesanal real.',
    author: 'Carlos M.',
    role: 'Nutricionista',
    rating: 5,
    initials: 'CM',
    avatarColor: '#3C5E8B',
    instagramUrl: 'https://www.instagram.com/mora.protein',
  },
  {
    id: 't3',
    quote: 'Encontré en Mora Protein el snack perfecto para mis entrenamientos. Los bombones de pistacho son una joya.',
    author: 'Valentina R.',
    role: 'Entrenadora Personal',
    rating: 5,
    initials: 'VR',
    avatarColor: '#5E3C8B',
    instagramUrl: 'https://www.instagram.com/mora.protein',
  },
  {
    id: 't4',
    quote: 'Calidad premium en cada bocado. Se nota que cada producto es hecho con cuidado. ¡100% recomendados!',
    author: 'Diego S.',
    role: 'Corredor de maratón',
    rating: 5,
    initials: 'DS',
    avatarColor: '#3C8B5E',
    instagramUrl: 'https://www.instagram.com/mora.protein',
  },
  {
    id: 't5',
    quote: 'Perfectos para mis clientes del gym. Los pido al por mayor y siempre llegan súper frescos. Sabor inigualable.',
    author: 'Paola T.',
    role: 'Dueña de Gimnasio',
    rating: 5,
    initials: 'PT',
    avatarColor: '#C9A96E',
    instagramUrl: 'https://www.instagram.com/mora.protein',
  },
];

export default function TestimonialsCarousel() {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 48;
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

  const openInstagram = (url) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.section}>
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
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { width: CARD_WIDTH }]}
            onPress={() => openInstagram(item.instagramUrl)}
            activeOpacity={0.88}
          >
            {/* Stars */}
            <View style={styles.starsRow}>
              {Array.from({ length: item.rating }).map((_, i) => (
                <Text key={i} style={styles.star}>★</Text>
              ))}
              <View style={styles.igBadge}>
                <Text style={styles.igText}>Ver en IG →</Text>
              </View>
            </View>

            {/* Quote */}
            <Text style={styles.quote}>"{item.quote}"</Text>

            {/* Author */}
            <View style={styles.authorRow}>
              <View style={[styles.authorAvatar, { backgroundColor: item.avatarColor }]}>
                <Text style={styles.avatarInitial}>{item.initials}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>{item.author}</Text>
                <Text style={styles.authorRole}>{item.role}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
  section: { marginBottom: 32 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionLabel: {
    fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#C9A96E', marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5,
  },
  scrollContent: { paddingHorizontal: 20, gap: 16, paddingBottom: 4 },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20, padding: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  starsRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 14,
  },
  star: { color: '#E8A838', fontSize: 16, marginRight: 2 },
  igBadge: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(201,169,110,0.12)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.25)',
  },
  igText: { color: '#C9A96E', fontSize: 10, fontWeight: '700' },
  quote: {
    color: '#CCCCCC', fontSize: 14, lineHeight: 22,
    fontStyle: 'italic', marginBottom: 18, fontWeight: '400',
  },
  authorRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', paddingTop: 14,
  },
  authorAvatar: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitial: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  authorName: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  authorRole: { color: '#666666', fontSize: 11, fontWeight: '500', marginTop: 1 },
  dotsRow: {
    flexDirection: 'row', justifyContent: 'center', marginTop: 14, gap: 6,
  },
  dotTouchable: { padding: 4 },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: { width: 18, backgroundColor: '#C9A96E' },
});
