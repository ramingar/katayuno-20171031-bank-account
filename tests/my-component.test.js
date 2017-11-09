import test from 'tape';

const Income = function (incomeDate, incomeCredit) {
    return {incomeDate, incomeCredit}
};

// Component to test
const BankAccount = function () {
    const incomes = [];

    const updateIncome = function (incomeDate, incomeCredit) {
        const income = Income(incomeDate, incomeCredit);
        incomes.push(income);
        return this;
    };

    const getBalance = function () {
        let incomeLines = [];
        let balance = 0;
        incomes.forEach((val) => {
            balance += val.incomeCredit;
            incomeLines.push({date: val.incomeDate, credit: val.incomeCredit, balance});
        });
        return incomeLines;
    };

    const toString = function () {
        let detailedBalance = 'date || credit || balance\r\n';
        let balance = 0;
        incomes.forEach((val) => {
            balance += val.incomeCredit;
            detailedBalance += `${val.incomeDate} || ${val.incomeCredit} || ${balance}\r\n`;
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
        {date: '02/04/2014', credit: 5, balance: 5},
        {date: '10/04/2014', credit: 10, balance: 15}
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
    const expected = 'date || credit || balance\r\n02/04/2014 || 5 || 5\r\n10/04/2014 || 10 || 15\r\n';

    const bankAccount = BankAccount();
    const actual = bankAccount
        .updateIncome('02/04/2014', 5)
        .updateIncome('10/04/2014', 10)
        .toString();


    assert.equal(actual, expected, message);

    assert.end();
});