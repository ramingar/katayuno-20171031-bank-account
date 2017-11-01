import test from 'tape';

// Component to test
const BankAccount = function () {
    const incomes = [];

    const updateIncome = function (incomeDate, incomeCredit) {
        incomes.push({incomeDate, incomeCredit});
        return this;
    };

    const getBalance = function () {
        let balance = null;
        incomes.forEach((val) => {
            balance = {date: val.incomeDate, credit: val.incomeCredit, balance: val.incomeCredit};
        });
        return [balance];
    };

    const toString = function () {
        let detailedBalance = 'date || credit || balance\r\n';
        incomes.forEach((val) => {
            detailedBalance += `${val.incomeDate} || ${val.incomeCredit} || ${val.incomeCredit}\r\n`;
        });

        return detailedBalance;
    };

    return {updateIncome, getBalance, toString};
};

// TESTS
test('-------- Retrieving One Income ', (assert) => {
    const message = 'The Balance is five and the first Income is five.';
    const expected = [{date: '02/04/2014', credit: '5', balance: '5'}];

    const bankAccount = BankAccount();
    bankAccount.updateIncome('02/04/2014', '5');
    const actual = bankAccount.getBalance();

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Retrieving One Income (in text)', (assert) => {
    const message = 'Returned value is in formatted text';
    const expected = 'date || credit || balance\r\n02/04/2014 || 5 || 5\r\n';

    const bankAccount = BankAccount();
    const actual = bankAccount.updateIncome('02/04/2014', '5').toString();

    assert.equal(actual, expected, message);

    assert.end();
});