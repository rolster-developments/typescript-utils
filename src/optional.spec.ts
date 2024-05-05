import { Optional } from './optional';

describe('Optional', () => {
  it('should create optional with method "of"', () => {
    const optional = Optional.of(10);

    expect(optional.isPresent()).toBe(true);
    expect(optional.get()).toBe(10);
    expect(optional.isEmpty()).toBe(false);

    expect(optional.present(() => 5)).toBe(5);
    expect(optional.empty(() => 10)).toBeUndefined();
  });

  it('should create optional value with method "build"', () => {
    const optional = Optional.build(10);

    expect(optional.isPresent()).toBe(true);
    expect(optional.get()).toBe(10);
    expect(optional.isEmpty()).toBe(false);

    expect(optional.present(() => 5)).toBe(5);
    expect(optional.empty(() => 10)).toBeUndefined();
  });

  it('should create optional with method "empty"', () => {
    const optional = Optional.empty();

    expect(optional.isPresent()).toBe(false);
    expect(optional.isEmpty()).toBe(true);

    expect(optional.empty(() => 5)).toBe(5);
    expect(optional.present(() => 10)).toBeUndefined();
  });

  it('should create optional empty with method "build"', () => {
    const optional = Optional.build(undefined);

    expect(optional.isPresent()).toBe(false);
    expect(optional.isEmpty()).toBe(true);

    expect(optional.empty(() => 5)).toBe(5);
    expect(optional.present(() => 10)).toBeUndefined();
  });

  it('should eval function "when" for optionals successful', () => {
    const present = Optional.build(50);

    expect(
      present.when(
        (value) => value * 2,
        () => 3
      )
    ).toBe(100);

    const empty = Optional.build(null);

    expect(
      empty.when(
        () => '5',
        () => 'Daniel'
      )
    ).toBe('Daniel');
  });

  it('should generate exception in create undefined', () => {
    try {
      Optional.of(undefined);
    } catch ({ message }: any) {
      expect(message).toBe('The passed value was null or undefined.');
    }
  });

  it('should generate exception in create null', () => {
    try {
      Optional.of(null);
    } catch ({ message }: any) {
      expect(message).toBe('The passed value was null or undefined.');
    }
  });

  it('should generate exception when get value in optional empty', () => {
    try {
      const optional = Optional.empty();

      expect(optional.isEmpty()).toBe(true);

      optional.get();
    } catch ({ message }: any) {
      expect(message).toBe('The optional is not present.');
    }
  });
});
