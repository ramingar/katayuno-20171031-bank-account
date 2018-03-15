import test from 'tape';
import BankAccount from '../web/assets/src/js/BankAccount';

test('-------- Retrieving One Income ', (assert) => {
    const message = 'Checking balance and one income.';
    const expected = [{date: '02/04/2014', credit: 5, balance: 5}];

    const bankAccount = BankAccount();
    const actual = bankAccount
        .updateIncome('02/04/2014', 5)
        .getBalance();

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Retrieving Two Income ', (assert) => {
    const message = 'Checking balance with two incomes.';
    const expected = [
        {date: '10/04/2014', credit: 10, balance: 15},
        {date: '02/04/2014', credit: 5, balance: 5}
    ];

    const bankAccount = BankAccount();
    const actual = bankAccount
        .updateIncome('02/04/2014', 5)
        .updateIncome('10/04/2014', 10)
        .getBalance();

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Retrieving One Income (in text)', (assert) => {
    const message = 'Returned value is in formatted text';
    const expected = 'date || credit || balance\r\n02/04/2014 || 5 || 5\r\n';

    const bankAccount = BankAccount();
    const actual = bankAccount.updateIncome('02/04/2014', 5).toString();

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Retrieving Two Income (in text)', (assert) => {
    const message = 'Returned value is in formatted text';
    const expected = 'date || credit || balance\r\n10/04/2014 || 10 || 15\r\n02/04/2014 || 5 || 5\r\n';

    const bankAccount = BankAccount();
    const actual = bankAccount
        .updateIncome('02/04/2014', 5)
        .updateIncome('10/04/2014', 10)
        .toString();


    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Retrieving One Withdrawal ', (assert) => {
    const message = 'Checking Balance after one withdrawal.';
    const expected = [
        {date: '02/04/2014', credit: -5, balance: 10},
        {date: '02/02/2014', credit: 10, balance: 15},
        {date: '01/02/2014', credit: 5, balance: 5},
    ];

    const bankAccount = BankAccount();
    const actual = bankAccount
        .updateIncome('01/02/2014', 5)
        .updateIncome('02/02/2014', 10)
        .updateIncome('02/04/2014', -5)
        .getBalance();

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Retrieving One Withdrawal (in text)', (assert) => {
    const message = 'Returned value is in formatted text';
    const expected =
        'date || credit || debit || balance\r\n' +
        '18/04/2014 || 5 || || -5\r\n' +
        '10/04/2014 || || -15 || -10\r\n' +
        '02/04/2014 || 5 || || 5\r\n';

    const bankAccount = BankAccount();
    const actual = bankAccount
        .updateIncome('02/04/2014', 5)
        .updateIncome('10/04/2014', -15)
        .updateIncome('18/04/2014', 5)
        .toString();


    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Transferring money between accounts ', (assert) => {
    const messageOriginAccount = 'Origin account must have less money';
    const messageDestinationAccount = 'Destination account must have more money';
    const expectedOrigin = [
        {date: '02/04/2014', credit: -10, balance: 0},
        {date: '02/04/2014', credit: -5, balance: 10},
        {date: '02/02/2014', credit: 10, balance: 15},
        {date: '01/02/2014', credit: 5, balance: 5},
    ];
    const expectedDestination = [
        {date: '02/04/2014', credit: 10, balance: 20},
        {date: '02/04/2014', credit: -5, balance: 10},
        {date: '02/02/2014', credit: 10, balance: 15},
        {date: '01/02/2014', credit: 5, balance: 5},
    ];
    const bankAccountOrigin = BankAccount();
    const bankAccountDestination = BankAccount();
    bankAccountOrigin
        .updateIncome('01/02/2014', 5)
        .updateIncome('02/02/2014', 10)
        .updateIncome('02/04/2014', -5);
    bankAccountDestination
        .updateIncome('01/02/2014', 5)
        .updateIncome('02/02/2014', 10)
        .updateIncome('02/04/2014', -5);

    bankAccountOrigin.transfer('02/04/2014', 10, bankAccountDestination);

    const actualOrigin = bankAccountOrigin.getBalance();
    const actualDestination = bankAccountDestination.getBalance();

    assert.deepEqual(actualOrigin, expectedOrigin, messageOriginAccount);
    assert.deepEqual(actualDestination, expectedDestination, messageDestinationAccount);

    assert.end();
});

test('-------- Transferring money between accounts (in text)', (assert) => {
    const messageOriginAccount = 'Origin account must have less money';
    const messageDestinationAccount = 'Destination account must have more money';
    const expectedOrigin =
        'date || credit || debit || balance\r\n' +
        '18/04/2014 || || -10 || 0\r\n' +
        '18/04/2014 || || -5 || 10\r\n' +
        '10/04/2014 || 10 || || 15\r\n' +
        '02/04/2014 || 5 || || 5\r\n';
    const expectedDestination =
        'date || credit || debit || balance\r\n' +
        '18/04/2014 || 10 || || 20\r\n' +
        '18/04/2014 || || -5 || 10\r\n' +
        '10/04/2014 || 10 || || 15\r\n' +
        '02/04/2014 || 5 || || 5\r\n';

    const bankAccountOrigin = BankAccount();
    const bankAccountDestination = BankAccount();
    bankAccountOrigin
        .updateIncome('02/04/2014', 5)
        .updateIncome('10/04/2014', 10)
        .updateIncome('18/04/2014', -5);
    bankAccountDestination
        .updateIncome('02/04/2014', 5)
        .updateIncome('10/04/2014', 10)
        .updateIncome('18/04/2014', -5);

    bankAccountOrigin.transfer('18/04/2014', 10, bankAccountDestination);

    const actualOrigin = bankAccountOrigin.toString();
    const actualDestination = bankAccountDestination.toString();

    assert.equal(actualOrigin, expectedOrigin, messageOriginAccount);
    assert.equal(actualDestination, expectedDestination, messageDestinationAccount);

    assert.end();
});