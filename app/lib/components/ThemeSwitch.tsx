import { useSetTheme, useTheme } from '@lib/contexts/theme.context';
import Switch from './Switch';

export default function ThemeSwitch() {
  const theme = useTheme();
  const setTheme = useSetTheme();

  function handleChange(dark: boolean) {
    setTheme(dark ? 'dark' : 'light');
  }

  return (
    <Switch onChange={handleChange}>
      {theme === 'light' ? 'Light mode' : 'Dark mode'}
    </Switch>
  );
}
