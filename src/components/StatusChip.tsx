import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font, radius, spacing} from '../constants/theme';

interface Props {
  connected: boolean;
  label?: string;
}

const StatusChip: React.FC<Props> = ({connected, label}) => {
  const text =
    label ?? (connected ? 'Reader connected' : 'Searching for reader…');
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: connected ? '#E7F5EC' : colors.surface,
          borderColor: connected ? colors.chipConnected : colors.chipSearching,
        },
      ]}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: connected
              ? colors.chipConnected
              : colors.chipSearching,
          },
        ]}
      />
      <Text
        style={[
          styles.text,
          {color: connected ? colors.chipConnected : colors.textMuted},
        ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  text: {
    fontSize: font.sizes.sm,
    fontWeight: font.weight.medium,
  },
});

export default StatusChip;
