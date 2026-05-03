import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { ShoppingCart, Plus } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';

const BOMBONES = products.filter(p => p.category === 'Bombones');

const FLAVOR_COLORS = {
  'Coco y Cacao':                     { bg: '#3D2B1F', accent: '#A0522D' },
  'Pistacho con Chocolate Blanco':    { bg: '#1E2E1E', accent: '#7CB97C' },
  'Almendra con Chocolate Blanco':    { bg: '#2A2010', accent: '#C9A96E' },
};

export default function BombonesHorizontalBanner({ onAddToCart }) {
  const { addToCart } = useContext(CartContext);
  const [addedId, setAddedId] = useState(null);

  const handleAdd = (item) => {
    addToCart(item, {});
    setAddedId(item.id);
    onAddToCart?.(item.name);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <View style={styles.wrapper}>
      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.label}>BOMBONES</Text>
        <Text style={styles.title}>Lujo en cada bocado</Text>
      </View>

      {/* Background image strip */}
      <View style={styles.imageStrip}>
        <Image
          source={require('../../assets/bombones.jpg')}
          style={styles.stripImage}
          resizeMode="cover"
        />
        <View style={styles.stripOverlay} />
      </View>

      {/* Flavor pills scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {BOMBONES.map(item => {
          const colors = FLAVOR_COLORS[item.flavor] || { bg: '#1E1E1E', accent: '#C9A96E' };
          const isAdded = addedId === item.id;
          return (
            <View key={item.id} style={[styles.pill, { backgroundColor: colors.bg }]}>
              <View style={[styles.pillAccent, { backgroundColor: colors.accent }]} />
              <View style={styles.pillContent}>
                <Text style={styles.pillFlavor} numberOfLines={2}>{item.flavor}</Text>
                <Text style={[styles.pillPrice, { color: colors.accent }]}>
                  ${item.price.toLocaleString('es-CL')}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.pillBtn, { backgroundColor: colors.accent }, isAdded && styles.pillBtnAdded]}
                onPress={() => handleAdd(item)}
                activeOpacity={0.8}
              >
                {isAdded
                  ? <Text style={styles.pillBtnText}>✓</Text>
                  : <Plus color="#0A0A0A" size={16} />
                }
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <Text style={styles.footnote}>12g Proteína · Sin azúcar · Hecho artesanalmente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 12,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  label: {
    color: '#C9A96E', fontSize: 10, fontWeight: '800', letterSpacing: 2.5,
    marginBottom: 2,
  },
  title: {
    color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: -0.5,
    marginBottom: 14,
  },
  imageStrip: {
    height: 100, position: 'relative',
  },
  stripImage: { width: '100%', height: '100%' },
  stripOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10,10,10,0.55)',
  },
  pillsRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  pill: {
    width: 160,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  pillAccent: {
    width: 3, height: '100%', borderRadius: 2, minHeight: 40,
  },
  pillContent: { flex: 1 },
  pillFlavor: {
    color: '#FFFFFF', fontSize: 12, fontWeight: '800', lineHeight: 16,
    marginBottom: 3,
  },
  pillPrice: {
    fontSize: 13, fontWeight: '900',
  },
  pillBtn: {
    width: 32, height: 32, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  pillBtnAdded: { opacity: 0.8 },
  pillBtnText: {
    color: '#0A0A0A', fontWeight: '900', fontSize: 14,
  },
  footnote: {
    color: '#555555', fontSize: 11, textAlign: 'center',
    paddingBottom: 16, paddingTop: 4,
  },
});
