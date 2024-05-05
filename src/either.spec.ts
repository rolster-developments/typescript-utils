import { Either } from './either';

const otherwise = jest.fn();

describe('Either', () => {
  afterEach(() => jest.clearAllMocks());

  it('should eval success status defined successful', () => {
    expect(
      Either.success(10).when({
        success: (value) => value,
        failure: () => 20
      })
    ).toBe(10);

    expect(otherwise).toHaveBeenCalledTimes(0);
  });

  it('should success status undefined successful', () => {
    expect(
      Either.success().when(
        {
          success: (value) => value,
          failure: () => 20
        },
        otherwise
      )
    ).toBeUndefined();

    expect(otherwise).toHaveBeenCalledTimes(1);
  });

  it('should eval failure status defined successful', () => {
    expect(
      Either.failure(10).when({
        success: () => 20,
        failure: (value) => value
      })
    ).toBe(10);

    expect(otherwise).toHaveBeenCalledTimes(0);
  });

  it('should failure status undefined successful', () => {
    expect(
      Either.failure().when(
        {
          success: () => 20,
          failure: (value) => value
        },
        otherwise
      )
    ).toBeUndefined();

    expect(otherwise).toHaveBeenCalledTimes(1);
  });

  it('should failure status undefined successful', () => {
    expect(
      Either.failure(50).when({ success: () => 20 }, otherwise)
    ).toBeUndefined();

    expect(otherwise).toHaveBeenCalledTimes(1);
  });
});
