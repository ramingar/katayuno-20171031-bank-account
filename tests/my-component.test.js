import test from 'tape';

// Component to test
const BankAccount = function () {
    const incomes = [];

    const updateIncome = function (iDate, iCredit) {
        incomes.push({iDate, iCredit});
        return this;
    };

    const getBalance = function () {
        let balance = null;
        incomes.forEach((val) => {
            balance = {date: val.iDate, credit: val.iCredit, balance: val.iCredit};
        });
        return [balance];
    };

    const ToString = function () {
        let detailedBalance = 'date || credit || balance\r\n';
        incomes.forEach((val) => {
            detailedBalance += `${val.iDate} || ${val.iCredit} || ${val.iCredit}\r\n`;
        });

        return detailedBalance;
    };

    return {updateIncome, getBalance, ToString};
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
    const actual = bankAccount.updateIncome('02/04/2014', '5').ToString();

    assert.equal(actual, expected, message);

    assert.end();
});