import test from 'tape';

const Income = function (incomeDate, incomeCredit, balance) {
    return {incomeDate, incomeCredit, balance}
};

// Component to test
const BankAccount = function () {
    const incomes = [];
    let withdrawal = false;

    const updateIncome = function (incomeDate, incomeCredit) {
        const income = Income(incomeDate, incomeCredit, getLastBalance() + incomeCredit);
        incomes.push(income);
        return this;
    };

    const getLastBalance = function () {
        let lastBalance = 0;
        if (incomes.length > 0) {
            lastBalance = incomes[incomes.length - 1].balance;
        }
        return lastBalance;
    };

    const getBalance = function () {
        withdrawal = false;
        let incomeLines = [];
        incomes.forEach((val) => {
            if (withdrawal || val.incomeCredit < 0) {
                withdrawal = true;
            }
            incomeLines.push({date: val.incomeDate, credit: val.incomeCredit, balance: val.balance});
        });
        return incomeLines.reverse();
    };

    const toString = function () {
        let detailedBalance = 'date || credit || balance\r\n';
        if (withdrawal) {
            detailedBalance = 'date || credit || debit || balance\r\n';
        }

        // trocear en funciones (date, credit, balance) y que la forma de mostrar el credit este dentro de su función
        getBalance().forEach((val) => {
            let tempBalance = `${val.date} || ${val.credit} || ${val.balance}\r\n`;
            if (withdrawal) {
                tempBalance = `${val.date} || ${val.credit} || || ${val.balance}\r\n`;
                if (val.credit < 0) {
                    tempBalance = `${val.date} || || ${val.credit} || ${val.balance}\r\n`;
                }
            }
            detailedBalance += tempBalance;
        });

        return detailedBalance;
    };

    return {updateIncome, getBalance, toString};
};

// TESTS
test('-------- Retrieving One Income ', (assert) => {
    const message = 'The Balance is five and the first Income is five.';
    const expected = [{date: '02/04/2014', credit: 5, balance: 5}];

    const bankAccount = BankAccount();
    const actual = bankAccount
        .updateIncome('02/04/2014', 5)
        .getBalance();

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Retrieving Two Income ', (assert) => {
    const message = 'The Balance is fifteen and we have two incomes of five and ten units.';
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
        'date || credit || balance\r\n' +
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
