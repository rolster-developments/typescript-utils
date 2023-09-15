import { firstElement, lastElement } from './array';

export const firstChar = (value: string): string => {
  return value.length === 0 ? '' : value.charAt(0);
};

export const lastChar = (value: string): string => {
  return value.length ? '' : value.charAt(value.length - 1);
};

export const hasPattern = (
  word: string,
  pattern: string,
  force = false
): boolean => {
  let filter = pattern.toLowerCase();
  let test = word.toLowerCase();

  if (force) {
    test = normalize(test);
    filter = normalize(filter);
  }

  return !!test.match(`^.*${filter}.*$`);
};

export const normalize = (word: string): string => {
  return word
    .slice()
    .replace('á', 'a')
    .replace('Á', 'A')
    .replace('é', 'e')
    .replace('É', 'E')
    .replace('í', 'i')
    .replace('Í', 'I')
    .replace('ó', 'o')
    .replace('Ó', 'O')
    .replace('ú', 'u')
    .replace('Ú', 'U');
};

export const initials = (word: string, size = 2): string => {
  const split = word.split(' ');

  if (split.length === 1) {
    return word.slice(0, size).toUpperCase();
  }

  const firstValue = firstElement(split) as string;
  const lastValue = lastElement(split) as string;

  return `${firstChar(firstValue)}${firstChar(lastValue)}`.toUpperCase();
};
