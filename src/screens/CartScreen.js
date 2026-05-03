import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Linking, Modal, ScrollView, Image,
} from 'react-native';
import { Zap, Tag, Check, MessageCircle, Trash2, Plus, Minus, X, Package, Truck, Calendar } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';

const DISCOUNT_CODES = {
  'MORA10':    { discount: 0.10, message: '10% de descuento aplicado ✓' },
  'MORA15':    { discount: 0.15, message: '15% de descuento aplicado ✓' },
  'FUTURO20':  { discount: 0.20, message: '20% de descuento (Bono Futurista) ✓' },
  'AFILIADO50':{ discount: 0.50, message: '50% de descuento de Afiliado ✓' },
};

const PACKS = [
  { id: 'pack1', name: 'Pack 3 Barras Proteicas', desc: 'Elige 3 sabores de barras', price: 5100, savings: 600, emoji: '🍫' },
  { id: 'pack2', name: 'Pack 6 Galletones',       desc: 'Surtido de 6 galletones',   price: 4900, savings: 800, emoji: '🍪' },
  { id: 'pack3', name: 'Combo Completo',           desc: '2 Barras + 2 Galletones + 2 Bombones', price: 9800, savings: 1100, emoji: '⭐' },
];

const DELIVERY_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return {
    label: d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' }),
    value: d.toISOString().split('T')[0],
  };
});

const fmt = (n) => '$' + Number(n).toLocaleString('es-CL');

