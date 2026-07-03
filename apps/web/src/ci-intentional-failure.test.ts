describe('intentional CI failure', () => {
  it('fails so the CI pipeline reports an error', () => {
    expect(true).toBe(false);
  });
});
