import { SymbolView, type SymbolViewProps } from 'expo-symbols';

interface Props {
  name: string; // SF Symbol name (the app targets iPhone)
  size?: number;
  color: string;
}

export function Icon({ name, size = 24, color }: Props) {
  return <SymbolView name={name as SymbolViewProps['name']} size={size} tintColor={color} type="monochrome" />;
}
