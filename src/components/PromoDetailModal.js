import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { X } from 'lucide-react-native';

export default function PromoDetailModal({ visible, item, onClose, onPrimaryAction }) {
  const { width, height } = useWindowDimensions();

  if (!item) {
    return null;
  }

  const modalWidth = Math.min(width - 24, 560);
  const modalMaxHeight = Math.min(height * 0.9, 760);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { width: modalWidth, maxHeight: modalMaxHeight }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.85}>
            <X color="#FFFFFF" size={18} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={item.image} style={styles.heroImage} resizeMode="cover" />

            <View style={styles.content}>
              {item.badge ? <Text style={styles.badge}>{item.badge}</Text> : null}
              <Text style={styles.title}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
              {item.priceLabel ? <Text style={styles.priceLabel}>{item.priceLabel}</Text> : null}
              <Text style={styles.description}>{item.description}</Text>

              {item.bullets?.length ? (
                <View style={styles.listBlock}>
                  {item.bullets.map((bullet) => (
                    <View key={`${item.id}-${bullet}`} style={styles.listItem}>
                      <View style={styles.dot} />
                      <Text style={styles.listText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.secondaryButtonText}>Cerrar</Text>
            </TouchableOpacity>

            {item.primaryLabel ? (
              <TouchableOpacity style={styles.primaryButton} onPress={onPrimaryAction} activeOpacity={0.85}>
                <Text style={styles.primaryButtonText}>{item.primaryLabel}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  modalCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#1E1E1E',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  badge: {
    color: '#C9A96E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  priceLabel: {
    color: '#C9A96E',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 14,
  },
  description: {
    color: '#A3A3A3',
    fontSize: 14,
    lineHeight: 22,
  },
  listBlock: {
    marginTop: 18,
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#C9A96E',
    marginTop: 7,
  },
  listText: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButton: {
    flex: 1.2,
    backgroundColor: '#C9A96E',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '900',
  },
});
