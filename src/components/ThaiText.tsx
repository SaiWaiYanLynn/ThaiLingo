import { Text, type TextProps } from 'react-native';

import { colors } from '@/theme/tokens';
import { THAI_LINE_HEIGHT, thaiFont } from '@/theme/typography';

interface Props extends TextProps {
  size: number;
  bold?: boolean;
  color?: string;
}

// All Thai text goes through this component so the font and line height stay correct (NFR-05).
export function ThaiText({ size, bold, color = colors.text, style, ...rest }: Props) {
  return (
    <Text
      accessibilityLanguage="th-TH"
      style={[
        {
          fontFamily: bold ? thaiFont.bold : thaiFont.regular,
          fontSize: size,
          lineHeight: Math.round(size * THAI_LINE_HEIGHT),
          color,
        },
        style,
      ]}
      {...rest}
    />
  );
}
