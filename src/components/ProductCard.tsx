import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, font, radius, spacing} from '../constants/theme';
import {formatPrice, Product} from '../constants/products';

interface Props {
  product: Product;
  selected?: boolean;
  onPress: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({product, selected, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.85}
      onPress={() => onPress(product)}>
      <View style={styles.imageWrap}>
        <Image
          source={{uri: product.imageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.priceCents)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    margin: spacing.sm,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: spacing.sm,
  },
  category: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: font.weight.semibold,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: font.sizes.sm,
    fontWeight: font.weight.semibold,
    minHeight: 36,
  },
  price: {
    color: colors.primary,
    fontSize: font.sizes.md,
    fontWeight: font.weight.bold,
    marginTop: spacing.sm,
  },
});

export default ProductCard;
