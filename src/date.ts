export const MONTHS_NAME = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

export const MONTHS_NAME_MIN = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic'
];

export const MONTHS_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const DAYS_NAME = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

export const DAYS_NAME_MIN = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

export enum Miliseconds {
  Year = 31536000000,
  Month = 2592000000,
  Week = 604800000,
  Day = 86400000,
  Hour = 3600000,
  Minute = 60000,
  Second = 1000
}

type DateFormat = Record<string, (date: Date) => string>;

const FORMATTERS: DateFormat = {
  dd: (date: Date): string => {
    return formatComplet(date.getDate(), 2);
  },
  dw: (date: Date): string => {
    return DAYS_NAME[date.getDay()];
  },
  dx: (date: Date): string => {
    return DAYS_NAME_MIN[date.getDay()];
  },
  mm: (date: Date): string => {
    return formatComplet(date.getMonth() + 1, 2);
  },
  mn: (date: Date): string => {
    return MONTHS_NAME[date.getDay()];
  },
  mx: (date: Date): string => {
    return MONTHS_NAME_MIN[date.getMonth()];
  },
  aa: (date: Date): string => {
    return formatComplet(date.getFullYear(), 4);
  },
  hh: (date: Date): string => {
    return formatComplet(date.getHours(), 2);
  },
  ii: (date: Date): string => {
    return formatComplet(date.getMinutes(), 2);
  },
  ss: (date: Date): string => {
    return formatComplet(date.getSeconds(), 2);
  },
  hz: (date: Date): string => {
    return formatComplet(formatHour(date), 2);
  },
  zz: (date: Date): string => {
    return date.getHours() > 11 ? 'PM' : 'AM';
  }
};

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

const createElapsedTime = (
  value: Miliseconds,
  single: string,
  charPlural = 's',
  plural?: string
): ElapsedTime => {
  plural = plural || `${single}${charPlural}`;

  const label = `${single}(${charPlural})`;

  return {
    value,
    label,
    single,
    plural
  };
};

const ELAPSED_TIMES: ElapsedTime[] = [
  createElapsedTime(Miliseconds.Year, 'año'),
  createElapsedTime(Miliseconds.Month, 'mes', 'es'),
  createElapsedTime(Miliseconds.Week, 'semana'),
  createElapsedTime(Miliseconds.Day, 'día', 's', 'dias'),
  createElapsedTime(Miliseconds.Hour, 'hora'),
  createElapsedTime(Miliseconds.Minute, 'minuto'),
  createElapsedTime(Miliseconds.Second, 'segundo')
];

export const formatForHumans = (milliseconds: number): string => {
  const prefix = milliseconds > 0 ? 'Falta' : 'Hace';
  const value = Math.abs(milliseconds);

  if (value < 1000) {
    return `${prefix} 1 segundo`;
  }

  let description = '';
  let index = 0;

  while (description === '' && index < ELAPSED_TIMES.length) {
    const elapsed = ELAPSED_TIMES[index];
    const result = Math.floor(value / elapsed.value);

    if (result >= 1) {
      const label = result === 1 ? elapsed.single : elapsed.plural;

      description = `${prefix} ${result} ${label}`;
    }

    index++;
  }

  return description;
};

export const pendingTime = (
  initial: Date,
  future = new Date()
): PendingTime => {
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
};

export const refactorFromDays = (date: Date, days = 1): Date => {
  return refactorFromTimestamp(date, days * Miliseconds.Day);
};

export const refactorFromMonth = (date: Date, months = 1): Date => {
  return refactorFromTimestamp(date, months * Miliseconds.Month);
};

export const refactorFromTimestamp = (date: Date, timestamp: number): Date => {
  return new Date(date.getTime() + timestamp);
};

export const equalsDate = (date: Date, compareDate = new Date()): boolean => {
  return date.getTime() === compareDate.getTime();
};

export const equalsWeight = (date: Date, compareDate = new Date()): boolean => {
  return getDateWeight(date) === getDateWeight(compareDate);
};

export const beforeDate = (date: Date, compareDate = new Date()): boolean => {
  return date.getTime() > compareDate.getTime();
};

export const beforeOrEqualsDate = (
  date: Date,
  compareDate = new Date()
): boolean => {
  return date.getTime() >= compareDate.getTime();
};

export const afterDate = (date: Date, compareDate = new Date()): boolean => {
  return date.getTime() < compareDate.getTime();
};

export const afterOrEqualsDate = (
  date: Date,
  compareDate = new Date()
): boolean => {
  return date.getTime() <= compareDate.getTime();
};

export const betweenDate = (
  minDate: Date,
  maxDate: Date,
  compareDate = new Date()
): boolean => {
  return afterDate(minDate, compareDate) && beforeDate(maxDate, compareDate);
};

export const betweenOrEqualsDate = (
  minDate: Date,
  maxDate: Date,
  compareDate = new Date()
): boolean => {
  return (
    afterOrEqualsDate(minDate, compareDate) ||
    beforeOrEqualsDate(maxDate, compareDate)
  );
};

export function getDifference(date: Date, compareDate = new Date()): number {
  return date.getTime() - compareDate.getTime();
}

export const differenceForHumans = (
  date: Date,
  compare = new Date()
): string => {
  return formatForHumans(getDifference(date, compare));
};

export const normalizeMinTime = (date: Date): Date => {
  const newDate = new Date(date.getTime());

  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
};

export const normalizeMaxTime = (date: Date): Date => {
  const newDate = new Date(date.getTime());

  newDate.setHours(23);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
  newDate.setMilliseconds(0);

  return newDate;
};

export const getDateWeight = (date: Date): number => {
  return date.getFullYear() * 365 + (date.getMonth() + 1) * 30 + date.getDate();
};

export const getDaysMonth = (year: number, month: number): number => {
  return month === 1 && isLeapYear(year) ? 29 : MONTHS_DAYS[month];
};

export const isLeapYear = (year: number): boolean => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

export const formatDate = (date: Date, pattern: string): string => {
  let format = pattern;

  Object.keys(FORMATTERS).forEach((key) => {
    if (format.includes(key)) {
      format = format.replace(key, FORMATTERS[key](date));
    }
  });

  return format;
};

export const createDate = (
  year?: number,
  month?: number,
  day?: number
): Date => {
  const resultDate = new Date();

  if (year) {
    verifyDayYear(resultDate, year);
  }

  if (month) {
    verifyDayMonth(resultDate, month);
  }

  if (day) {
    resultDate.setDate(day);
  }

  return resultDate;
};

export const refactorYear = (date: Date, year: number): Date => {
  const resultDate = new Date(date.getTime());

  verifyDayYear(resultDate, year);

  resultDate.setFullYear(year);

  return resultDate;
};

export const refactorMonth = (date: Date, month: number): Date => {
  const resultDate = new Date(date.getTime());

  verifyDayMonth(resultDate, month);

  resultDate.setMonth(month);

  return resultDate;
};

export const refactorDay = (date: Date, day: number): Date => {
  const resultDate = new Date(date.getTime());

  resultDate.setDate(day);

  return resultDate;
};

const formatComplet = (value: number, size: number): string => {
  return value.toString().padStart(size, '0');
};

const formatHour = (date: Date): number => {
  const hour = date.getHours();

  return hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
};

const verifyDayYear = (date: Date, year: number): void => {
  const days = getDaysMonth(year, date.getMonth());

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setFullYear(year); // Establecer el año
};

const verifyDayMonth = (date: Date, month: number): void => {
  const days = getDaysMonth(date.getFullYear(), month);

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setMonth(month); // Establecer el mes
};
