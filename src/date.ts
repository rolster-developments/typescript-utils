import { getFormatForHumans } from './date-elapsed';

export const MonthsName = [
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

export const MonthsNameMin = [
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

export const MonthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const DaysName = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

export const DaysNameMin = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

type DateFormat = Record<string, (date: Date) => string>;

const dateFormatters: DateFormat = {
  dd: (date: Date): string => {
    return completFormat(date.getDate(), 2);
  },
  dw: (date: Date): string => {
    return DaysName[date.getDay()];
  },
  dx: (date: Date): string => {
    return DaysNameMin[date.getDay()];
  },
  mm: (date: Date): string => {
    return completFormat(date.getMonth() + 1, 2);
  },
  mn: (date: Date): string => {
    return MonthsName[date.getDay()];
  },
  mx: (date: Date): string => {
    return MonthsNameMin[date.getMonth()];
  },
  aa: (date: Date): string => {
    return completFormat(date.getFullYear(), 4);
  },
  hh: (date: Date): string => {
    return completFormat(date.getHours(), 2);
  },
  ii: (date: Date): string => {
    return completFormat(date.getMinutes(), 2);
  },
  ss: (date: Date): string => {
    return completFormat(date.getSeconds(), 2);
  },
  hz: (date: Date): string => {
    return completFormat(getHourFormat(date), 2);
  },
  zz: (date: Date): string => {
    return date.getHours() > 11 ? 'PM' : 'AM';
  }
};

export function equalsDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() === compareDate.getTime();
}

export function equalsDateWeight(date: Date, compareDate = new Date()): boolean {
  return getDateWeight(date) === getDateWeight(compareDate);
}

export function isBeforeDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() > compareDate.getTime();
}

export function isBeforeOrEqualsDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() >= compareDate.getTime();
}

export function isAfterDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() < compareDate.getTime();
}

export function isAfterOrEqualsDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() <= compareDate.getTime();
}

export function isBetweenDate(
  minDate: Date,
  maxDate: Date,
  compareDate = new Date()
): boolean {
  return isAfterDate(minDate, compareDate) && isBeforeDate(maxDate, compareDate);
}

export function isBetweenOrEqualsDate(
  minDate: Date,
  maxDate: Date,
  compareDate = new Date()
): boolean {
  return (
    isAfterOrEqualsDate(minDate, compareDate) ||
    isBeforeOrEqualsDate(maxDate, compareDate)
  );
}

export function getDifference(date: Date, compareDate = new Date()): number {
  return date.getTime() - compareDate.getTime();
}

export function getDifferenceForHumans(date: Date, compare = new Date()): string {
  return getFormatForHumans(getDifference(date, compare));
}

export function normalizeMinTime(date: Date): Date {
  const newDate = new Date(date.getTime());

  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
}

export function normalizeMaxTime(date: Date): Date {
  const newDate = new Date(date.getTime());

  newDate.setHours(23);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
  newDate.setMilliseconds(0);

  return newDate;
}

export function getDateWeight(date: Date): number {
  return date.getFullYear() * 365 + (date.getMonth() + 1) * 30 + date.getDate();
}

export function getDaysMonth(year: number, month: number): number {
  return month === 1 && isLeapYear(year) ? 29 : MonthsDays[month];
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function getDateFormat(date: Date, pattern: string): string {
  let format = pattern;

  Object.keys(dateFormatters).forEach((key) => {
    if (format.includes(key)) {
      format = format.replace(key, dateFormatters[key](date));
    }
  });

  return format;
}

export function createDate(year?: number, month?: number, day?: number): Date {
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
}

export function changeYear(date: Date, year: number): Date {
  const resultDate = new Date(date.getTime());

  verifyDayYear(resultDate, year);

  resultDate.setFullYear(year);

  return resultDate;
}

export function changeMonth(date: Date, month: number): Date {
  const resultDate = new Date(date.getTime());

  verifyDayMonth(resultDate, month);

  resultDate.setMonth(month);

  return resultDate;
}

export function changeDay(date: Date, day: number): Date {
  const resultDate = new Date(date.getTime());

  resultDate.setDate(day);

  return resultDate;
}

function completFormat(value: number, size: number): string {
  return value.toString().padStart(size, '0');
}

function getHourFormat(date: Date): number {
  const hour = date.getHours();

  return hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
}

function verifyDayYear(date: Date, year: number): void {
  const days = getDaysMonth(year, date.getMonth());

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setFullYear(year); // Establecer el año
}

function verifyDayMonth(date: Date, month: number): void {
  const days = getDaysMonth(date.getFullYear(), month);

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setMonth(month); // Establecer el mes
}
