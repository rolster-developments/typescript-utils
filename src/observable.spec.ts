import { observable } from './observable';

fdescribe('Observable', () => {
  it('should create observable', () => {
    const observable$ = observable(50);
    expect(observable$).toBeDefined();
  });

  it('should listen changes of observable', (done) => {
    const observable$ = observable(50);
    let finish = false;

    const unsubscription = observable$.subscribe((value) => {
      if (!finish) {
        expect(value).toBe(50);
      } else {
        expect(value).toBe(20);
        unsubscription();
        done();
      }

      finish = true;
    });

    observable$.next(20);
  });
});
