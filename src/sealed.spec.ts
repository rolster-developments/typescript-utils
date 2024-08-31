import { Sealed } from './sealed';

class SealedTest extends Sealed<
  string,
  string,
  {
    daniel: (lastName: string) => string;
    email: (firstEmail: string) => string;
  }
> {
  public static daniel(lastName: string): SealedTest {
    return new SealedTest('daniel', lastName);
  }

  public static email(firstEmail: string): SealedTest {
    return new SealedTest('email', firstEmail);
  }
}

const resolver = {
  daniel: (lastName: string) => `Daniel ${lastName}`,
  email: (firstEmail: string) => `${firstEmail}@rolster.com`
};

const danielSpy = jest.spyOn(resolver, 'daniel');
const emailSpy = jest.spyOn(resolver, 'email');

const otherwise = jest.fn();

describe('Sealed', () => {
  afterEach(() => jest.clearAllMocks());

  it('should execute method "daniel" in Sealed, not otherwise', () => {
    expect(SealedTest.daniel('Castillo').when(resolver)).toBe(
      'Daniel Castillo'
    );

    expect(danielSpy).toHaveBeenCalledTimes(1);
    expect(danielSpy).toHaveBeenCalledWith('Castillo');
    expect(emailSpy).toHaveBeenCalledTimes(0);
    expect(otherwise).toHaveBeenCalledTimes(0);
  });

  it('should execute method "daniel" in Sealed, with otherwise', () => {
    expect(SealedTest.daniel('Castillo').when(resolver, otherwise)).toBe(
      'Daniel Castillo'
    );

    expect(danielSpy).toHaveBeenCalledTimes(1);
    expect(danielSpy).toHaveBeenCalledWith('Castillo');
    expect(emailSpy).toHaveBeenCalledTimes(0);
    expect(otherwise).toHaveBeenCalledTimes(1);
  });

  it('should execute method "email" in Sealed, not otherwise', () => {
    expect(SealedTest.email('daniel.castillo').when(resolver)).toBe(
      'daniel.castillo@rolster.com'
    );

    expect(danielSpy).toHaveBeenCalledTimes(0);
    expect(emailSpy).toHaveBeenCalledWith('daniel.castillo');
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(otherwise).toHaveBeenCalledTimes(0);
  });

  it('should execute method "email" in Sealed, not otherwise', () => {
    expect(SealedTest.email('daniel.castillo').when(resolver, otherwise)).toBe(
      'daniel.castillo@rolster.com'
    );

    expect(danielSpy).toHaveBeenCalledTimes(0);
    expect(emailSpy).toHaveBeenCalledWith('daniel.castillo');
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(otherwise).toHaveBeenCalledTimes(1);
  });
});
