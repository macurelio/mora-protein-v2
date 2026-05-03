import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ScrollView, Linking,
} from 'react-native';
import { CheckCircle, XCircle, Package, MapPin, Calendar, RefreshCw } from 'lucide-react-native';

// Backend response (JSON del cliente)
const BACKEND_DATA = {
  ok: true,
  brand: { name: 'Mora Protein' },
  recent: [
    {
      id: 'b7256620-7540-4976-a0c7-5b091f3966c4',
      cliente: 'Daniela Alarcón',
      comuna: 'Santiago',
      direccion: 'Santa Elena 1864, depto 1103-A.',
      fecha: '2026-05-01',
      status: 'delivered',
      created_at: '2026-05-01T00:22:39.855397+00:00',
      order_number: null,
    },
    {
      id: '6aaef0de-8a2e-425f-aa5a-61df294bea09',
      cliente: 'Consuelo Rodríguez',
      comuna: 'Macul',
      direccion: 'Av escuela agrícola 1710, depto 1306 torre F',
      fecha: '2026-04-30',
      status: 'cancelled',
      created_at: '2026-05-01T00:17:34.174668+00:00',
      order_number: null,
    },
  ],
};

const STATUS_CONFIG = {
  delivered: {
    label: 'Entregado',
    icon: CheckCircle,
    color: '#4ADE80',
    bg: 'rgba(74,222,128,0.1)',
    border: 'rgba(74,222,128,0.25)',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    color: '#F87171',
    bg: 'rgba(248,113,113,0.1)',
    border: 'rgba(248,113,113,0.25)',
  },
};

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function shortId(id) {
  return '#MP-' + id.substring(0, 6).toUpperCase();
}

export default function OrderTrackingScreen({ navigation }) {
  const [orders] = useState(BACKEND_DATA.recent);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const openWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+56954099576').catch(() =>
      Linking.openURL('https://wa.me/56954099576')
    );
  };

  const renderOrder = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.cancelled;
    const StatusIcon = cfg.icon;

    return (
      <View style={styles.card}>
        {/* Card top */}
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.orderId}>{shortId(item.id)}</Text>
            <Text style={styles.cliente}>{item.cliente}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
            <StatusIcon color={cfg.color} size={14} />
            <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Details */}
        <View style={styles.detailRow}>
          <MapPin color="#666666" size={14} />
          <Text style={styles.detailText} numberOfLines={2}>
            {item.direccion} — {item.comuna}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar color="#666666" size={14} />
          <Text style={styles.detailText}>{formatDate(item.fecha)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estado de Pedidos</Text>
        <View style={styles.brandBadge}>
          <Package color="#C9A96E" size={14} />
          <Text style={styles.brandText}>Mora Protein</Text>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'delivered', label: 'Entregados' },
          { key: 'cancelled', label: 'Cancelados' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, filter === tab.key && styles.filterTabActive]}
            onPress={() => setFilter(tab.key)}
          >
            <Text style={[styles.filterTabText, filter === tab.key && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{orders.filter(o => o.status === 'delivered').length}</Text>
          <Text style={styles.statLabel}>Entregados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#F87171' }]}>
            {orders.filter(o => o.status === 'cancelled').length}
          </Text>
          <Text style={styles.statLabel}>Cancelados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#C9A96E' }]}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Package color="#333333" size={40} />
            <Text style={styles.emptyText}>No hay pedidos en esta categoría</Text>
          </View>
        }
      />

      {/* Contact strip */}
      <View style={styles.contactStrip}>
        <Text style={styles.contactText}>¿Problemas con tu pedido?</Text>
        <TouchableOpacity onPress={openWhatsApp} style={styles.contactBtn}>
          <Text style={styles.contactBtnText}>Contactar →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A' },

  // Header
  header: {
    paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
    backgroundColor: '#111111',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: { marginBottom: 12 },
  backText: { color: '#C9A96E', fontSize: 14, fontWeight: '700' },
  headerTitle: {
    color: '#FFFFFF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5,
    marginBottom: 10,
  },
  brandBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,169,110,0.1)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.25)',
  },
  brandText: { color: '#C9A96E', fontSize: 11, fontWeight: '800' },

  // Filters
  filterRow: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  filterTabActive: {
    backgroundColor: '#C9A96E', borderColor: '#C9A96E',
  },
  filterTabText: { color: '#666666', fontSize: 13, fontWeight: '700' },
  filterTabTextActive: { color: '#0A0A0A' },

  // Stats
  statsRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 20, marginBottom: 8,
  },
  statCard: {
    flex: 1, backgroundColor: '#141414',
    borderRadius: 14, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  statNumber: {
    color: '#4ADE80', fontSize: 24, fontWeight: '900',
  },
  statLabel: { color: '#555555', fontSize: 11, marginTop: 2 },

  // List
  listContent: { padding: 20, gap: 14, paddingBottom: 40 },

  // Card
  card: {
    backgroundColor: '#141414', borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 14,
  },
  orderId: { color: '#C9A96E', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  cliente: { color: '#FFFFFF', fontSize: 17, fontWeight: '900', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1,
  },
  statusLabel: { fontSize: 12, fontWeight: '800' },
  cardDivider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start',
  },
  detailText: { color: '#888888', fontSize: 13, flex: 1, lineHeight: 18 },

  // Empty
  emptyState: {
    alignItems: 'center', paddingTop: 60, gap: 12,
  },
  emptyText: { color: '#444444', fontSize: 14 },

  // Contact strip
  contactStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#111111',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  contactText: { color: '#555555', fontSize: 13 },
  contactBtn: {
    backgroundColor: 'rgba(201,169,110,0.12)',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
  },
  contactBtnText: { color: '#C9A96E', fontSize: 13, fontWeight: '700' },
});
