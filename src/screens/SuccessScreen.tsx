import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, radius, spacing} from '../constants/theme';
import {formatPrice} from '../constants/products';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

const SuccessScreen: React.FC<Props> = ({navigation, route}) => {
  const {result, itemCount} = route.params;
  const date = new Date(result.timestamp);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <View style={styles.badge}>
          <Text style={styles.check}>✓</Text>
        </View>
        <Text style={styles.title}>Payment approved</Text>
        <Text style={styles.amount}>{formatPrice(result.amountCents)}</Text>

        <View style={styles.card}>
          {itemCount && itemCount > 0 ? (
            <Row
              label="Items"
              value={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            />
          ) : null}
          <Row
            label="Card"
            value={
              result.last4
                ? `${result.cardBrand ? result.cardBrand.toUpperCase() + ' ' : ''}•••• ${result.last4}`
                : 'Card present'
            }
          />
          <Row label="Date" value={date.toLocaleDateString()} />
          <Row label="Time" value={date.toLocaleTimeString()} />
          <Row label="Channel" value="Tap to Pay · Field sales" />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.cta}
          onPress={() => navigation.popToTop()}>
          <Text style={styles.ctaText}>New Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Row: React.FC<{label: string; value: string}> = ({label, value}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  body: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg},
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  check: {color: colors.white, fontSize: 56, fontWeight: font.weight.bold, lineHeight: 60},
  title: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  amount: {
    fontSize: font.sizes.xxl,
    fontWeight: font.weight.bold,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  card: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  rowLabel: {fontSize: font.sizes.md, color: colors.textMuted},
  rowValue: {
    fontSize: font.sizes.md,
    color: colors.text,
    fontWeight: font.weight.semibold,
  },
  footer: {padding: spacing.md},
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaText: {
    color: colors.white,
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
  },
});

export default SuccessScreen;
