import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import {colors, font, radius, spacing} from '../constants/theme';
import {
  BRANDS,
  formatPrice,
  getProductsByBrand,
  Product,
} from '../constants/products';
import {useCart} from '../context/CartContext';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

const ProductScreen: React.FC<Props> = ({navigation}) => {
  const [customAmount, setCustomAmount] = useState('');
  const {addItem, itemCount} = useCart();

  const customCents = Math.round(parseFloat(customAmount || '0') * 100);
  const customValid = customCents > 0;

  const onSelectProduct = (product: Product) => {
    navigation.navigate('ProductDetail', {productId: product.id});
  };

  const onAddCustom = () => {
    if (!customValid) {
      return;
    }
    addItem({
      // Unique id per custom line so multiple one-off amounts don't merge.
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

      <ScrollView contentContainerStyle={styles.scroll}>
        {BRANDS.map(brand => {
          const brandProducts = getProductsByBrand(brand);
          return (
            <View key={brand} style={styles.brandSection}>
              <View style={styles.brandHeader}>
                <View style={styles.brandBar} />
                <Text style={styles.brandName}>{brand}</Text>
                <Text style={styles.brandCount}>
                  {brandProducts.length} styles
                </Text>
              </View>
              <View style={styles.grid}>
                {brandProducts.map(product => (
                  <View key={product.id} style={styles.gridItem}>
                    <ProductCard product={product} onPress={onSelectProduct} />
                  </View>
                ))}
              </View>
            </View>
          );
        })}

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
              style={[styles.customCta, !customValid && styles.customCtaDisabled]}
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
  brand: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.text,
    letterSpacing: 1,
  },
  subtitle: {fontSize: font.sizes.sm, color: colors.textMuted},
  scroll: {padding: spacing.sm, paddingBottom: spacing.xxl},
  brandSection: {marginTop: spacing.md},
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
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
  brandCount: {
    marginLeft: 'auto',
    fontSize: font.sizes.xs,
    color: colors.textMuted,
    fontWeight: font.weight.medium,
  },
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  gridItem: {width: '50%'},
  customSection: {marginTop: spacing.lg},
  customCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    margin: spacing.sm,
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

export default ProductScreen;
