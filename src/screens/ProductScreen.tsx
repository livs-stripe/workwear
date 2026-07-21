import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import {colors, font, radius, spacing} from '../constants/theme';
import {getProductsByBrand, Product} from '../constants/products';
import {useCart} from '../context/CartContext';
import {useVisit} from '../context/VisitContext';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

const ProductScreen: React.FC<Props> = ({navigation, route}) => {
  const {brand} = route.params;
  const {itemCount} = useCart();
  const {visit} = useVisit();

  const brandProducts = getProductsByBrand(brand);

  // Distinct categories for this brand in first-seen order.
  const categories: string[] = [];
  for (const p of brandProducts) {
    if (!categories.includes(p.category)) {
      categories.push(p.category);
    }
  }

  const onSelectProduct = (product: Product) => {
    navigation.navigate('ProductDetail', {productId: product.id});
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Brands</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {brand}
        </Text>
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
        <Text style={styles.visitLine} numberOfLines={1}>
          {visit.company} · {visit.site}
        </Text>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll}>
        {categories.map(category => {
          const items = brandProducts.filter(p => p.category === category);
          return (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryBar} />
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryCount}>
                  {items.length} {items.length === 1 ? 'style' : 'styles'}
                </Text>
              </View>
              <View style={styles.grid}>
                {items.map(product => (
                  <View key={product.id} style={styles.gridItem}>
                    <ProductCard product={product} onPress={onSelectProduct} />
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    fontSize: font.sizes.md,
    color: colors.primary,
    fontWeight: font.weight.semibold,
    width: 80,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.text,
    letterSpacing: 0.5,
  },
  cartBtn: {
    width: 80,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cartIcon: {fontSize: 20},
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: -6,
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
  visitLine: {
    fontSize: font.sizes.xs,
    color: colors.textMuted,
    fontWeight: font.weight.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: '#FFF6F0',
  },
  scroll: {padding: spacing.sm, paddingBottom: spacing.xxl},
  categorySection: {marginTop: spacing.md},
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  categoryBar: {
    width: 4,
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: font.sizes.lg,
    fontWeight: font.weight.bold,
    color: colors.text,
    letterSpacing: 0.5,
  },
  categoryCount: {
    marginLeft: 'auto',
    fontSize: font.sizes.xs,
    color: colors.textMuted,
    fontWeight: font.weight.medium,
  },
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  gridItem: {width: '50%'},
});

export default ProductScreen;
