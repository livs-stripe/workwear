import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import {useVisit} from '../context/VisitContext';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitDetails'>;

const VisitDetailsScreen: React.FC<Props> = ({navigation}) => {
  const {visit, hasVisit, setVisit} = useVisit();

  const [company, setCompany] = useState(visit?.company ?? '');
  const [site, setSite] = useState(visit?.site ?? '');
  const [contact, setContact] = useState(visit?.contact ?? '');
  const [poNumber, setPoNumber] = useState(visit?.poNumber ?? '');

  const canStart = company.trim().length > 0 && site.trim().length > 0;

  const onStart = () => {
    if (!canStart) {
      return;
    }
    setVisit({company, site, contact, poNumber});
    navigation.replace('BrandSelect');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.logoDot} />
        <View>
          <Text style={styles.brand}>WORKWEAR</Text>
          <Text style={styles.subtitle}>Field Pay · Tap to Pay</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>
            {hasVisit ? 'Edit visit' : 'Start a visit'}
          </Text>
          <Text style={styles.hint}>
            Capture who you're visiting. This is attached to every payment for
            reconciliation.
          </Text>

          <View style={styles.card}>
            <Field
              label="Company / customer"
              required
              value={company}
              onChangeText={setCompany}
              placeholder="e.g. Acme Construction Pty Ltd"
              autoFocus
            />
            <Field
              label="Site / location"
              required
              value={site}
              onChangeText={setSite}
              placeholder="e.g. Barangaroo Tower 2"
            />
            <Field
              label="Contact name"
              value={contact}
              onChangeText={setContact}
              placeholder="e.g. Dave Nguyen (optional)"
            />
            <Field
              label="PO number"
              value={poNumber}
              onChangeText={setPoNumber}
              placeholder="e.g. PO-48213 (optional)"
              autoCapitalize="characters"
              last
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!canStart}
            style={[styles.cta, !canStart && styles.ctaDisabled]}
            onPress={onStart}>
            <Text style={styles.ctaText}>
              {hasVisit ? 'Save visit' : 'Start visit'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  last?: boolean;
}> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  autoFocus,
  autoCapitalize = 'words',
  last,
}) => (
  <View style={[styles.field, last && styles.fieldLast]}>
    <Text style={styles.fieldLabel}>
      {label}
      {required ? <Text style={styles.req}> *</Text> : null}
    </Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      autoFocus={autoFocus}
      autoCapitalize={autoCapitalize}
    />
  </View>
);

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
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
  scroll: {padding: spacing.md, paddingBottom: spacing.xl},
  title: {
    fontSize: font.sizes.xl,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  hint: {
    fontSize: font.sizes.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  field: {
    marginBottom: spacing.md,
  },
  fieldLast: {marginBottom: 0},
  fieldLabel: {
    fontSize: font.sizes.sm,
    fontWeight: font.weight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  req: {color: colors.primary},
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: font.sizes.md,
    color: colors.text,
    backgroundColor: colors.background,
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

export default VisitDetailsScreen;
