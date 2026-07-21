import React, {useRef, useState} from 'react';
import {
  Animated,
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
import {formatPrice, getProductById} from '../constants/products';
import {useCart} from '../context/CartContext';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const product = getProductById(route.params.productId);
  const {addItem, itemCount} = useCart();

  const [color, setColor] = useState(product?.colors[0] ?? '');
  const [size, setSize] = useState(product?.sizes[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  if (!product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Text style={styles.hint}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalCents = product.priceCents * quantity;

  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      sku: product.sku,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      color,
      size,
      quantity,
    });
  };

  const flashToast = () => {
    setAdded(true);
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setAdded(false));
  };

  const onAddToOrder = () => {
    addToCart();
    flashToast();
  };

  const onAddAndViewCart = () => {
    addToCart();
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartBtnText}>Cart</Text>
          {itemCount > 0 ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageWrap}>
          <Image
            source={{uri: product.imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.brand}>
            {product.brand.toUpperCase()} · {product.category}
          </Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.priceCents)}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.selectorLabel}>
            Colour<Text style={styles.selectedValue}> · {color}</Text>
          </Text>
          <View style={styles.chipRow}>
            {product.colors.map(c => (
              <TouchableOpacity
                key={c}
                activeOpacity={0.8}
                style={[styles.chip, color === c && styles.chipSelected]}
                onPress={() => setColor(c)}>
                <Text
                  style={[
                    styles.chipText,
                    color === c && styles.chipTextSelected,
                  ]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.selectorLabel}>
            Size<Text style={styles.selectedValue}> · {size}</Text>
          </Text>
          <View style={styles.chipRow}>
            {product.sizes.map(s => (
              <TouchableOpacity
                key={s}
                activeOpacity={0.8}
                style={[styles.sizeChip, size === s && styles.chipSelected]}
                onPress={() => setSize(s)}>
                <Text
                  style={[
                    styles.chipText,
                    size === s && styles.chipTextSelected,
                  ]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {added ? (
          <Animated.View style={[styles.toast, {opacity: toastOpacity}]}>
            <Text style={styles.toastText}>✓ Added to order</Text>
          </Animated.View>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.cta}
          onPress={onAddToOrder}>
          <Text style={styles.ctaText}>
            Add to order · {formatPrice(totalCents)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.secondaryCta}
          onPress={onAddAndViewCart}>
          <Text style={styles.secondaryCtaText}>Add &amp; view cart</Text>
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
  cartBtn: {flexDirection: 'row', alignItems: 'center'},
  cartBtnText: {
    fontSize: font.sizes.md,
    color: colors.primary,
    fontWeight: font.weight.semibold,
  },
  cartBadge: {
    marginLeft: spacing.xs,
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
  scroll: {paddingBottom: spacing.xl},
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
  },
  image: {width: '100%', height: '100%'},
  content: {padding: spacing.md},
  brand: {
    fontSize: font.sizes.xs,
    color: colors.textMuted,
    fontWeight: font.weight.semibold,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: font.sizes.xl,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  price: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  description: {
    fontSize: font.sizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  selectorLabel: {
    fontSize: font.sizes.md,
    fontWeight: font.weight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  selectedValue: {
    fontWeight: font.weight.regular,
    color: colors.textMuted,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  sizeChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    minWidth: 48,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF6F0',
  },
  chipText: {
    fontSize: font.sizes.sm,
    color: colors.text,
    fontWeight: font.weight.medium,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: font.weight.bold,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
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
  body: {flex: 1, paddingHorizontal: spacing.md},
  hint: {fontSize: font.sizes.md, color: colors.textMuted},
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
  ctaText: {
    color: colors.white,
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
  },
  secondaryCta: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryCtaText: {
    color: colors.primary,
    fontSize: font.sizes.md,
    fontWeight: font.weight.bold,
  },
  toast: {
    position: 'absolute',
    top: -44,
    alignSelf: 'center',
    backgroundColor: colors.success,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  toastText: {
    color: colors.white,
    fontSize: font.sizes.sm,
    fontWeight: font.weight.bold,
  },
});

export default ProductDetailScreen;
