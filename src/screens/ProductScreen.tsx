import React, {useMemo, useState} from 'react';
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
import {formatPrice, Product, products} from '../constants/products';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

const CUSTOM_ID = 'custom';

const ProductScreen: React.FC<Props> = ({navigation}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customAmount, setCustomAmount] = useState('');

  const selectedProduct: Product | null = useMemo(() => {
    if (selectedId === CUSTOM_ID) {
      const cents = Math.round(parseFloat(customAmount || '0') * 100);
      if (!cents || cents <= 0) {
        return null;
      }
      return {
        id: CUSTOM_ID,
        name: 'Custom amount',
        sku: 'CUSTOM',
        priceCents: cents,
      };
    }
    return products.find(p => p.id === selectedId) ?? null;
  }, [selectedId, customAmount]);

  const totalCents = selectedProduct ? selectedProduct.priceCents * quantity : 0;

  const onSelectProduct = (product: Product) => {
    setSelectedId(product.id);
    setQuantity(1);
  };

  const onCharge = () => {
    if (!selectedProduct) {
      return;
    }
    navigation.navigate('Payment', {
      item: {
        id: selectedProduct.id,
        name: selectedProduct.name,
        sku: selectedProduct.sku,
        priceCents: selectedProduct.priceCents,
        quantity,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoDot} />
        <View>
          <Text style={styles.brand}>WORKWEAR</Text>
          <Text style={styles.subtitle}>Field Pay · Tap to Pay</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Select an item</Text>
        <View style={styles.grid}>
          {products.map((product, idx) => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard
                product={product}
                selected={selectedId === product.id}
                onPress={onSelectProduct}
              />
              {idx === products.length - 1 && products.length % 2 === 1 ? (
                <View style={styles.gridSpacer} />
              ) : null}
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.customCard,
            selectedId === CUSTOM_ID && styles.customCardSelected,
          ]}
          onPress={() => {
            setSelectedId(CUSTOM_ID);
            setQuantity(1);
          }}>
          <Text style={styles.customLabel}>Custom amount</Text>
          <View style={styles.customInputRow}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              style={styles.customInput}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              value={customAmount}
              onFocus={() => setSelectedId(CUSTOM_ID)}
              onChangeText={setCustomAmount}
            />
          </View>
        </TouchableOpacity>

        {selectedProduct ? (
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity(q => Math.max(1, q - 1))}>
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity(q => q + 1)}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!selectedProduct}
          style={[styles.cta, !selectedProduct && styles.ctaDisabled]}
          onPress={onCharge}>
          <Text style={styles.ctaText}>
            {selectedProduct
              ? `Charge ${formatPrice(totalCents)}`
              : 'Select an item'}
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
  scroll: {padding: spacing.sm, paddingBottom: spacing.xl},
  sectionTitle: {
    fontSize: font.sizes.md,
    fontWeight: font.weight.semibold,
    color: colors.text,
    margin: spacing.sm,
  },
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  gridItem: {width: '50%'},
  gridSpacer: {flex: 1},
  customCard: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    margin: spacing.sm,
  },
  customCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF6F0',
  },
  customLabel: {
    fontSize: font.sizes.md,
    fontWeight: font.weight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  customInputRow: {flexDirection: 'row', alignItems: 'center'},
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
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: spacing.sm,
    marginTop: spacing.md,
  },
  qtyLabel: {
    fontSize: font.sizes.md,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  stepper: {flexDirection: 'row', alignItems: 'center'},
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtnText: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  qtyValue: {
    minWidth: 44,
    textAlign: 'center',
    fontSize: font.sizes.lg,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaDisabled: {backgroundColor: colors.border},
  ctaText: {
    color: colors.white,
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
  },
});

export default ProductScreen;
