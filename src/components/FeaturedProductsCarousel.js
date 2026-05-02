import React, { useContext, useState } from 'react';
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

// Pick one representative product per category as "featured"
const FEATURED = [
  ...products.filter((p) => p.category === 'Barras Proteicas'),
  ...products.filter((p) => p.category === 'Galletones'),
  ...products.filter((p) => p.category === 'Bombones'),
].slice(0, 6);

export default function FeaturedProductsCarousel({ onProductPress }) {
  const { addToCart } = useContext(CartContext);
  const { width } = useWindowDimensions();

  // Card width: ~72% of screen so the next card peeks in
  const CARD_WIDTH = Math.min(width * 0.72, 260);
  const CARD_MARGIN = 12;

  const handleAdd = (item) => {
    const options = item.coverageOptions?.length
      ? { coverage: item.coverageOptions[0] }
      : {};
    addToCart(item, options);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      activeOpacity={0.88}
      onPress={() => onProductPress && onProductPress(item)}
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
          <ShoppingCart color="#fff" size={14} />
          <Text style={styles.addButtonText}>Añadir al carrito</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
  listContent: {
    paddingBottom: 4,
  },
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
  imageWrapper: {
    position: 'relative',
    height: 160,
    backgroundColor: '#F7F4F0',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(26, 26, 26, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priceBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
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
  productName: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  productDesc: {
    color: '#888',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
