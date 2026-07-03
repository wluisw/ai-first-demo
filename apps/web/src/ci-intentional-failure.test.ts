describe('intentional CI failure', () => {
  it('fails so the CI pipeline reports an error', () => {
    const ciMustFail: string = 123;
    expect(ciMustFail).toBe('unreachable');
    expect(true).toBe(false);
  });
});
