import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, radius, spacing} from '../constants/theme';
import {formatPrice} from '../constants/products';
import {useCart} from '../context/CartContext';
import type {CartLine} from '../context/CartContext';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen: React.FC<Props> = ({navigation}) => {
  const {lines, itemCount, totalCents, updateQty, removeItem} = useCart();

  const onCheckout = () => {
    if (lines.length === 0) {
      return;
    }
    navigation.navigate('Payment', {
      lines,
      totalCents,
      fromCart: true,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your order</Text>
        <View style={styles.headerSpacer} />
      </View>

      {lines.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyHint}>
            Add products from the catalogue to start an order.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.browseBtn}
            onPress={() => navigation.popToTop()}>
            <Text style={styles.browseBtnText}>Browse products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            {lines.map(line => (
              <CartRow
                key={line.key}
                line={line}
                onDec={() => updateQty(line.key, line.quantity - 1)}
                onInc={() => updateQty(line.key, line.quantity + 1)}
                onRemove={() => removeItem(line.key)}
              />
            ))}

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </Text>
                <Text style={styles.summaryValue}>
                  {formatPrice(totalCents)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(totalCents)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.tapBtn}
              onPress={onCheckout}>
              <Text style={styles.tapBtnText}>
                Tap to Pay {formatPrice(totalCents)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const CartRow: React.FC<{
  line: CartLine;
  onDec: () => void;
  onInc: () => void;
  onRemove: () => void;
}> = ({line, onDec, onInc, onRemove}) => {
  const variant = [line.color, line.size].filter(Boolean).join(' / ');
  return (
    <View style={styles.row}>
      <View style={styles.thumbWrap}>
        {line.imageUrl ? (
          <Image
            source={{uri: line.imageUrl}}
            style={styles.thumb}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.thumbFallback}>$</Text>
        )}
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={2}>
          {line.name}
        </Text>
        {variant ? <Text style={styles.rowVariant}>{variant}</Text> : null}
        <Text style={styles.rowUnit}>{formatPrice(line.priceCents)} each</Text>
        <View style={styles.rowControls}>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} onPress={onDec}>
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{line.quantity}</Text>
            <TouchableOpacity style={styles.stepBtn} onPress={onInc}>
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onRemove} hitSlop={8}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.rowLineTotal}>
        {formatPrice(line.priceCents * line.quantity)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    fontSize: font.sizes.md,
    color: colors.primary,
    fontWeight: font.weight.semibold,
    width: 60,
  },
  title: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  headerSpacer: {width: 60},
  scroll: {padding: spacing.md, paddingBottom: spacing.xl},
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  thumbWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {width: '100%', height: '100%'},
  thumbFallback: {
    fontSize: font.sizes.xl,
    fontWeight: font.weight.bold,
    color: colors.primary,
  },
  rowInfo: {flex: 1, marginLeft: spacing.md},
  rowName: {
    fontSize: font.sizes.sm,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  rowVariant: {
    fontSize: font.sizes.xs,
    color: colors.primary,
    fontWeight: font.weight.medium,
    marginTop: 2,
  },
  rowUnit: {
    fontSize: font.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  rowControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  stepper: {flexDirection: 'row', alignItems: 'center'},
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtnText: {
    fontSize: font.sizes.md,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  qtyValue: {
    minWidth: 36,
    textAlign: 'center',
    fontSize: font.sizes.md,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  removeText: {
    fontSize: font.sizes.sm,
    color: colors.error,
    fontWeight: font.weight.medium,
  },
  rowLineTotal: {
    fontSize: font.sizes.sm,
    fontWeight: font.weight.bold,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  summary: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between'},
  summaryLabel: {fontSize: font.sizes.md, color: colors.textMuted},
  summaryValue: {
    fontSize: font.sizes.md,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalLabel: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  totalValue: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.primary,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tapBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  tapBtnText: {
    color: colors.white,
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {fontSize: 56, marginBottom: spacing.md},
  emptyTitle: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  emptyHint: {
    fontSize: font.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  browseBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  browseBtnText: {
    color: colors.white,
    fontSize: font.sizes.md,
    fontWeight: font.weight.bold,
  },
});

export default CartScreen;
