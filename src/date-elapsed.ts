export enum Miliseconds {
  Year = 31536000000,
  Month = 2592000000,
  Week = 604800000,
  Day = 86400000,
  Hour = 3600000,
  Minute = 60000,
  Second = 1000
}

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
  value: Miliseconds,
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
  createElapsedTime(Miliseconds.Year, 'año'),
  createElapsedTime(Miliseconds.Month, 'mes', 'es'),
  createElapsedTime(Miliseconds.Week, 'semana'),
  createElapsedTime(Miliseconds.Day, 'día', 's', 'dias'),
  createElapsedTime(Miliseconds.Hour, 'hora'),
  createElapsedTime(Miliseconds.Minute, 'minuto'),
  createElapsedTime(Miliseconds.Second, 'segundo')
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
    years: Math.floor(difference / Miliseconds.Year),
    months: Math.floor(difference / Miliseconds.Month),
    weeks: Math.floor(difference / Miliseconds.Week),
    days: Math.floor(difference / Miliseconds.Day),
    hours: Math.floor(difference / Miliseconds.Hour),
    minutes: Math.floor(difference / Miliseconds.Minute),
    seconds: Math.floor(difference / Miliseconds.Second)
  };
}

export function updateDateWithDays(date: Date, days = 1): Date {
  return updateDateWithTimestamp(date, days * Miliseconds.Day);
}

export function updateDateWithMonths(date: Date, months = 1): Date {
  return updateDateWithTimestamp(date, months * Miliseconds.Month);
}

export function updateDateWithTimestamp(date: Date, timestamp: number): Date {
  return new Date(date.getTime() + timestamp);
}
