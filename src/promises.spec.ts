import {
  catchPromise,
  fromPromise,
  thenPromise,
  voidPromise,
  zipPromise
} from './promises';

describe('Helpers', () => {
  it('should execute test of "fromPromise" successful', async () => {
    expect(await fromPromise(Promise.resolve(20))).toBe(20);
    expect(await fromPromise(20)).toBe(20);
  });

  it('should execute test of "zipPromise" successful', async () => {
    const result = await zipPromise<any>([
      () => Promise.resolve(20),
      () => Promise.resolve('Daniel'),
      () => Promise.resolve(true)
    ]);

    const [age, name, status] = result;

    expect(result).toBeDefined();
    expect(age).toBe(20);
    expect(name).toBe('Daniel');
    expect(status).toBe(true);

    const resultEmpty = await zipPromise([]);

    const [empty] = resultEmpty;

    expect(result).toBeDefined();
    expect(empty).toBeUndefined();

    await zipPromise<any>([
      () => Promise.resolve(20),
      () => Promise.resolve('Daniel'),
      () => Promise.reject('Error')
    ]).catch((err) => {
      expect(err).toBe('Error');
    });
  });

  it('should execute test of "thenPromise" successful', async () => {
    expect(await thenPromise(Promise.resolve(20))).toBe(undefined);

    expect(await thenPromise(Promise.reject('Error')).catch((err) => err)).toBe(
      'Error'
    );
  });

  it('should execute test of "voidPromise" successful', async () => {
    expect(await voidPromise(Promise.resolve(20))).toBe(undefined);
    expect(await voidPromise(Promise.reject('Error'))).toBe(undefined);
  });

  it('should execute test of "catchPromise" successful', async () => {
    expect(await catchPromise(Promise.resolve(20))).toBe(20);
    expect(await catchPromise(Promise.reject('Error'))).toBe(undefined);
  });
});
