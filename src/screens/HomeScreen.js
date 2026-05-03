import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Linking, useWindowDimensions,
  Animated, Modal, ImageBackground,
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
import PromoDetailModal from '../components/PromoDetailModal';
import { comboPromotions } from '../data/combos';
import { PRODUCT_CATEGORIES } from '../data/categories';

// Products excluding Bombones (handled by BombonesHorizontalBanner)
const NON_BOMBON_PRODUCTS = products.filter(p => p.category !== 'Bombones');

const fmt = (n) => '$' + Number(n).toLocaleString('es-CL');

const PRODUCT_COPY_FALLBACKS = {
  cookieFlavor: 'casero',
  barDescription: 'proteína real y sabor intenso',
  bonbonFlavor: 'intenso',
};

const PRODUCT_CATEGORY_DESCRIPTIONS = {
  [PRODUCT_CATEGORIES.COOKIES]: (product) => `Un snack artesanal con sabor ${product.flavor?.toLowerCase() || PRODUCT_COPY_FALLBACKS.cookieFlavor}, textura contundente y un perfil pensado para colaciones o antojos más equilibrados.`,
  [PRODUCT_CATEGORIES.BARS]: (product) => `Una barra proteica de perfil indulgente con ${product.description?.toLowerCase() || PRODUCT_COPY_FALLBACKS.barDescription}, ideal para antes o después de entrenar y fácil de llevar.`,
  [PRODUCT_CATEGORIES.BONBONS]: (product) => `Una opción más premium para darte un gusto con proteína, formato delicado y sabor ${product.flavor?.toLowerCase() || PRODUCT_COPY_FALLBACKS.bonbonFlavor}.`,
};

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
  const [activeModal, setActiveModal] = useState(null);
  const hasShownPopup = useRef(false);

  // Animations
  const flipAnims = useRef(
    products.reduce((acc, p) => { acc[p.id] = new Animated.Value(1); return acc; }, {})
  ).current;

  const pressAnims = useRef(
    products.reduce((acc, p) => { acc[p.id] = new Animated.Value(1); return acc; }, {})
  ).current;

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

  const cardWidth = width > 600 ? 280 : width * 0.75;

  const buildProductModal = (product) => {
    const bullets = [
      product.flavor ? `Sabor: ${product.flavor}` : null,
      `Perfil: ${product.description}`,
      product.coverageOptions?.length ? `Coberturas disponibles: ${product.coverageOptions.join(' y ')}` : null,
    ].filter(Boolean);

    return {
      id: `product-${product.id}`,
      type: 'product',
      badge: product.category.toUpperCase(),
      title: product.name,
      subtitle: product.flavor || 'Snack artesanal',
      description: PRODUCT_CATEGORY_DESCRIPTIONS[product.category]?.(product) || product.description,
      priceLabel: `Desde $${product.price.toLocaleString()}`,
      image: product.image,
      bullets,
      primaryLabel: 'Ver producto',
      product,
    };
  };

  const handleModalAction = () => {
    if (!activeModal) return;
    if (activeModal.type === 'product' && activeModal.product) {
      setSelectedProduct(activeModal.product);
      setDetailModalVisible(true);
      setActiveModal(null);
      return;
    }
    if (activeModal.targetCategory) {
      setActiveCategory(activeModal.targetCategory);
      setActiveModal(null);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    setActiveModal(null);
  };

  const renderComboBanner = (combo) => (
    <TouchableOpacity
      key={combo.id}
      style={styles.comboBanner}
      activeOpacity={0.88}
      onPress={() => setActiveModal({ ...combo, type: 'combo' })}
    >
      <ImageBackground source={combo.image} style={styles.comboBannerImage} imageStyle={styles.comboBannerImageStyle}>
        <View style={styles.comboBannerOverlay}>
          <Text style={styles.comboBadge}>{combo.badge}</Text>
          <Text style={styles.comboTitle}>{combo.title}</Text>
          <Text style={styles.comboSubtitle}>{combo.subtitle}</Text>
          <Text style={styles.comboCta}>Toca para ver el detalle</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderProduct = (item) => {
    const coverage = selectedCoverage[item.id] || item.coverageOptions?.[0];
    const flipAnim = flipAnims[item.id];
    const entranceAnim = cardAnims[item.id];
    const pressAnim = pressAnims[item.id];

    const handlePressIn = () => Animated.spring(pressAnim, { toValue: 0.96, useNativeDriver: true }).start();
    const handlePressOut = () => Animated.spring(pressAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.card,
          { width: cardWidth },
          entranceAnim && {
            opacity: entranceAnim.opacity,
            transform: [
              { translateY: entranceAnim.translateY },
              { scale: pressAnim }
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            setSelectedProduct(item);
            setDetailModalVisible(true);
          }}
        >
          <Animated.View style={[styles.imageContainer, { transform: [{ scaleX: flipAnim }] }]}>
            <Image source={item.image} style={styles.productImage} resizeMode="cover" />
          </Animated.View>

          <View style={styles.cardContent}>
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
              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => {
                  setSelectedProduct(item);
                  setDetailModalVisible(true);
                }}
              >
                <Text style={styles.detailBtnText}>Ver detalle</Text>
              </TouchableOpacity>

              <View style={styles.qtyAddRow}>
                <TouchableOpacity
                  style={styles.qtyMiniBtn}
                  onPress={() => setSelectedQuantity(prev => ({ ...prev, [item.id]: Math.max(1, (prev[item.id] || 1) - 1) }))}
                >
                  <Minus color="#FFFFFF" size={13} />
                </TouchableOpacity>
                <Text style={styles.qtyMiniNum}>{selectedQuantity[item.id] || 1}</Text>
                <TouchableOpacity
                  style={styles.qtyMiniBtn}
                  onPress={() => setSelectedQuantity(prev => ({ ...prev, [item.id]: (prev[item.id] || 1) + 1 }))}
                >
                  <Plus color="#FFFFFF" size={13} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => {
                    const qty = selectedQuantity[item.id] || 1;
                    const opts = item.coverageOptions?.length ? { coverage } : {};
                    for (let i = 0; i < qty; i++) handleAddToCart(item, opts);
                    setSelectedQuantity(prev => ({ ...prev, [item.id]: 1 }));
                  }}
                >
                  <ShoppingCart color="#0A0A0A" size={13} />
                  <Text style={styles.addToCartText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Text style={styles.brandMora}>Mora<Text style={styles.brandProtein}>Protein</Text></Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.workBtn} onPress={() => setWorkWithUsVisible(true)}>
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

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        onScrollBeginDrag={handleScroll}
        scrollEventThrottle={16}
      >
        {activeCategory === 'Todos' && (
          <>
            <HeroCarousel onCategoryPress={(cat) => setActiveCategory(cat)} />
            
            <View style={styles.comboSection}>
              <View style={styles.comboSectionHeader}>
                <View>
                  <Text style={styles.comboSectionLabel}>PROMOS</Text>
                  <Text style={styles.comboSectionTitle}>Combos Especiales</Text>
                </View>
                <Text style={styles.comboSectionHint}>Desliza para ver más</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.comboScrollContent}>
                {comboPromotions.map(renderComboBanner)}
              </ScrollView>
            </View>

            <View style={styles.carouselSection}><FeaturedProductsCarousel /></View>
            <View style={styles.carouselSection}><TestimonialsCarousel /></View>
            <BrandsCarousel />
          </>
        )}

        {(activeCategory === 'Todos' || activeCategory === 'Quiénes Somos') && (
          <View><AboutUsSection onWorkWithUsPress={() => setWorkWithUsVisible(true)} /></View>
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

        {(activeCategory === 'Todos' || activeCategory === 'Bombones') && (
          <View style={{ marginTop: activeCategory === 'Bombones' ? 20 : 0 }}>
            <BombonesHorizontalBanner onAddToCart={(name) => showToast(`¡${name} al carrito!`)} />
          </View>
        )}

        {categories.map(category => {
          if (activeCategory !== 'Todos' && activeCategory !== category) return null;
          const catProducts = NON_BOMBON_PRODUCTS.filter(p => p.category === category);
          return (
            <View key={category} style={[styles.categorySection, activeCategory !== 'Todos' && { marginTop: 20 }]}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.categoryBadge}><Text style={styles.categoryBadgeText}>{catProducts.length}</Text></View>
                </View>
                <View style={styles.categoryLine} />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsHorizontalScroll}>
                {catProducts.map(product => renderProduct(product))}
              </ScrollView>
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Mora<Text style={styles.footerBrandAccent}>Protein</Text></Text>
          <Text style={styles.footerText}>Snacks artesanales con proteína real. Sin azúcar añadida.</Text>
          <TouchableOpacity onPress={openInstagram} style={styles.footerInstagram}>
            <Instagram color="#C9A96E" size={18} />
            <Text style={styles.footerInstagramText}>@mora.protein</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerTrack} onPress={() => navigation.navigate('OrderTracking')}>
            <Text style={styles.footerTrackText}>📦 Estado de Pedidos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ToastMessage visible={toastVisible} message={toastMessage} />
      <ProductDetailModal
        product={selectedProduct}
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        onAddToCart={(name) => { setDetailModalVisible(false); showToast(`¡${name} al carrito!`); }}
      />
      <WorkWithUsModal visible={workWithUsVisible} onClose={() => setWorkWithUsVisible(false)} />
      <PromoDetailModal
        visible={!!activeModal}
        item={activeModal}
        onClose={() => setActiveModal(null)}
        onPrimaryAction={handleModalAction}
      />
      <Modal visible={adPopupVisible} transparent animationType="fade" onRequestClose={() => setAdPopupVisible(false)}>
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <TouchableOpacity style={styles.popupClose} onPress={() => setAdPopupVisible(false)}><Text style={styles.popupCloseText}>✕</Text></TouchableOpacity>
            <Text style={styles.popupEyebrow}>🎉 OFERTA ESPECIAL</Text>
            <Text style={styles.popupTitle}>15% OFF{'\n'}en tu primer pedido</Text>
            <Text style={styles.popupBody}>Usa el código al hacer tu pedido</Text>
            <View style={styles.popupCode}><Text style={styles.popupCodeText}>MORA15</Text></View>
            <TouchableOpacity style={styles.popupBtn} onPress={() => { setAdPopupVisible(false); navigation.navigate('Cart'); }}><Text style={styles.popupBtnText}>Ir al carrito →</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  scrollView: { flex: 1, backgroundColor: '#0A0A0A' },
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
  navButtonActive: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  navButtonText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
  navButtonTextActive: { color: '#0A0A0A' },
  scrollContent: { paddingBottom: 40 },
  carouselSection: { marginTop: 28 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 20, marginBottom: 10, marginTop: 4 },
  titleContainer: { marginHorizontal: 20, marginTop: 25, marginBottom: 20 },
  mainTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 5 },
  subtitle: { color: '#666666', fontSize: 14 },
  comboSection: { marginTop: 28 },
  comboSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 16, gap: 10 },
  comboSectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2.5, color: '#C9A96E', marginBottom: 4 },
  comboSectionTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  comboSectionHint: { color: '#6B7280', fontSize: 11, fontWeight: '700' },
  comboScrollContent: { paddingHorizontal: 20, gap: 14 },
  comboBanner: { width: 288, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#1A1A1A' },
  comboBannerImage: { height: 190, justifyContent: 'flex-end' },
  comboBannerImageStyle: { opacity: 0.95 },
  comboBannerOverlay: { padding: 18, backgroundColor: 'rgba(10,10,10,0.58)', minHeight: 190, justifyContent: 'flex-end' },
  comboBadge: { color: '#C9A96E', fontSize: 10, fontWeight: '800', letterSpacing: 2.2, marginBottom: 8 },
  comboTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: -0.7, marginBottom: 6 },
  comboSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 20, marginBottom: 14 },
  comboCta: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  categorySection: { marginBottom: 40, backgroundColor: '#141414', paddingVertical: 20, borderRadius: 20, marginHorizontal: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginBottom: 20 },
  categoryTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 15 },
  categoryTitle: { color: '#C9A96E', fontSize: 20, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
  categoryBadge: { backgroundColor: 'rgba(201,169,110,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)' },
  categoryBadgeText: { fontSize: 12, fontWeight: '800', color: '#C9A96E' },
  categoryLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  productsHorizontalScroll: { paddingHorizontal: 15, gap: 16, paddingBottom: 10 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  imageContainer: { position: 'relative', height: 180, backgroundColor: '#2A2A2A' },
  productImage: { width: '100%', height: '100%' },
  cardContent: { padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  cardPrice: { color: '#C9A96E', fontSize: 14, fontWeight: '900' },
  productName: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginBottom: 4, letterSpacing: -0.3 },
  productDescription: { color: '#888888', fontSize: 12, lineHeight: 18, marginBottom: 12, minHeight: 36 },
  categoryTag: { backgroundColor: 'rgba(201,169,110,0.12)', color: '#C9A96E', fontSize: 9, fontWeight: '800', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, textTransform: 'uppercase', letterSpacing: 0.5, borderWidth: 1, borderColor: 'rgba(201,169,110,0.25)' },
  coverageContainer: { marginBottom: 12 },
  optionsLabel: { fontSize: 10, color: '#666', fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
  coverageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  coverageOption: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: '#2A2A2A', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  coverageSelected: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  coverageText: { color: '#999', fontSize: 10, fontWeight: '700' },
  coverageTextSelected: { color: '#0A0A0A' },
  cardActions: { flexDirection: 'column', gap: 10 },
  qtyAddRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A2A2A', borderRadius: 12, padding: 4, gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  qtyMiniBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#333333', justifyContent: 'center', alignItems: 'center' },
  qtyMiniNum: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', minWidth: 20, textAlign: 'center' },
  detailBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  detailBtnText: { color: '#AAAAAA', fontSize: 12, fontWeight: '700' },
  addToCartButton: { flex: 1, backgroundColor: '#C9A96E', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 5 },
  addToCartText: { color: '#0A0A0A', fontSize: 12, fontWeight: '900' },
  footer: { marginTop: 20, marginHorizontal: 20, padding: 28, backgroundColor: '#141414', borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 20 },
  footerBrand: { color: '#FFFFFF', fontWeight: '900', fontSize: 24, letterSpacing: -0.5, marginBottom: 8 },
  footerBrandAccent: { color: '#C9A96E' },
  footerText: { color: '#555555', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 14 },
  footerInstagram: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  footerInstagramText: { color: '#C9A96E', fontSize: 14, fontWeight: '700' },
  footerTrack: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14 },
  footerTrackText: { color: '#888888', fontSize: 12, fontWeight: '600' },
  popupOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  popupCard: { backgroundColor: '#141414', borderRadius: 24, padding: 28, width: '100%', maxWidth: 380, borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)', shadowColor: '#C9A96E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 30, elevation: 20 },
  popupClose: { alignSelf: 'flex-end', marginBottom: 12 },
  popupCloseText: { color: '#555555', fontSize: 18, fontWeight: '700' },
  popupEyebrow: { color: '#C9A96E', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  popupTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5, lineHeight: 34, marginBottom: 12 },
  popupBody: { color: '#666666', fontSize: 14, marginBottom: 18 },
  popupCode: { backgroundColor: 'rgba(201,169,110,0.12)', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: '#C9A96E', marginBottom: 18, borderStyle: 'dashed' },
  popupCodeText: { color: '#C9A96E', fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  popupBtn: { backgroundColor: '#C9A96E', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  popupBtnText: { color: '#0A0A0A', fontSize: 15, fontWeight: '900' },
});
