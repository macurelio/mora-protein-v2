import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Linking, useWindowDimensions,
  Animated, Modal,
} from 'react-native';
import { ShoppingCart, Instagram, Briefcase, Plus, Minus } from 'lucide-react-native';

import { products } from '../data/products';
import { CartContext } from '../context/CartContext';
import HeroCarousel from '../components/HeroCarousel';
import FeaturedProductsCarousel from '../components/FeaturedProductsCarousel';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import BrandsCarousel from '../components/BrandsCarousel';
import ToastMessage from '../components/ToastMessage';
import WorkWithUsModal from '../components/WorkWithUsModal';
import BombonesHorizontalBanner from '../components/BombonesHorizontalBanner';
import AboutUsSection from '../components/AboutUsSection';
import ProductDetailModal from '../components/ProductDetailModal';

// Products excluding Bombones (handled by BombonesHorizontalBanner)
const NON_BOMBON_PRODUCTS = products.filter(p => p.category !== 'Bombones');

const fmt = (n) => '$' + Number(n).toLocaleString('es-CL');

export default function HomeScreen({ navigation }) {
  const { addToCart, getCartCount } = useContext(CartContext);
  const { width } = useWindowDimensions();
  const scrollRef = useRef(null);
  const sectionPositions = useRef({});

  // UI state
  const [selectedCoverage, setSelectedCoverage] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [workWithUsVisible, setWorkWithUsVisible] = useState(false);
  const [adPopupVisible, setAdPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const hasShownPopup = useRef(false);

  // Per-product flip animations (scaleX)
  const flipAnims = useRef(
    products.reduce((acc, p) => { acc[p.id] = new Animated.Value(1); return acc; }, {})
  ).current;

  // Per-card entrance animations (Gervis effect)
  const cardAnims = useRef(
    NON_BOMBON_PRODUCTS.reduce((acc, p) => {
      acc[p.id] = { opacity: new Animated.Value(0), translateY: new Animated.Value(28) };
      return acc;
    }, {})
  ).current;

  // Trigger staggered entrance on mount
  useEffect(() => {
    const animations = NON_BOMBON_PRODUCTS.map(p =>
      Animated.parallel([
        Animated.timing(cardAnims[p.id].opacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(cardAnims[p.id].translateY, { toValue: 0, duration: 380, useNativeDriver: true }),
      ])
    );
    const timer = setTimeout(() => {
      Animated.stagger(55, animations).start();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleAddToCart = useCallback((item, options = {}) => {
    addToCart(item, options);
    showToast(`¡${item.name} al carrito!`);
  }, [addToCart]);

  const handleCoverageChange = (productId, opt) => {
    const anim = flipAnims[productId];
    setSelectedCoverage(prev => ({ ...prev, [productId]: opt }));
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.08, duration: 130, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 130, useNativeDriver: true }),
    ]).start();
  };

  const handleScroll = useCallback(() => {
    if (!hasShownPopup.current) {
      hasShownPopup.current = true;
      setTimeout(() => setAdPopupVisible(true), 400);
    }
  }, []);

  const scrollToSection = (category) => {
    const y = sectionPositions.current[category];
    if (y !== undefined) scrollRef.current?.scrollTo({ y: y - 10, animated: true });
  };

  const openInstagram = () => Linking.openURL('https://www.instagram.com/mora.protein');

  const categories = [...new Set(NON_BOMBON_PRODUCTS.map(p => p.category))].sort((a, b) => {
    if (a === 'Barras Proteicas') return -1;
    if (b === 'Barras Proteicas') return 1;
    return a.localeCompare(b);
  });

  let columns = 1;
  if (width > 1200) columns = 4;
  else if (width > 800) columns = 3;
  else if (width > 500) columns = 2;

  const outerPadding = 20;
  const gap = 16;
  const cardWidth = (width - outerPadding * 2 - gap * (columns - 1)) / columns;

  const renderProduct = (item) => {
    const coverage = selectedCoverage[item.id] || item.coverageOptions?.[0];
    const flipAnim = flipAnims[item.id];
    const entranceAnim = cardAnims[item.id];

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.card,
          { width: cardWidth },
          entranceAnim && {
            opacity: entranceAnim.opacity,
            transform: [{ translateY: entranceAnim.translateY }],
          },
        ]}
      >
        {/* Image with flip effect — sin precio aquí */}
        <Animated.View
          style={[styles.imageContainer, { transform: [{ scaleX: flipAnim }] }]}
        >
          <Image source={item.image} style={styles.productImage} resizeMode="cover" />
        </Animated.View>

        <View style={styles.cardContent}>
          {/* Category + precio en la misma fila */}
          <View style={styles.cardHeader}>
            <Text style={styles.categoryTag}>{item.category}</Text>
            <Text style={styles.cardPrice}>{fmt(item.price)}</Text>
          </View>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>

          {item.coverageOptions?.length > 0 && (
            <View style={styles.coverageContainer}>
              <Text style={styles.optionsLabel}>Cobertura:</Text>
              <View style={styles.coverageRow}>
                {item.coverageOptions.map(opt => (
                  <TouchableOpacity
                    key={`${item.id}-${opt}`}
                    style={[styles.coverageOption, coverage === opt && styles.coverageSelected]}
                    onPress={() => handleCoverageChange(item.id, opt)}
                  >
                    <Text style={[styles.coverageText, coverage === opt && styles.coverageTextSelected]}>
                      {opt === 'Chocolate Negro' ? 'Negro' : opt === 'Chocolate Blanco' ? 'Blanco' : opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.cardActions}>
            {/* Ver Detalle */}
            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() => {
                setSelectedProduct(item);
                setDetailModalVisible(true);
              }}
            >
              <Text style={styles.detailBtnText}>Ver detalle</Text>
            </TouchableOpacity>

            {/* Selector de cantidad + Agregar */}
            <View style={styles.qtyAddRow}>
              <TouchableOpacity
                style={styles.qtyMiniBtn}
                onPress={() =>
                  setSelectedQuantity(prev => ({
                    ...prev,
                    [item.id]: Math.max(1, (prev[item.id] || 1) - 1),
                  }))
                }
              >
                <Minus color="#FFFFFF" size={13} />
              </TouchableOpacity>

              <Text style={styles.qtyMiniNum}>{selectedQuantity[item.id] || 1}</Text>

              <TouchableOpacity
                style={styles.qtyMiniBtn}
                onPress={() =>
                  setSelectedQuantity(prev => ({
                    ...prev,
                    [item.id]: (prev[item.id] || 1) + 1,
                  }))
                }
              >
                <Plus color="#FFFFFF" size={13} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => {
                  const qty = selectedQuantity[item.id] || 1;
                  const opts = item.coverageOptions?.length ? { coverage } : {};
                  for (let i = 0; i < qty; i++) handleAddToCart(item, opts);
                  // reset qty after adding
                  setSelectedQuantity(prev => ({ ...prev, [item.id]: 1 }));
                }}
              >
                <ShoppingCart color="#0A0A0A" size={13} />
                <Text style={styles.addToCartText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Text style={styles.brandMora}>Mora<Text style={styles.brandProtein}>Protein</Text></Text>
          </View>
          <View style={styles.headerIcons}>
            {/* Trabaja con nosotros */}
            <TouchableOpacity
              style={styles.workBtn}
              onPress={() => setWorkWithUsVisible(true)}
            >
              <Briefcase color="#C9A96E" size={14} />
              <Text style={styles.workBtnText}>Trabaja</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openInstagram} style={styles.iconButton}>
              <Instagram color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconButton}>
              <View>
                <ShoppingCart color="#FFFFFF" size={22} />
                {getCartCount() > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{getCartCount()}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category nav */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryNav}>
          {['Todos', ...categories, 'Bombones', 'Quiénes Somos', 'Pedidos'].map(cat => (
            <TouchableOpacity
              key={`nav-${cat}`}
              style={[styles.navButton, activeCategory === cat && styles.navButtonActive]}
              onPress={() => {
                if (cat === 'Pedidos') { navigation.navigate('OrderTracking'); return; }
                setActiveCategory(cat);
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }}
            >
              <Text style={[styles.navButtonText, activeCategory === cat && styles.navButtonTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main scroll */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        onScrollBeginDrag={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Contenido Home (Solo si es Todos) */}
        {activeCategory === 'Todos' && (
          <>
            <HeroCarousel onCategoryPress={(cat) => setActiveCategory(cat)} />
            <View style={styles.carouselSection}>
              <FeaturedProductsCarousel />
            </View>
            <View style={styles.carouselSection}>
              <TestimonialsCarousel />
            </View>
            <BrandsCarousel />
          </>
        )}

        {/* Secciones específicas o menú completo */}
        {(activeCategory === 'Todos' || activeCategory === 'Quiénes Somos') && (
          <View>
            <AboutUsSection onWorkWithUsPress={() => setWorkWithUsVisible(true)} />
          </View>
        )}

        {activeCategory === 'Todos' && (
          <>
            <View style={styles.divider} />
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Nuestro Menú</Text>
              <Text style={styles.subtitle}>Snacks artesanales separados por categoría.</Text>
            </View>
          </>
        )}

        {/* Bombones banner */}
        {(activeCategory === 'Todos' || activeCategory === 'Bombones') && (
          <View style={{ marginTop: activeCategory === 'Bombones' ? 20 : 0 }}>
            <BombonesHorizontalBanner onAddToCart={(name) => showToast(`¡${name} al carrito!`)} />
          </View>
        )}

        {/* Other categories */}
        {categories.map(category => {
          if (activeCategory !== 'Todos' && activeCategory !== category) return null;
          const catProducts = NON_BOMBON_PRODUCTS.filter(p => p.category === category);
          return (
            <View
              key={category}
              style={[styles.categorySection, activeCategory !== 'Todos' && { marginTop: 20 }]}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{catProducts.length}</Text>
                  </View>
                </View>
                <View style={styles.categoryLine} />
              </View>

              <View style={styles.productsGrid}>
                {catProducts.map(product => renderProduct(product))}
              </View>
            </View>
          );
        })}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Mora<Text style={styles.footerBrandAccent}>Protein</Text></Text>
          <Text style={styles.footerText}>Snacks artesanales con proteína real. Sin azúcar añadida.</Text>
          <TouchableOpacity onPress={openInstagram} style={styles.footerInstagram}>
            <Instagram color="#C9A96E" size={18} />
            <Text style={styles.footerInstagramText}>@mora.protein</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerTrack}
            onPress={() => navigation.navigate('OrderTracking')}
          >
            <Text style={styles.footerTrackText}>📦 Estado de Pedidos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Toast overlay */}
      <ToastMessage visible={toastVisible} message={toastMessage} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        onAddToCart={(name) => {
          setDetailModalVisible(false);
          showToast(`¡${name} al carrito!`);
        }}
      />

      {/* WorkWithUs Modal */}
      <WorkWithUsModal visible={workWithUsVisible} onClose={() => setWorkWithUsVisible(false)} />

      {/* Ad Popup */}
      <Modal
        visible={adPopupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAdPopupVisible(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <TouchableOpacity style={styles.popupClose} onPress={() => setAdPopupVisible(false)}>
              <Text style={styles.popupCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.popupEyebrow}>🎉 OFERTA ESPECIAL</Text>
            <Text style={styles.popupTitle}>15% OFF{'\n'}en tu primer pedido</Text>
            <Text style={styles.popupBody}>Usa el código al hacer tu pedido</Text>
            <View style={styles.popupCode}>
              <Text style={styles.popupCodeText}>MORA15</Text>
            </View>
            <TouchableOpacity
              style={styles.popupBtn}
              onPress={() => {
                setAdPopupVisible(false);
                navigation.navigate('Cart');
              }}
            >
              <Text style={styles.popupBtnText}>Ir al carrito →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  scrollView: { flex: 1, backgroundColor: '#0A0A0A' },

  // Header
  header: {
    paddingTop: 50, backgroundColor: '#111111',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  logoContainer: {
    backgroundColor: '#1E1E1E', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 6, borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
  },
  brandMora: { color: '#FFFFFF', fontWeight: '900', fontSize: 22, letterSpacing: -0.5 },
  brandProtein: { color: '#C9A96E', fontWeight: '900', fontSize: 22, letterSpacing: -0.5 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  workBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.4)',
    paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20,
  },
  workBtnText: { color: '#C9A96E', fontSize: 11, fontWeight: '800' },
  iconButton: { padding: 8 },
  badgeContainer: {
    position: 'absolute', right: -6, top: -6,
    backgroundColor: '#C9A96E', borderRadius: 10, width: 18, height: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#0A0A0A', fontSize: 10, fontWeight: '900' },
  categoryNav: { paddingHorizontal: 20, paddingBottom: 14, gap: 8 },
  navButton: {
    backgroundColor: 'transparent', paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  navButtonActive: {
    backgroundColor: '#C9A96E', borderColor: '#C9A96E',
  },
  navButtonText: {
    fontSize: 11, fontWeight: '700', color: '#FFFFFF',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  navButtonTextActive: {
    color: '#0A0A0A',
  },

  // Scroll
  scrollContent: { paddingBottom: 40 },
  carouselSection: { marginTop: 28 },
  divider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 20, marginBottom: 10, marginTop: 4,
  },

  // Menu title
  titleContainer: { marginHorizontal: 20, marginTop: 25, marginBottom: 20 },
  mainTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 5 },
  subtitle: { color: '#666666', fontSize: 14 },

  // Category section
  categorySection: {
    marginBottom: 40, backgroundColor: '#141414',
    paddingVertical: 20, borderRadius: 20, marginHorizontal: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  categoryHeader: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 15, marginBottom: 20,
  },
  categoryTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 15 },
  categoryTitle: {
    color: '#C9A96E', fontSize: 20, fontWeight: '900',
    textTransform: 'uppercase', letterSpacing: 1.5,
  },
  categoryBadge: {
    backgroundColor: 'rgba(201,169,110,0.15)', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10, borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
  },
  categoryBadgeText: { fontSize: 12, fontWeight: '800', color: '#C9A96E' },
  categoryLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },

  // Grid
  productsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 15, justifyContent: 'flex-start', gap: 16,
  },

  // Product card
  card: {
    backgroundColor: '#1E1E1E', borderRadius: 18, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  imageContainer: { position: 'relative', height: 180, backgroundColor: '#2A2A2A' },
  productImage: { width: '100%', height: '100%' },
  priceBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(10,10,10,0.85)', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.4)',
  },
  priceBadgeText: { color: '#C9A96E', fontSize: 14, fontWeight: '700' },
  cardContent: { padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  cardPrice: { color: '#C9A96E', fontSize: 14, fontWeight: '900' },
  productName: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginBottom: 4, letterSpacing: -0.3 },
  productDescription: { color: '#888888', fontSize: 12, lineHeight: 18, marginBottom: 12, minHeight: 36 },
  categoryTag: {
    backgroundColor: 'rgba(201,169,110,0.12)', color: '#C9A96E',
    fontSize: 9, fontWeight: '800', paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 8, textTransform: 'uppercase', letterSpacing: 0.5,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.25)',
  },
  coverageContainer: { marginBottom: 12 },
  optionsLabel: { fontSize: 10, color: '#666', fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
  coverageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  coverageOption: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#2A2A2A', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4,
  },
  coverageSelected: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  coverageText: { color: '#999', fontSize: 10, fontWeight: '700' },
  coverageTextSelected: { color: '#0A0A0A' },

  // Card actions
  cardActions: { flexDirection: 'column', gap: 10 },
  qtyAddRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#2A2A2A', 
    borderRadius: 12, 
    padding: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  qtyMiniBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyMiniNum: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    minWidth: 20,
    textAlign: 'center',
  },
  detailBtn: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12, paddingVertical: 10, alignItems: 'center',
  },
  detailBtnText: { color: '#AAAAAA', fontSize: 12, fontWeight: '700' },
  addToCartButton: {
    flex: 1, backgroundColor: '#C9A96E', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 10, gap: 5,
  },
  addToCartText: { color: '#0A0A0A', fontSize: 12, fontWeight: '900' },

  // Footer
  footer: {
    marginTop: 20, marginHorizontal: 20, padding: 28,
    backgroundColor: '#141414', borderRadius: 20, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 20,
  },
  footerBrand: { color: '#FFFFFF', fontWeight: '900', fontSize: 24, letterSpacing: -0.5, marginBottom: 8 },
  footerBrandAccent: { color: '#C9A96E' },
  footerText: { color: '#555555', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 14 },
  footerInstagram: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  footerInstagramText: { color: '#C9A96E', fontSize: 14, fontWeight: '700' },
  footerTrack: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14,
  },
  footerTrackText: { color: '#888888', fontSize: 12, fontWeight: '600' },

  // Ad popup
  popupOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  popupCard: {
    backgroundColor: '#141414', borderRadius: 24, padding: 28,
    width: '100%', maxWidth: 380,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
    shadowColor: '#C9A96E', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 30, elevation: 20,
  },
  popupClose: { alignSelf: 'flex-end', marginBottom: 12 },
  popupCloseText: { color: '#555555', fontSize: 18, fontWeight: '700' },
  popupEyebrow: { color: '#C9A96E', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  popupTitle: {
    color: '#FFFFFF', fontSize: 28, fontWeight: '900',
    letterSpacing: -0.5, lineHeight: 34, marginBottom: 12,
  },
  popupBody: { color: '#666666', fontSize: 14, marginBottom: 18 },
  popupCode: {
    backgroundColor: 'rgba(201,169,110,0.12)', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#C9A96E', marginBottom: 18,
    borderStyle: 'dashed',
  },
  popupCodeText: { color: '#C9A96E', fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  popupBtn: {
    backgroundColor: '#C9A96E', paddingVertical: 14,
    borderRadius: 14, alignItems: 'center',
  },
  popupBtnText: { color: '#0A0A0A', fontSize: 15, fontWeight: '900' },
});
