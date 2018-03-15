import test from 'tape';

const Income = function (incomeDate, incomeCredit, balance) {
    return {incomeDate, incomeCredit, balance}
};

// Component to test
const BankAccount = function () {
    const incomes = [];
    let withdrawal = false;
    const TYPE_OF_INCOMES = {
        ONLY_CREDITS: 1,
        IS_CREDIT: 2,
        IS_DEBIT: 3
    };

    const updateIncome = function (incomeDate, incomeCredit) {
        const income = Income(incomeDate, incomeCredit, getLastBalance() + incomeCredit);
        incomes.push(income);
        return this;
    };

    const transfer = function (incomeDate, incomeCredit, bankAccount){
        updateIncome(incomeDate, incomeCredit * -1);
        bankAccount.updateIncome(incomeDate, incomeCredit);

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
        let detailedBalance = '';
        getBalance().forEach((val) => {
            detailedBalance += `${getIncomeDate(val)} || ${getIncomeCredit(val)} || ${getIncomeBalance(val)}\r\n`;
        });
        return getHeader() + detailedBalance;
    };

    const getHeader = function () {
        let header = 'date || credit || balance\r\n';
        if (withdrawal) {
            header = 'date || credit || debit || balance\r\n';
        }
        return header;
    };

    const getIncomeDate = function (income) {
        return income.date;
    };

    const getIncomeCredit = function (income) {
        let credit = '';
        switch (getIncomeType(income)) {
            case TYPE_OF_INCOMES.ONLY_CREDITS:
                credit = `${income.credit}`;
                break;
            case TYPE_OF_INCOMES.IS_CREDIT:
                credit = `${income.credit} ||`;
                break;
            case TYPE_OF_INCOMES.IS_DEBIT:
                credit = `|| ${income.credit}`;
                break;
        }

        return credit;
    };

    const getIncomeType = function (income) {
        let incomeType = TYPE_OF_INCOMES.ONLY_CREDITS;
        if (withdrawal) {
            incomeType = TYPE_OF_INCOMES.IS_CREDIT;
            if (income.credit < 0) {
                incomeType = TYPE_OF_INCOMES.IS_DEBIT;
            }
        }
        return incomeType;
    };

    const getIncomeBalance = function (income) {
        return income.balance;
    };

    return {updateIncome, getBalance, transfer, toString};
};

// TESTS
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