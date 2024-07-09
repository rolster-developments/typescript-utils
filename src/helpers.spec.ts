import {
  callback,
  deepClone,
  deepFreeze,
  evalValueOrFunction,
  itIsDefined,
  itIsUndefined,
  parse,
  parseBoolean
} from './helpers';

class LastName {
  constructor(public readonly value: string) {}
}

class Person {
  private ageState = 20;

  public readonly lastName: LastName;

  constructor(
    public readonly firstName: string,
    lastName: string
  ) {
    this.lastName = new LastName(lastName);
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName.value}`;
  }

  public get age(): number {
    return this.ageState;
  }

  public setAge(age: number): void {
    this.ageState = age;
  }
}

describe('Helpers', () => {
  it('should execute test of "isDefined" successful', () => {
    expect(itIsDefined('Daniel')).toBe(true);
    expect(itIsDefined(24)).toBe(true);
    expect(itIsDefined(new Date())).toBe(true);
    expect(itIsDefined(undefined)).toBe(false);
    expect(itIsDefined(null)).toBe(false);
  });

  it('should execute test of "isUndefined" successful', () => {
    expect(itIsUndefined('Daniel')).toBe(false);
    expect(itIsUndefined(24)).toBe(false);
    expect(itIsUndefined(new Date())).toBe(false);
    expect(itIsUndefined(undefined)).toBe(true);
    expect(itIsUndefined(null)).toBe(true);
  });

  it('should execute test of "parseBoolean" successful', () => {
    expect(parseBoolean('Daniel')).toBe(true);
    expect(parseBoolean(24)).toBe(true);
    expect(parseBoolean(new Date())).toBe(true);
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean(false)).toBe(false);
    expect(parseBoolean(null)).toBe(false);
    expect(parseBoolean(undefined)).toBe(false);
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean(0)).toBe(false);
    expect(parseBoolean('undefined')).toBe(false);
    expect(parseBoolean('0')).toBe(false);
  });

  it('should execute test of "parse" successful', () => {
    const personString = JSON.stringify({
      firstName: 'Daniel',
      lastName: 'Castillo'
    });

    expect(parse('Katherin')).toBe('Katherin');
    expect(parse('24')).toBe(24);
    expect(parse('true')).toBe(true);
    expect(parse('false')).toBe(false);

    const person = parse<{ firstName: string; lastName: string }>(personString);

    expect(person).toBeDefined();
    expect(person.firstName).toBeDefined();
    expect(person.lastName).toBeDefined();
    expect(person.firstName).toBe('Daniel');
    expect(person.lastName).toBe('Castillo');
  });

  it('should execute test of "evalValueOrFunction" successful', () => {
    expect(evalValueOrFunction('Katherin')).toBe('Katherin');
    expect(evalValueOrFunction(30)).toBe(30);
    expect(evalValueOrFunction(() => 'Katherin')).toBe('Katherin');
    expect(evalValueOrFunction(() => 30)).toBe(30);
  });

  it('should execute test of "deepClone" with primitive successful', () => {
    let fullName = 'Daniel'; // Initial state

    expect(fullName).toBe('Daniel');

    const fullNameClone = deepClone(fullName);
    fullName = 'Daniel Castillo';

    expect(fullName).toBe('Daniel Castillo');
    expect(fullNameClone).toBe('Daniel');
  });

  it('should execute test of "deepClone" with Date successful', () => {
    const dateInitial = new Date(1991, 4, 3, 0, 0, 0);

    expect(dateInitial).toBeDefined();
    expect(dateInitial.getFullYear()).toBe(1991);

    const dateReference = dateInitial;

    expect(dateInitial).toEqual(dateReference);

    dateReference.setFullYear(1993);

    expect(dateInitial.getFullYear()).toBe(1993);
    expect(dateReference.getFullYear()).toBe(1993);

    const dateClone = deepClone(dateInitial);

    dateClone.setFullYear(1991);

    expect(dateInitial.getFullYear()).toBe(1993);
    expect(dateReference.getFullYear()).toBe(1993);
    expect(dateClone.getFullYear()).toBe(1991);
  });

  it('should execute test of "deepClone" with CustomClass successful', () => {
    const person = new Person('Katherin', 'Bolaño');

    expect(person).toBeDefined();
    expect(person.fullName).toBe('Katherin Bolaño');
    expect(person.age).toBe(20);

    const personClone = deepClone(person);

    expect(personClone).toBeDefined();

    personClone.setAge(30);

    expect(person.age).toBe(20);
    expect(person.fullName).toBe('Katherin Bolaño');
    expect(personClone.age).toBe(30);
    expect(personClone.fullName).toBe('Katherin Bolaño');
  });

  it('should execute test of "deepFreeze" successful', () => {
    const person = new Person('Daniel', 'Castillo');

    expect(person).toBeDefined();
    expect(Object.isFrozen(person)).toBe(false);
    expect(Object.isFrozen(person.lastName)).toBe(false);

    deepFreeze(person);

    expect(person).toBeDefined();
    expect(Object.isFrozen(person)).toBe(true);
    expect(Object.isFrozen(person.lastName)).toBe(true);
  });

  it('should execute test of "callback" successful', () => {
    function multiply(a: number, b: number): number {
      return a * b;
    }

    expect(callback<number>(multiply, 5, 7)).toBe(35);
    expect(callback(undefined, 5, 7)).toBeUndefined();
  });
});
