import React from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  Linking, ScrollView, Image,
} from 'react-native';
import { X, MessageCircle, Package, TrendingUp, Users } from 'lucide-react-native';

const BENEFITS = [
  {
    Icon: Package,
    title: 'Productos artesanales',
    desc: 'Barras, galletones y bombones de proteína premium hechos con ingredientes reales.',
  },
  {
    Icon: TrendingUp,
    title: 'Márgenes atractivos',
    desc: 'Precios preferenciales y condiciones especiales para distribuidores y partners.',
  },
  {
    Icon: Users,
    title: 'Comunidad en crecimiento',
    desc: 'Únete a una red de gimnasios, cafeterías y tiendas wellness en todo Chile.',
  },
];

export default function WorkWithUsModal({ visible, onClose }) {
  const openWhatsApp = () => {
    const msg = '¡Hola Mora Protein! Quiero saber más sobre cómo distribuir sus productos.';
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(msg)}&phone=+56954099576`).catch(
      () => Linking.openURL(`https://wa.me/56954099576?text=${encodeURIComponent(msg)}`)
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <View style={styles.handle} />
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoBadge}>
            <Image
              source={require('../../assets/logo-cuadrado.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.eyebrow}>DISTRIBUIDORES & PARTNERS</Text>
          <Text style={styles.headline}>
            Lleva el sabor de Mora Protein a tus clientes.
          </Text>
          <Text style={styles.body}>
            Trabajamos con gimnasios, tiendas de bienestar, cafeterías y emprendedores que
            quieren ofrecer snacks proteicos artesanales de calidad premium a su comunidad.
          </Text>

          <View style={styles.divider} />

          {BENEFITS.map(({ Icon, title, desc }) => (
            <View key={title} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Icon color="#C9A96E" size={20} />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{title}</Text>
                <Text style={styles.benefitDesc}>{desc}</Text>
              </View>
            </View>
          ))}

          <View style={styles.divider} />

          <TouchableOpacity style={styles.cta} onPress={openWhatsApp} activeOpacity={0.85}>
            <MessageCircle color="#0A0A0A" size={20} />
            <Text style={styles.ctaText}>Contactar por WhatsApp</Text>
          </TouchableOpacity>

          <Text style={styles.emailNote}>¿Preguntas? mora.protein@gmail.com</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  topBar: {
    paddingTop: 16, paddingHorizontal: 20, paddingBottom: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1E1E1E', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  content: { paddingHorizontal: 28, paddingBottom: 48, paddingTop: 12 },
  logoBadge: {
    width: 80, height: 80, borderRadius: 22,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24, marginTop: 8,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
  },
  logo: { width: 62, height: 62 },
  eyebrow: {
    color: '#C9A96E', fontSize: 10, fontWeight: '800',
    letterSpacing: 2.5, marginBottom: 10,
  },
  headline: {
    color: '#FFFFFF', fontSize: 28, fontWeight: '900',
    letterSpacing: -0.5, lineHeight: 34, marginBottom: 14,
  },
  body: {
    color: '#777777', fontSize: 15, lineHeight: 24, marginBottom: 28,
  },
  divider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 28,
  },
  benefitRow: {
    flexDirection: 'row', gap: 16, marginBottom: 22, alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: 'rgba(201,169,110,0.1)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.2)',
  },
  benefitText: { flex: 1 },
  benefitTitle: {
    color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4,
  },
  benefitDesc: { color: '#666666', fontSize: 13, lineHeight: 20 },
  cta: {
    backgroundColor: '#C9A96E',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 16, gap: 10, marginBottom: 16,
  },
  ctaText: { color: '#0A0A0A', fontSize: 16, fontWeight: '900' },
  emailNote: {
    color: '#444444', fontSize: 12, textAlign: 'center',
  },
});
