import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { PRODUCT_CATEGORIES } from '../data/categories';

const SLIDES = [
  {
    id: '1',
    title: 'Proteína sin culpa',
    subtitle: 'Barras artesanales con 15g de proteína.\nSin azúcar, 100% sabor.',
    cta: 'Ver Barras',
    ctaCategory: PRODUCT_CATEGORIES.BARS,
    image: require('../../assets/barras-ilustacion.png'),
    overlayColor: 'rgba(10, 8, 4, 0.62)',
  },
  {
    id: '2',
    title: 'Galletones que enamoran',
    subtitle: 'Crujientes, saludables y sin ingredientes artificiales.\nEl snack perfecto.',
    cta: 'Ver Galletones',
    ctaCategory: PRODUCT_CATEGORIES.COOKIES,
    image: require('../../assets/imagen-fondo.jpeg'),
    overlayColor: 'rgba(10, 10, 10, 0.58)',
  },
  {
    id: '3',
    title: 'Bombones únicos',
    subtitle: 'La nueva categoría que llegó para quedarse.\nLujo en cada bocado.',
    cta: 'Ver Bombones',
    ctaCategory: PRODUCT_CATEGORIES.BONBONS,
    image: require('../../assets/bombones.jpg'),
    overlayColor: 'rgba(10, 10, 10, 0.60)',
  },
];

const AUTO_SCROLL_INTERVAL = 4000;

export default function HeroCarousel({ onCategoryPress }) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  const goToSlide = (index) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setActiveIndex(index);
  };

  const startAutoScroll = useCallback(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % SLIDES.length;
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);
  }, [width]);

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(timerRef.current);
  }, [startAutoScroll]);

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleScrollBegin = () => {
    clearInterval(timerRef.current);
  };

  const handleScrollEndDrag = () => {
    startAutoScroll();
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        style={{ width }}
      >
        {SLIDES.map((slide) => (
          <ImageBackground
            key={slide.id}
            source={slide.image}
            style={[styles.slide, { width }]}
            imageStyle={styles.slideImage}
            resizeMode="cover"
          >
            <View style={[styles.overlay, { backgroundColor: slide.overlayColor }]}>
              <View style={styles.content}>
                <Text style={styles.badge}>MORA PROTEIN</Text>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => onCategoryPress && onCategoryPress(slide.ctaCategory)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.ctaText}>{slide.cta} →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goToSlide(i)} style={styles.dotTouchable}>
            <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  slide: {
    height: 340,
  },
  slideImage: {
    opacity: 0.85,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 52,
    paddingHorizontal: 28,
  },
  content: {
    maxWidth: 360,
  },
  badge: {
    color: '#C9A96E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 10,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
    fontWeight: '400',
  },
  ctaButton: {
    backgroundColor: '#C9A96E',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: '#0A0A0A',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 18,
    right: 24,
    flexDirection: 'row',
    gap: 6,
  },
  dotTouchable: {
    padding: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#C9A96E',
  },
});
