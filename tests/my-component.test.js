import test from 'tape';

// Component to test

// Testear que puedes puntuar desde 0 hasta 10 en primera
test('-------- Component: test ...', (assert) => {
    const message = 'Message when error';
    const expected = 1;

    const actual = 'component return';

    assert.equal(actual, expected, message);

    assert.end();
});
