import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { ShoppingCart, ArrowLeft, Minus, Plus, Check } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [coverage, setCoverage] = useState(product.coverageOptions?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { width } = useWindowDimensions();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const handleAdd = () => {
    animateButton();
    const options = product.coverageOptions?.length ? { coverage } : {};
    for (let i = 0; i < quantity; i++) {
      addToCart(product, options);
    }
    setAdded(true);
    Animated.timing(checkAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setTimeout(() => {
      setAdded(false);
      Animated.timing(checkAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }, 2000);
  };

  const totalPrice = (product.price * quantity).toLocaleString();

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={[styles.heroWrapper, { height: width * 0.65 }]}>
          <Image
            source={product.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Gradient overlay bottom */}
          <View style={styles.heroOverlay} />

          {/* Back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <ArrowLeft color="#FFFFFF" size={20} />
          </TouchableOpacity>

          {/* Price pill on image */}
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>${product.price.toLocaleString()}</Text>
          </View>
        </View>

        {/* Product Card */}
        <View style={styles.card}>
          {/* Category tag */}
          <View style={styles.categoryRow}>
            <Text style={styles.categoryTag}>{product.category}</Text>
          </View>

          {/* Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Flavor / subtitle */}
          {product.flavor ? (
            <Text style={styles.flavorText}>{product.flavor}</Text>
          ) : null}

          {/* Description */}
          <Text style={styles.descriptionText}>{product.description}</Text>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Coverage */}
          {product.coverageOptions?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>COBERTURA</Text>
              <View style={styles.coverageRow}>
                {product.coverageOptions.map(option => (
                  <TouchableOpacity
                    key={`${product.id}-${option}`}
                    style={[
                      styles.coverageChip,
                      coverage === option && styles.coverageChipSelected,
                    ]}
                    onPress={() => setCoverage(option)}
                    activeOpacity={0.8}
                  >
                    {coverage === option && (
                      <Check color="#0A0A0A" size={12} style={{ marginRight: 4 }} />
                    )}
                    <Text
                      style={[
                        styles.coverageChipText,
                        coverage === option && styles.coverageChipTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CANTIDAD</Text>
            <View style={styles.quantityWrapper}>
              <TouchableOpacity
                style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                activeOpacity={0.8}
              >
                <Minus color={quantity <= 1 ? '#444' : '#FFFFFF'} size={18} />
              </TouchableOpacity>

              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyNumber}>{quantity}</Text>
                <Text style={styles.qtyUnit}>unid.</Text>
              </View>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(prev => prev + 1)}
                activeOpacity={0.8}
              >
                <Plus color="#FFFFFF" size={18} />
              </TouchableOpacity>

              {/* Total inline */}
              <View style={styles.totalInline}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${totalPrice}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Add to Cart Button */}
      <View style={styles.stickyBar}>
        <Animated.View style={[styles.addButtonWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            style={[styles.addButton, added && styles.addButtonDone]}
            onPress={handleAdd}
            activeOpacity={0.9}
          >
            {added ? (
              <>
                <Check color="#0A0A0A" size={20} />
                <Text style={styles.addButtonText}>¡Agregado al carrito!</Text>
              </>
            ) : (
              <>
                <ShoppingCart color="#0A0A0A" size={20} />
                <Text style={styles.addButtonText}>
                  Agregar {quantity > 1 ? `${quantity} ` : ''}al carrito · ${totalPrice}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },

  // ── HERO ──
  heroWrapper: {
    position: 'relative',
    backgroundColor: '#1A1A1A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    background: 'linear-gradient(transparent, #0A0A0A)',
    backgroundColor: 'rgba(10,10,10,0.4)',
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pricePill: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#C9A96E',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pricePillText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '900',
  },

  // ── PRODUCT CARD ──
  card: {
    backgroundColor: '#141414',
    marginHorizontal: 12,
    marginTop: -20,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  categoryRow: {
    marginBottom: 10,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,169,110,0.12)',
    color: '#C9A96E',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.3)',
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
    lineHeight: 34,
  },
  flavorText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#999999',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: 20,
  },

  // ── SECTIONS ──
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#555555',
    letterSpacing: 2,
    marginBottom: 12,
  },

  // ── COVERAGE CHIPS ──
  coverageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  coverageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: '#1E1E1E',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  coverageChipSelected: {
    backgroundColor: '#C9A96E',
    borderColor: '#C9A96E',
  },
  coverageChipText: {
    color: '#AAAAAA',
    fontSize: 13,
    fontWeight: '700',
  },
  coverageChipTextSelected: {
    color: '#0A0A0A',
  },

  // ── QUANTITY ──
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyDisplay: {
    alignItems: 'center',
    minWidth: 48,
  },
  qtyNumber: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
  },
  qtyUnit: {
    color: '#555',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  totalInline: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  totalLabel: {
    color: '#555555',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  totalValue: {
    color: '#C9A96E',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  // ── STICKY BAR ──
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: 'rgba(10,10,10,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  addButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addButton: {
    backgroundColor: '#C9A96E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  addButtonDone: {
    backgroundColor: '#5CB85C',
  },
  addButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});