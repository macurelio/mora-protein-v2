import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { Instagram, MessageCircle, Heart } from 'lucide-react-native';

const VALUES = [
  { emoji: '🌾', label: 'Artesanal', desc: 'Hecho a mano' },
  { emoji: '💪', label: '15g Proteína', desc: 'Por barra' },
  { emoji: '🚫', label: 'Sin Azúcar', desc: 'Sin culpa' },
];

export default function AboutUsSection({ onWorkWithUsPress }) {
  const openInstagram = () => Linking.openURL('https://www.instagram.com/mora.protein');
  const openWhatsApp = () => {
    const msg = '¡Hola! Me gustaría saber más sobre Mora Protein.';
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(msg)}&phone=+56954099576`).catch(
      () => Linking.openURL(`https://wa.me/56954099576`)
    );
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>QUIÉNES SOMOS</Text>
          <Text style={styles.title}>La proteína más{'\n'}sabrosa de Chile.</Text>
        </View>
        <Image
          source={require('../../assets/logo-circular.png')}
          style={styles.logoCircle}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.body}>
        Mora Protein nació con una misión: demostrarte que comer saludable no tiene que ser
        aburrido. Elaboramos cada producto de forma artesanal, con ingredientes reales y sin
        comprometer el sabor.
      </Text>

      {/* Values */}
      <View style={styles.valuesRow}>
        {VALUES.map(v => (
          <View key={v.label} style={styles.valueCard}>
            <Text style={styles.valueEmoji}>{v.emoji}</Text>
            <Text style={styles.valueLabel}>{v.label}</Text>
            <Text style={styles.valueDesc}>{v.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Buttons */}
      <View style={styles.btnsRow}>
        <TouchableOpacity style={styles.btnSecondary} onPress={openInstagram} activeOpacity={0.8}>
          <Instagram color="#C9A96E" size={16} />
          <Text style={styles.btnSecondaryText}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={openWhatsApp} activeOpacity={0.8}>
          <MessageCircle color="#C9A96E" size={16} />
          <Text style={styles.btnSecondaryText}>Contacto</Text>
        </TouchableOpacity>
        {onWorkWithUsPress && (
          <TouchableOpacity style={styles.btnPrimary} onPress={onWorkWithUsPress} activeOpacity={0.85}>
            <Heart color="#0A0A0A" size={16} />
            <Text style={styles.btnPrimaryText}>Trabaja con nosotros</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 12,
    marginBottom: 32,
    marginTop: 8,
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  label: {
    color: '#C9A96E', fontSize: 10, fontWeight: '800', letterSpacing: 2.5,
    marginBottom: 6,
  },
  title: {
    color: '#FFFFFF', fontSize: 24, fontWeight: '900',
    letterSpacing: -0.5, lineHeight: 30,
  },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
  },
  body: {
    color: '#666666', fontSize: 14, lineHeight: 22, marginBottom: 20,
  },
  valuesRow: {
    flexDirection: 'row', gap: 10, marginBottom: 20,
  },
  valueCard: {
    flex: 1, backgroundColor: '#1E1E1E',
    borderRadius: 14, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  valueEmoji: { fontSize: 22, marginBottom: 6 },
  valueLabel: {
    color: '#FFFFFF', fontSize: 11, fontWeight: '900',
    textAlign: 'center', letterSpacing: 0.2,
  },
  valueDesc: {
    color: '#555555', fontSize: 10, textAlign: 'center', marginTop: 2,
  },
  divider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 18,
  },
  btnsRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  btnSecondary: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.4)',
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
  },
  btnSecondaryText: {
    color: '#C9A96E', fontSize: 13, fontWeight: '700',
  },
  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#C9A96E',
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
  },
  btnPrimaryText: {
    color: '#0A0A0A', fontSize: 13, fontWeight: '800',
  },
});
