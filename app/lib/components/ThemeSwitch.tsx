import { useSetTheme, useTheme } from '@lib/contexts/theme.context';
import Switch, { type SwitchProps } from './Switch';

export default function ThemeSwitch({ onChange, ...props }: Omit<SwitchProps, 'children'>) {
  const theme = useTheme();
  const setTheme = useSetTheme();

  function handleChange(dark: boolean) {
    setTheme(dark ? 'dark' : 'light');
    onChange?.(dark);
  }

  return (
    <Switch {...props} onChange={handleChange} isSelected={theme === 'dark'}>
      {theme === 'light' ? 'Light mode' : 'Dark mode'}
    </Switch>
  );
}
