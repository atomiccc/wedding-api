const { createComment } = require('./comments');

test('create comment works when passing correct params', async () => {
  expect.assertions(1);
  const response = await createComment();
  expect(response).toBe('peanut butter');
});

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});
