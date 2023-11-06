import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/locale';

type Locale = 'en';

export function getLocale(locale?: Locale) {
  switch (locale) {
    case 'en':
      return enUS;
    default:
      return enUS;
  }
}

export function formatRelativeTime(
  date: Date,
  baseDate: Date,
  locale?: Locale
) {
  const format = formatRelative(date, baseDate, { locale: getLocale(locale) });
  return format[0].toLocaleUpperCase(locale) + format.substring(1);
}

export function formatRelativeTimeFromNow(date: Date, locale?: Locale) {
  return formatRelativeTime(date, new Date(), locale);
}
