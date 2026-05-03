import React, { useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, ImageBackground, useWindowDimensions } from 'react-native';
import { products } from '../data/products';
import { ShoppingCart, Instagram } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';
import HeroCarousel from '../components/HeroCarousel';
import FeaturedProductsCarousel from '../components/FeaturedProductsCarousel';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import BrandsCarousel from '../components/BrandsCarousel';
import PromoDetailModal from '../components/PromoDetailModal';
import { comboPromotions } from '../data/combos';
import { PRODUCT_CATEGORIES } from '../data/categories';

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
  const [selectedCoverage, setSelectedCoverage] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const { width } = useWindowDimensions();
  const scrollRef = useRef(null);
  const sectionPositions = useRef({});

  const scrollToSection = (category) => {
    const y = sectionPositions.current[category];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: y - 10, animated: true });
    }
  };

  const categories = [...new Set(products.map((p) => p.category))].sort((a, b) => {
    if (a === PRODUCT_CATEGORIES.BARS) return -1;
    if (b === PRODUCT_CATEGORIES.BARS) return 1;
    return a.localeCompare(b);
  });

  let columns = 1;
  if (width > 1200) columns = 4;
  else if (width > 800) columns = 3;
  else if (width > 500) columns = 2;

  const outerPadding = 20;
  const gap = 16;
  const totalGapWidth = gap * (columns - 1);
  const cardWidth = (width - (outerPadding * 2) - totalGapWidth) / columns;

  const renderProduct = (item) => {
    const coverage = selectedCoverage[item.id] || item.coverageOptions?.[0];

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.8}
        style={[styles.card, { width: cardWidth }]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>${item.price}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.categoryTag}>{item.category}</Text>
          </View>

          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => setActiveModal(buildProductModal(item))}
            activeOpacity={0.85}
          >
            <Text style={styles.detailButtonText}>Ver detalles</Text>
          </TouchableOpacity>

          {item.coverageOptions?.length > 0 && (
            <View style={styles.coverageContainer}>
              <Text style={styles.optionsLabel}>Cobertura:</Text>
              <View style={styles.coverageRow}>
                {item.coverageOptions.map(opt => (
                  <TouchableOpacity
                    key={`${item.id}-${opt}`}
                    style={[styles.coverageOption, coverage === opt && styles.coverageSelected]}
                    onPress={() => setSelectedCoverage(prev => ({ ...prev, [item.id]: opt }))}
                  >
                    <Text style={[styles.coverageText, coverage === opt && styles.coverageTextSelected]}>
                      {opt === 'Chocolate Negro' ? 'Negro' : opt === 'Chocolate Blanco' ? 'Blanco' : opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => {
              const options = item.coverageOptions?.length ? { coverage } : {};
              addToCart(item, options);
              alert(`Agregado: ${item.name}${coverage ? ` (${coverage})` : ''}`);
            }}
          >
            <ShoppingCart color="#0A0A0A" size={16} />
            <Text style={styles.addToCartText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
      const product = activeModal.product;
      setActiveModal(null);
      navigation.navigate('ProductDetail', { product });
      return;
    }

    if (activeModal.targetCategory) {
      const category = activeModal.targetCategory;
      setActiveModal(null);
      scrollToSection(category);
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

  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/mora.protein');
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header oscuro fijo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Text style={styles.brandMora}>Mora<Text style={styles.brandProtein}>Protein</Text></Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartButton}>
              <Text style={styles.cartButtonText}>VER PRODUCTOS</Text>
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryNav}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={`nav-${cat}`}
              style={styles.navButton}
              onPress={() => scrollToSection(cat)}
            >
              <Text style={styles.navButtonText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Hero Carousel */}
        <HeroCarousel onCategoryPress={scrollToSection} />

        <View style={styles.comboSection}>
          <View style={styles.comboSectionHeader}>
            <View>
              <Text style={styles.comboSectionLabel}>PROMOS</Text>
              <Text style={styles.comboSectionTitle}>Banners de combos</Text>
            </View>
            <Text style={styles.comboSectionHint}>Toca para ver detalles</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.comboScrollContent}
          >
            {comboPromotions.map(renderComboBanner)}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.carouselSection}>
          <FeaturedProductsCarousel
            onProductPress={(product) => navigation.navigate('ProductDetail', { product })}
          />
        </View>

        {/* Testimonials */}
        <View style={styles.carouselSection}>
          <TestimonialsCarousel />
        </View>

        {/* Brands */}
        <BrandsCarousel />

        <View style={styles.divider} />

        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Nuestro Menú</Text>
          <Text style={styles.subtitle}>Descubre todos nuestros snacks separadas por categoría.</Text>
        </View>

        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.category === category);
          return (
            <View
              key={category}
              style={styles.categorySection}
              onLayout={(event) => {
                const { y } = event.nativeEvent.layout;
                sectionPositions.current[category] = y;
              }}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{categoryProducts.length}</Text>
                  </View>
                </View>
                <View style={styles.categoryLine} />
              </View>

              <View style={styles.productsGrid}>
                {categoryProducts.map(product => renderProduct(product))}
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
        </View>
      </ScrollView>

      <PromoDetailModal
        visible={!!activeModal}
        item={activeModal}
        onClose={() => setActiveModal(null)}
        onPrimaryAction={handleModalAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  // ── HEADER ──
  header: {
    paddingTop: 50,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  logoContainer: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.3)',
  },
  brandMora: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: -0.5,
  },
  brandProtein: {
    color: '#C9A96E',
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartButton: {
    borderWidth: 1,
    borderColor: '#C9A96E',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 4,
  },
  cartButtonText: {
    color: '#C9A96E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  iconButton: {
    padding: 8,
  },
  badgeContainer: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#C9A96E',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#0A0A0A',
    fontSize: 10,
    fontWeight: '900',
  },
  categoryNav: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8,
  },
  navButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  navButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── SCROLL CONTENT ──
  scrollContent: {
    paddingBottom: 40,
  },
  carouselSection: {
    marginTop: 28,
  },
  comboSection: {
    marginTop: 28,
  },
  comboSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  comboSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#C9A96E',
    marginBottom: 4,
  },
  comboSectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  comboSectionHint: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
  },
  comboScrollContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  comboBanner: {
    width: 288,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#1A1A1A',
  },
  comboBannerImage: {
    height: 190,
    justifyContent: 'flex-end',
  },
  comboBannerImageStyle: {
    opacity: 0.95,
  },
  comboBannerOverlay: {
    padding: 18,
    backgroundColor: 'rgba(10,10,10,0.58)',
    minHeight: 190,
    justifyContent: 'flex-end',
  },
  comboBadge: {
    color: '#C9A96E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginBottom: 8,
  },
  comboTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.7,
    marginBottom: 6,
  },
  comboSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  comboCta: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // ── DIVIDER ──
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 4,
  },

  // ── MENU TITLE ──
  titleContainer: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 5,
  },
  subtitle: {
    color: '#666666',
    fontSize: 14,
  },

  // ── CATEGORY SECTION ──
  categorySection: {
    marginBottom: 40,
    backgroundColor: '#141414',
    paddingVertical: 20,
    borderRadius: 20,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 15,
  },
  categoryTitle: {
    color: '#C9A96E',
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  categoryBadge: {
    backgroundColor: 'rgba(201,169,110,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.3)',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C9A96E',
  },
  categoryLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // ── PRODUCTS GRID ──
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
    gap: 16,
  },

  // ── PRODUCT CARD ──
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#2A2A2A',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(10,10,10,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.4)',
  },
  priceBadgeText: {
    color: '#C9A96E',
    fontSize: 14,
    fontWeight: '700',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  productDescription: {
    color: '#888888',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
    minHeight: 36,
  },
  detailButton: {
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.35)',
    backgroundColor: 'rgba(201,169,110,0.08)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#C9A96E',
    fontSize: 12,
    fontWeight: '800',
  },
  categoryTag: {
    backgroundColor: 'rgba(201,169,110,0.12)',
    color: '#C9A96E',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.25)',
  },
  coverageContainer: {
    marginBottom: 16,
  },
  optionsLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  coverageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  coverageOption: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  coverageSelected: {
    backgroundColor: '#C9A96E',
    borderColor: '#C9A96E',
  },
  coverageText: {
    color: '#999',
    fontSize: 11,
    fontWeight: '700',
  },
  coverageTextSelected: {
    color: '#0A0A0A',
  },
  addToCartButton: {
    backgroundColor: '#C9A96E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  addToCartText: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '900',
  },

  // ── FOOTER ──
  footer: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 28,
    backgroundColor: '#141414',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  footerBrand: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 24,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  footerBrandAccent: {
    color: '#C9A96E',
  },
  footerText: {
    color: '#555555',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  footerInstagram: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerInstagramText: {
    color: '#C9A96E',
    fontSize: 14,
    fontWeight: '700',
  },
});
