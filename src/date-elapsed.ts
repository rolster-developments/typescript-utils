import { MILISECONDS } from './constants';

interface ElapsedTime {
  value: number;
  label: string;
  single: string;
  plural: string;
}

interface PendingTime {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function createElapsedTime(
  value: MILISECONDS,
  single: string,
  charPlural = 's',
  plural?: string
): ElapsedTime {
  plural = plural || `${single}${charPlural}`;

  const label = `${single}(${charPlural})`;

  return {
    value,
    label,
    single,
    plural
  };
}

const elapsedTimes: ElapsedTime[] = [
  createElapsedTime(MILISECONDS.YEAR, 'año'),
  createElapsedTime(MILISECONDS.MONTH, 'mes', 'es'),
  createElapsedTime(MILISECONDS.WEEK, 'semana'),
  createElapsedTime(MILISECONDS.DAY, 'día', 's', 'dias'),
  createElapsedTime(MILISECONDS.HOUR, 'hora'),
  createElapsedTime(MILISECONDS.MINUTE, 'minuto'),
  createElapsedTime(MILISECONDS.SECOND, 'segundo')
];

export function getFormatForHumans(milliseconds: number): string {
  const prefix = milliseconds > 0 ? 'Falta' : 'Hace';
  const value = Math.abs(milliseconds);

  if (value < 1000) {
    return `${prefix} 1 segundo`;
  }

  let description = '';
  let index = 0;

  while (description === '' && index < elapsedTimes.length) {
    const elapsed = elapsedTimes[index];
    const result = Math.floor(value / elapsed.value);

    if (result >= 1) {
      const label = result === 1 ? elapsed.single : elapsed.plural;

      description = `${prefix} ${result} ${label}`;
    }

    index++;
  }

  return description;
}

export function getPendingTime(
  initial: Date,
  future = new Date()
): PendingTime {
  const difference = future.getTime() - initial.getTime();

  return {
    years: Math.floor(difference / MILISECONDS.YEAR),
    months: Math.floor(difference / MILISECONDS.MONTH),
    weeks: Math.floor(difference / MILISECONDS.WEEK),
    days: Math.floor(difference / MILISECONDS.DAY),
    hours: Math.floor(difference / MILISECONDS.HOUR),
    minutes: Math.floor(difference / MILISECONDS.MINUTE),
    seconds: Math.floor(difference / MILISECONDS.SECOND)
  };
}

export function updateDateWithDays(date: Date, days = 1): Date {
  return updateDateWithTimestamp(date, days * MILISECONDS.DAY);
}

export function updateDateWithMonths(date: Date, months = 1): Date {
  return updateDateWithTimestamp(date, months * MILISECONDS.MONTH);
}

export function updateDateWithTimestamp(date: Date, timestamp: number): Date {
  return new Date(date.getTime() + timestamp);
}
