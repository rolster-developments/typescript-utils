import { Either } from './either';

describe('Either', () => {
  it('should eval success successful', () => {
    Either.success(10).when({
      success: (value) => {
        expect(value).toBe(10);
      },
      failure: () => {
        // Failure process not implement
      }
    });
  });

  it('should success undefined successful', () => {
    Either.success().when({
      success: (value) => {
        expect(value).toBeUndefined();
      },
      failure: () => {
        // Failure process not implement
      }
    });
  });

  it('should eval failure successful', () => {
    Either.failure(10).when({
      success: () => {
        // Success process not implement
      },
      failure: (value) => {
        expect(value).toBe(10);
      }
    });
  });

  it('should failure undefined successful', () => {
    Either.failure().when({
      success: () => {
        // Success process not implement
      },
      failure: (value) => {
        expect(value).toBeUndefined();
      }
    });
  });
});
