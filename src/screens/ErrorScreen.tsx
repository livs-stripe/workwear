import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, radius, spacing} from '../constants/theme';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Error'>;

const ErrorScreen: React.FC<Props> = ({navigation, route}) => {
  const {message, lines, totalCents, fromCart} = route.params;

  const onRetry = () => {
    if (lines && lines.length > 0 && typeof totalCents === 'number') {
      navigation.replace('Payment', {lines, totalCents, fromCart});
    } else {
      navigation.popToTop();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <View style={styles.badge}>
          <Text style={styles.x}>✕</Text>
        </View>
        <Text style={styles.title}>Payment failed</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.cta}
          onPress={onRetry}>
          <Text style={styles.ctaText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.secondary}
          onPress={() => navigation.popToTop()}>
          <Text style={styles.secondaryText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  body: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg},
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  x: {color: colors.white, fontSize: 48, fontWeight: font.weight.bold, lineHeight: 52},
  title: {
    fontSize: font.sizes.xl,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  message: {
    fontSize: font.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
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
  secondary: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  secondaryText: {
    color: colors.textMuted,
    fontSize: font.sizes.md,
    fontWeight: font.weight.medium,
  },
});

export default ErrorScreen;
