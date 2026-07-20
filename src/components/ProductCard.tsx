import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, font, radius, spacing} from '../constants/theme';
import {formatPrice, Product} from '../constants/products';

interface Props {
  product: Product;
  selected: boolean;
  onPress: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({product, selected, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.8}
      onPress={() => onPress(product)}>
      <View style={styles.thumb}>
        <Text style={styles.thumbText}>
          {product.name
            .split(' ')
            .slice(0, 2)
            .map(w => w[0])
            .join('')}
        </Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.sku}>{product.sku}</Text>
      <Text style={styles.price}>{formatPrice(product.priceCents)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    margin: spacing.sm,
    minHeight: 170,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF6F0',
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  thumbText: {
    color: colors.white,
    fontWeight: font.weight.bold,
    fontSize: font.sizes.md,
  },
  name: {
    color: colors.text,
    fontSize: font.sizes.md,
    fontWeight: font.weight.semibold,
  },
  sku: {
    color: colors.textMuted,
    fontSize: font.sizes.xs,
    marginTop: spacing.xs,
  },
  price: {
    color: colors.primary,
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    marginTop: spacing.sm,
  },
});

export default ProductCard;