export default function CartScreen({ navigation }) {
  const { cart, incrementQuantity, decrementQuantity, removeItem, clearCart } = useContext(CartContext);

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState({ code: '', amount: 0, message: '' });
  const [selectedDay, setSelectedDay] = useState(null);
  const [showPacksModal, setShowPacksModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [addedPacks, setAddedPacks] = useState([]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const packTotal = addedPacks.reduce((s, p) => s + p.price, 0);
  const discountAmt = Math.round((subtotal + packTotal) * appliedDiscount.amount);
  const total = subtotal + packTotal - discountAmt;

  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (DISCOUNT_CODES[code]) {
      setAppliedDiscount({ code, amount: DISCOUNT_CODES[code].discount, message: DISCOUNT_CODES[code].message });
    } else {
      setAppliedDiscount({ code: '', amount: 0, message: '' });
      alert('Código no válido o expirado');
    }
  };

  const togglePack = (pack) => {
    setAddedPacks(prev =>
      prev.find(p => p.id === pack.id) ? prev.filter(p => p.id !== pack.id) : [...prev, pack]
    );
  };

  const sendOrderWhatsapp = () => {
    if (!selectedDay) { alert('Por favor selecciona una fecha de entrega'); return; }
    const number = '+56954099576';
    let text = '/// NUEVO PEDIDO MORA PROTEIN ///\n\n';
    cart.forEach(item => {
      text += `[x${item.quantity}] ${item.name}`;
      if (item.coverage) text += ` (${item.coverage})`;
      text += ` → ${fmt(item.price * item.quantity)}\n`;
    });
    if (addedPacks.length) {
      text += '\n— PACKS AGREGADOS —\n';
      addedPacks.forEach(p => { text += `${p.emoji} ${p.name} → ${fmt(p.price)}\n`; });
    }
    text += `\n>> SUBTOTAL: ${fmt(subtotal + packTotal)}`;
    if (appliedDiscount.amount > 0) {
      text += `\n>> CÓDIGO: ${appliedDiscount.code} (-${appliedDiscount.amount * 100}%)`;
      text += `\n>> DESCUENTO: -${fmt(discountAmt)}`;
    }
    text += `\n\n== TOTAL FINAL: ${fmt(total)} ==`;
    text += `\n\n📅 Fecha de entrega: ${selectedDay}`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(text)}&phone=${number}`).catch(
      () => alert('Asegúrate de tener WhatsApp instalado')
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemTop}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.coverage ? <Text style={styles.itemCoverage}>{item.coverage}</Text> : null}
          <Text style={styles.itemUnit}>{fmt(item.price)} c/u</Text>
        </View>
        <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.cartItemId)}>
          <Trash2 color="#EF4444" size={18} />
        </TouchableOpacity>
      </View>
      <View style={styles.itemFooter}>
        <View style={styles.qtyControl}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => decrementQuantity(item.cartItemId)}>
            <Minus color="#1A1A1A" size={15} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => incrementQuantity(item.cartItemId)}>
            <Plus color="#1A1A1A" size={15} />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemTotal}>{fmt(item.price * item.quantity)}</Text>
      </View>
    </View>
  );

  if (cart.length === 0 && addedPacks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>Agrega productos desde el catálogo</Text>
        <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.emptyBtnText}>Ver catálogo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Resumen de Compra</Text>

        {/* Cart items */}
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={item => item.cartItemId || item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />

        {/* Packs added */}
        {addedPacks.length > 0 && (
          <View style={styles.packsAdded}>
            <Text style={styles.sectionLabel}>PACKS AGREGADOS</Text>
            {addedPacks.map(p => (
              <View key={p.id} style={styles.packAddedRow}>
                <Text style={styles.packAddedEmoji}>{p.emoji}</Text>
                <Text style={styles.packAddedName}>{p.name}</Text>
                <Text style={styles.packAddedPrice}>{fmt(p.price)}</Text>
                <TouchableOpacity onPress={() => togglePack(p)}>
                  <X color="#EF4444" size={16} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Add Packs Button */}
        <TouchableOpacity style={styles.addPacksBtn} onPress={() => setShowPacksModal(true)} activeOpacity={0.85}>
          <Package color="#C9A96E" size={18} />
          <Text style={styles.addPacksBtnText}>Agregar Packs</Text>
          <Text style={styles.addPacksBtnSub}>Combina y ahorra</Text>
        </TouchableOpacity>

        {/* Coupon */}
        <View style={styles.couponRow}>
          <View style={styles.couponInputWrap}>
            <Tag color="#888" size={16} />
            <TextInput
              style={styles.couponInput}
              placeholder="CÓDIGO DE DESCUENTO"
              placeholderTextColor="#555"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
          </View>
          <TouchableOpacity style={styles.couponApplyBtn} onPress={applyCoupon}>
            <Text style={styles.couponApplyText}>Aplicar</Text>
          </TouchableOpacity>
        </View>

        {appliedDiscount.code !== '' && (
          <View style={styles.discountBadge}>
            <Check color="#4ADE80" size={15} />
            <Text style={styles.discountText}>{appliedDiscount.message}</Text>
          </View>
        )}

        {/* Date Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>¿CUÁNDO QUIERES TU PEDIDO?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
            {DELIVERY_DAYS.map(day => (
              <TouchableOpacity
                key={day.value}
                style={[styles.dayChip, selectedDay === day.value && styles.dayChipActive]}
                onPress={() => setSelectedDay(day.value)}
              >
                <Text style={[styles.dayText, selectedDay === day.value && styles.dayTextActive]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {!selectedDay && (
            <Text style={styles.dateRequired}>* Requerido para confirmar el pedido</Text>
          )}
        </View>

        {/* Shipping Details */}
        <TouchableOpacity style={styles.shippingBtn} onPress={() => setShowShippingModal(true)} activeOpacity={0.85}>
          <Truck color="#C9A96E" size={16} />
          <Text style={styles.shippingBtnText}>Ver Detalles de Envío</Text>
        </TouchableOpacity>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelText}>Subtotal</Text>
            <Text style={styles.totalValueSm}>{fmt(subtotal + packTotal)}</Text>
          </View>
          {discountAmt > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabelText, { color: '#4ADE80' }]}>
                Descuento ({appliedDiscount.code})
              </Text>
              <Text style={[styles.totalValueSm, { color: '#4ADE80' }]}>-{fmt(discountAmt)}</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text style={styles.totalFinalLabel}>TOTAL</Text>
            <Text style={styles.totalFinalValue}>{fmt(total)}</Text>
          </View>
        </View>

        {/* WhatsApp CTA */}
        <TouchableOpacity style={styles.waBtn} onPress={sendOrderWhatsapp} activeOpacity={0.85}>
          <MessageCircle color="#fff" size={22} />
          <Text style={styles.waBtnText}>Confirmar Pedido por WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* PACKS MODAL */}
      <Modal visible={showPacksModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPacksModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agregar Packs</Text>
            <TouchableOpacity onPress={() => setShowPacksModal(false)} style={styles.modalClose}>
              <X color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>Combina productos y ahorra</Text>
          <ScrollView contentContainerStyle={styles.packsContent}>
            {PACKS.map(pack => {
              const isAdded = !!addedPacks.find(p => p.id === pack.id);
              return (
                <TouchableOpacity
                  key={pack.id}
                  style={[styles.packCard, isAdded && styles.packCardActive]}
                  onPress={() => togglePack(pack)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.packEmoji}>{pack.emoji}</Text>
                  <View style={styles.packInfo}>
                    <Text style={styles.packName}>{pack.name}</Text>
                    <Text style={styles.packDesc}>{pack.desc}</Text>
                    <Text style={styles.packSavings}>Ahorras {fmt(pack.savings)}</Text>
                  </View>
                  <View style={styles.packRight}>
                    <Text style={styles.packPrice}>{fmt(pack.price)}</Text>
                    <View style={[styles.packToggle, isAdded && styles.packToggleActive]}>
                      {isAdded ? <Check color="#0A0A0A" size={16} /> : <Plus color="#C9A96E" size={16} />}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.modalConfirmBtn} onPress={() => setShowPacksModal(false)}>
            <Text style={styles.modalConfirmText}>Confirmar selección</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* SHIPPING MODAL */}
      <Modal visible={showShippingModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowShippingModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles de Envío</Text>
            <TouchableOpacity onPress={() => setShowShippingModal(false)} style={styles.modalClose}>
              <X color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.shippingContent}>
            {[
              { icon: Truck, title: 'Cobertura', desc: 'Enviamos a toda la Región Metropolitana. Zonas específicas bajo coordenadas directas.' },
              { icon: Calendar, title: 'Días de despacho', desc: 'Lunes a Sábado. Pedidos antes de las 12:00 PM salen el mismo día.' },
              { icon: Package, title: 'Empaque', desc: 'Todos los productos se empacan en cajas herméticas para máxima frescura.' },
              { icon: Zap, title: 'Costo de envío', desc: 'Envío gratuito en compras sobre $15.000. Envío estándar: $2.500.' },
            ].map(({ icon: Icon, title, desc }) => (
              <View key={title} style={styles.shippingRow}>
                <View style={styles.shippingIcon}>
                  <Icon color="#C9A96E" size={20} />
                </View>
                <View style={styles.shippingText}>
                  <Text style={styles.shippingTitle}>{title}</Text>
                  <Text style={styles.shippingDesc}>{desc}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 20, paddingBottom: 50 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginBottom: 20, marginTop: 8 },

  // Empty
  emptyContainer: {
    flex: 1, backgroundColor: '#0A0A0A',
    justifyContent: 'center', alignItems: 'center', padding: 40,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginBottom: 8 },
  emptySubtitle: { color: '#666666', fontSize: 14, marginBottom: 28 },
  emptyBtn: {
    backgroundColor: '#C9A96E', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14,
  },
  emptyBtnText: { color: '#0A0A0A', fontSize: 15, fontWeight: '900' },

  // Cart item
  cartItem: {
    backgroundColor: '#141414', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  itemTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12,
  },
  itemInfo: { flex: 1 },
  itemName: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 2 },
  itemCoverage: { color: '#666666', fontSize: 12, textTransform: 'uppercase', marginBottom: 2 },
  itemUnit: { color: '#C9A96E', fontSize: 13, fontWeight: '600' },
  removeBtn: {
    padding: 6, backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E1E1E', borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  qtyBtn: { padding: 8, paddingHorizontal: 12 },
  qtyText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginHorizontal: 8 },
  itemTotal: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },

  // Packs added
  packsAdded: {
    backgroundColor: '#141414', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.2)', marginTop: 10,
  },
  packAddedRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8,
  },
  packAddedEmoji: { fontSize: 18 },
  packAddedName: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', flex: 1 },
  packAddedPrice: { color: '#C9A96E', fontSize: 13, fontWeight: '800' },

  // Add Packs button
  addPacksBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#141414', borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderColor: 'rgba(201,169,110,0.3)',
    marginTop: 12,
  },
  addPacksBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', flex: 1 },
  addPacksBtnSub: { color: '#C9A96E', fontSize: 11, fontWeight: '700' },

  // Coupon
  couponRow: { flexDirection: 'row', marginTop: 16, gap: 8 },
  couponInputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#141414', borderRadius: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  couponInput: {
    flex: 1, color: '#FFFFFF', paddingVertical: 13, fontSize: 13, fontWeight: '700',
  },
  couponApplyBtn: {
    backgroundColor: '#C9A96E', paddingHorizontal: 18, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  couponApplyText: { color: '#0A0A0A', fontWeight: '900', fontSize: 13 },
  discountBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(74,222,128,0.08)',
    padding: 10, borderRadius: 10, marginTop: 8,
    borderWidth: 1, borderColor: 'rgba(74,222,128,0.2)',
  },
  discountText: { color: '#4ADE80', fontSize: 13, fontWeight: '700' },

  // Date picker
  section: { marginTop: 20 },
  sectionLabel: {
    color: '#555555', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12,
  },
  daysRow: { gap: 8, paddingBottom: 4 },
  dayChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#141414',
  },
  dayChipActive: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  dayText: { color: '#888888', fontSize: 12, fontWeight: '700' },
  dayTextActive: { color: '#0A0A0A' },
  dateRequired: { color: '#EF4444', fontSize: 11, marginTop: 6 },

  // Shipping button
  shippingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 12, paddingVertical: 10,
  },
  shippingBtnText: { color: '#C9A96E', fontSize: 13, fontWeight: '700' },

  // Totals
  totalsSection: {
    backgroundColor: '#141414', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginTop: 16,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalRowFinal: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 14, marginBottom: 0,
  },
  totalLabelText: { color: '#888888', fontSize: 14 },
  totalValueSm: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  totalFinalLabel: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  totalFinalValue: { color: '#C9A96E', fontSize: 24, fontWeight: '900' },

  // WhatsApp button
  waBtn: {
    backgroundColor: '#25D366', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, paddingVertical: 17,
    borderRadius: 16, marginTop: 16,
    shadowColor: '#25D366', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  waBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },

  // Modals
  modalContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 24,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  modalClose: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1E1E1E', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  modalSubtitle: { color: '#666666', fontSize: 13, paddingHorizontal: 20, marginTop: 8 },
  packsContent: { padding: 20, gap: 12 },
  packCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#141414', borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)',
  },
  packCardActive: { borderColor: '#C9A96E', backgroundColor: 'rgba(201,169,110,0.05)' },
  packEmoji: { fontSize: 28 },
  packInfo: { flex: 1 },
  packName: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', marginBottom: 2 },
  packDesc: { color: '#666666', fontSize: 12, marginBottom: 4 },
  packSavings: { color: '#4ADE80', fontSize: 11, fontWeight: '700' },
  packRight: { alignItems: 'flex-end', gap: 8 },
  packPrice: { color: '#C9A96E', fontSize: 16, fontWeight: '900' },
  packToggle: {
    width: 32, height: 32, borderRadius: 10,
    borderWidth: 1.5, borderColor: 'rgba(201,169,110,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  packToggleActive: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  modalConfirmBtn: {
    backgroundColor: '#C9A96E', margin: 20, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  modalConfirmText: { color: '#0A0A0A', fontSize: 16, fontWeight: '900' },

  // Shipping modal
  shippingContent: { padding: 24, gap: 20 },
  shippingRow: {
    flexDirection: 'row', gap: 16, alignItems: 'flex-start',
  },
  shippingIcon: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: 'rgba(201,169,110,0.1)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.2)',
  },
  shippingText: { flex: 1 },
  shippingTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  shippingDesc: { color: '#666666', fontSize: 13, lineHeight: 20 },
});
