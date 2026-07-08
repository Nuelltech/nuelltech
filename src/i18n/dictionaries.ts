import type { Locale } from './settings';

const dictionaries = {
  pt: () => import('./locales/pt.json').then((module) => module.default),
  en: () => import('./locales/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries['pt']();
};
