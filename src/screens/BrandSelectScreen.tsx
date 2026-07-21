import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, radius, spacing} from '../constants/theme';
import {formatPrice, getBrandSummaries} from '../constants/products';
import {useCart} from '../context/CartContext';
import {useVisit} from '../context/VisitContext';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'BrandSelect'>;

const BrandSelectScreen: React.FC<Props> = ({navigation}) => {
  const brandSummaries = getBrandSummaries();
  const {addItem, itemCount} = useCart();
  const {visit} = useVisit();

  const [customAmount, setCustomAmount] = useState('');
  const customCents = Math.round(parseFloat(customAmount || '0') * 100);
  const customValid = customCents > 0;

  const onAddCustom = () => {
    if (!customValid) {
      return;
    }
    addItem({
      id: `custom-${Date.now()}`,
      name: 'Custom amount',
      sku: 'CUSTOM',
      priceCents: customCents,
      quantity: 1,
    });
    setCustomAmount('');
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoDot} />
        <View>
          <Text style={styles.brand}>WORKWEAR</Text>
          <Text style={styles.subtitle}>Field Pay · Tap to Pay</Text>
        </View>
        <TouchableOpacity
          style={styles.cartBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
          {itemCount > 0 ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {visit ? (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.visitBanner}
          onPress={() => navigation.navigate('VisitDetails')}>
          <View style={styles.visitInfo}>
            <Text style={styles.visitCompany} numberOfLines={1}>
              {visit.company}
            </Text>
            <Text style={styles.visitSite} numberOfLines={1}>
              {visit.site}
              {visit.poNumber ? ` · PO ${visit.poNumber}` : ''}
            </Text>
          </View>
          <Text style={styles.visitEdit}>Change</Text>
        </TouchableOpacity>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.prompt}>Choose a brand</Text>
        <Text style={styles.promptHint}>
          Browse and sell one brand at a time.
        </Text>

        {brandSummaries.map(({brand, count, imageUrl}) => (
          <TouchableOpacity
            key={brand}
            activeOpacity={0.9}
            style={styles.tile}
            onPress={() => navigation.navigate('Products', {brand})}>
            <Image
              source={{uri: imageUrl}}
              style={styles.tileImage}
              resizeMode="cover"
            />
            <View style={styles.tileOverlay} />
            <View style={styles.tileContent}>
              <Text style={styles.tileBrand}>{brand}</Text>
              <Text style={styles.tileCount}>
                {count} {count === 1 ? 'style' : 'styles'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.customSection}>
          <View style={styles.brandHeader}>
            <View style={styles.brandBar} />
            <Text style={styles.brandName}>Custom amount</Text>
          </View>
          <View style={styles.customCard}>
            <Text style={styles.customLabel}>Enter a one-off amount</Text>
            <View style={styles.customInputRow}>
              <Text style={styles.dollar}>$</Text>
              <TextInput
                style={styles.customInput}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={customAmount}
                onChangeText={setCustomAmount}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!customValid}
              style={[
                styles.customCta,
                !customValid && styles.customCtaDisabled,
              ]}
              onPress={onAddCustom}>
              <Text style={styles.customCtaText}>
                {customValid
                  ? `Add ${formatPrice(customCents)} to cart`
                  : 'Enter an amount'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoDot: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  brand: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.text,
    letterSpacing: 1,
  },
  subtitle: {fontSize: font.sizes.sm, color: colors.textMuted},
  cartBtn: {
    marginLeft: 'auto',
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {fontSize: 20},
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: font.sizes.xs,
    fontWeight: font.weight.bold,
  },
  visitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFF6F0',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  visitInfo: {flex: 1},
  visitCompany: {
    fontSize: font.sizes.sm,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  visitSite: {
    fontSize: font.sizes.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  visitEdit: {
    fontSize: font.sizes.sm,
    fontWeight: font.weight.bold,
    color: colors.primary,
    marginLeft: spacing.md,
  },
  scroll: {padding: spacing.md, paddingBottom: spacing.xxl},
  prompt: {
    fontSize: font.sizes.xl,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  promptHint: {
    fontSize: font.sizes.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  tile: {
    height: 160,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    justifyContent: 'flex-end',
  },
  tileImage: {...StyleSheet.absoluteFillObject, width: '100%', height: '100%'},
  tileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  tileContent: {padding: spacing.md},
  tileBrand: {
    fontSize: font.sizes.xl,
    fontWeight: font.weight.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  tileCount: {
    fontSize: font.sizes.sm,
    fontWeight: font.weight.semibold,
    color: colors.white,
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  customSection: {marginTop: spacing.sm},
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  brandBar: {
    width: 4,
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  brandName: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.text,
    letterSpacing: 0.5,
  },
  customCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
  },
  customLabel: {
    fontSize: font.sizes.sm,
    fontWeight: font.weight.medium,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dollar: {
    fontSize: font.sizes.xl,
    fontWeight: font.weight.bold,
    color: colors.text,
    marginRight: spacing.xs,
  },
  customInput: {
    flex: 1,
    fontSize: font.sizes.xl,
    fontWeight: font.weight.bold,
    color: colors.text,
    padding: 0,
  },
  customCta: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  customCtaDisabled: {backgroundColor: colors.border},
  customCtaText: {
    color: colors.white,
    fontSize: font.sizes.md,
    fontWeight: font.weight.bold,
  },
});

export default BrandSelectScreen;
