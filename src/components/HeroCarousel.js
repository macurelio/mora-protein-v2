import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  ScrollView,
} from 'react-native';

const SLIDES = [
  {
    id: '1',
    title: 'Proteína sin culpa',
    subtitle: 'Barras artesanales con 15g de proteína.\nSin azúcar, 100% sabor.',
    cta: 'Ver Barras',
    ctaCategory: 'Barras Proteicas',
    image: require('../../assets/barras-fondo-snacks.png'),
    overlayColor: 'rgba(26, 20, 12, 0.52)',
  },
  {
    id: '2',
    title: 'Galletones que enamoran',
    subtitle: 'Crujientes, saludables y sin ingredientes artificiales.\nEl snack perfecto.',
    cta: 'Ver Galletones',
    ctaCategory: 'Galletones',
    image: require('../../assets/imagen-fondo.jpeg'),
    overlayColor: 'rgba(74, 60, 47, 0.50)',
  },
  {
    id: '3',
    title: 'Bombones únicos',
    subtitle: 'La nueva categoría que llegó para quedarse.\nLujo en cada bocado.',
    cta: 'Ver Bombones',
    ctaCategory: 'Bombones',
    image: require('../../assets/bombones.jpg'),
    overlayColor: 'rgba(26, 26, 26, 0.55)',
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

  const startAutoScroll = () => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % SLIDES.length;
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);
  };

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(timerRef.current);
  }, [width]);

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
    height: 320,
  },
  slideImage: {
    opacity: 0.9,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 48,
    paddingHorizontal: 28,
  },
  content: {
    maxWidth: 340,
  },
  badge: {
    color: '#D7CFC2',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: 10,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
    fontWeight: '400',
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: '#1A1A1A',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 16,
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
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
});
