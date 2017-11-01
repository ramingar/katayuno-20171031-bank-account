import test from 'tape';

// Component to test
const BankAccount = function () {
    //let incomeDate = null;
    //let incomeCredit = null;
    const incomes = [];

    const updateIncome = function (iDate, iCredit) {
        //incomeDate = iDate;
        //incomeCredit = iCredit;
        incomes.push({iDate, iCredit});
    };
    const getBalance = function () {
        //return [{date: incomeDate, credit: incomeCredit, balance: incomeCredit}];
        let balance = null;
        incomes.forEach(function (val) {
            balance = {date: val.iDate, credit: val.iCredit, balance: val.iCredit}
        });
        return [balance];
    };

    return {updateIncome, getBalance};
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
