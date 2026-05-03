import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import { PRODUCT_CATEGORIES } from '../data/categories';

const FEATURED = [
  ...products.filter((p) => p.category === PRODUCT_CATEGORIES.BARS),
  ...products.filter((p) => p.category === PRODUCT_CATEGORIES.COOKIES),
  ...products.filter((p) => p.category === PRODUCT_CATEGORIES.BONBONS),
].slice(0, 6);

export default function FeaturedProductsCarousel() {
  const { addToCart } = useContext(CartContext);
  const { width } = useWindowDimensions();

  const CARD_WIDTH = Math.min(width * 0.72, 260);
  const CARD_MARGIN = 12;

  const handleAdd = (item) => {
    const options = item.coverageOptions?.length
      ? { coverage: item.coverageOptions[0] }
      : {};
    addToCart(item, options);
  };

  const renderItem = ({ item }) => (
    <View
      style={[styles.card, { width: CARD_WIDTH }]}
    >
      {/* Image */}
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>${item.price}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardBody}>
        <Text style={styles.categoryTag}>{item.category}</Text>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAdd(item)}
          activeOpacity={0.85}
        >
          <ShoppingCart color="#0A0A0A" size={14} />
          <Text style={styles.addButtonText}>Añadir al carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.section}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>DESTACADOS</Text>
          <Text style={styles.sectionTitle}>Nuestros Favoritos</Text>
        </View>
      </View>

      <FlatList
        data={FEATURED}
        keyExtractor={(item) => `featured-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: 20 }]}
        ItemSeparatorComponent={() => <View style={{ width: CARD_MARGIN }} />}
        renderItem={renderItem}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#C9A96E',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingBottom: 4,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  imageWrapper: {
    position: 'relative',
    height: 160,
    backgroundColor: '#2A2A2A',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(10,10,10,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.4)',
  },
  priceBadgeText: {
    color: '#C9A96E',
    fontSize: 13,
    fontWeight: '700',
  },
  cardBody: {
    padding: 14,
  },
  categoryTag: {
    backgroundColor: 'rgba(201,169,110,0.12)',
    color: '#C9A96E',
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
    borderColor: 'rgba(201,169,110,0.25)',
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  productDesc: {
    color: '#666666',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#C9A96E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    color: '#0A0A0A',
    fontSize: 12,
    fontWeight: '900',
  },
});
