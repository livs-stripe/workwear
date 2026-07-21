import React, {useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import StatusChip from '../components/StatusChip';
import {colors, font, radius, spacing} from '../constants/theme';
import {formatPrice} from '../constants/products';
import {useCart} from '../context/CartContext';
import {useVisit, visitToMetadata} from '../context/VisitContext';
import {useTerminalPayments} from '../hooks/useStripeTerminal';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const PaymentScreen: React.FC<Props> = ({navigation, route}) => {
  const {lines, totalCents, fromCart} = route.params;
  const {connected, charge} = useTerminalPayments();
  const {clear} = useCart();
  const {visit} = useVisit();
  const [processing, setProcessing] = useState(false);

  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);

  const onTapToPay = async () => {
    if (!connected || processing) {
      return;
    }
    setProcessing(true);
    try {
      const result = await charge(totalCents, visitToMetadata(visit));
      if (fromCart) {
        clear();
      }
      navigation.replace('Success', {
        result,
        itemCount,
        company: visit?.company,
        site: visit?.site,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      navigation.replace('Error', {message, lines, totalCents, fromCart});
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <StatusChip connected={connected} />
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>
          Order · {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
        <View style={styles.card}>
          <ScrollView style={styles.linesScroll}>
            {lines.map((item, idx) => (
              <View
                key={item.key}
                style={[styles.lineItem, idx > 0 && styles.lineItemSpacer]}>
                <View style={styles.flex}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.color || item.size ? (
                    <Text style={styles.itemVariant}>
                      {[item.color, item.size].filter(Boolean).join(' / ')}
                    </Text>
                  ) : null}
                  <Text style={styles.itemSku}>{item.sku}</Text>
                </View>
                <Text style={styles.itemQty}>× {item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  {formatPrice(item.priceCents * item.quantity)}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(totalCents)}</Text>
          </View>
        </View>

        {processing ? (
          <View style={styles.instruction}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.instructionText}>
              Hold card or device near phone
            </Text>
          </View>
        ) : (
          <Text style={styles.hint}>
            {connected
              ? 'Ready to accept a contactless payment.'
              : 'Searching for a Tap to Pay reader…'}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!connected || processing}
          style={[
            styles.tapBtn,
            (!connected || processing) && styles.tapBtnDisabled,
          ]}
          onPress={onTapToPay}>
          <Text style={styles.tapBtnText}>
            {processing ? 'Waiting for card…' : `Tap to Pay ${formatPrice(totalCents)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  },
  back: {
    fontSize: font.sizes.md,
    color: colors.primary,
    fontWeight: font.weight.semibold,
  },
  body: {flex: 1, paddingHorizontal: spacing.md},
  label: {
    fontSize: font.sizes.sm,
    color: colors.textMuted,
    fontWeight: font.weight.medium,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  linesScroll: {maxHeight: 320},
  lineItem: {flexDirection: 'row', alignItems: 'center'},
  lineItemSpacer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  flex: {flex: 1},
  itemName: {
    fontSize: font.sizes.md,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  itemVariant: {
    fontSize: font.sizes.sm,
    color: colors.primary,
    fontWeight: font.weight.medium,
    marginTop: 2,
  },
  itemSku: {fontSize: font.sizes.xs, color: colors.textMuted, marginTop: 2},
  itemQty: {
    fontSize: font.sizes.sm,
    color: colors.textMuted,
    marginHorizontal: spacing.md,
  },
  itemPrice: {
    fontSize: font.sizes.md,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  divider: {height: 1, backgroundColor: colors.border, marginVertical: spacing.md},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between'},
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
  instruction: {alignItems: 'center', marginTop: spacing.xxl},
  instructionText: {
    marginTop: spacing.md,
    fontSize: font.sizes.lg,
    fontWeight: font.weight.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  hint: {
    marginTop: spacing.xl,
    fontSize: font.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footer: {padding: spacing.md},
  tapBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  tapBtnDisabled: {backgroundColor: colors.border},
  tapBtnText: {
    color: colors.white,
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
  },
});

export default PaymentScreen;
