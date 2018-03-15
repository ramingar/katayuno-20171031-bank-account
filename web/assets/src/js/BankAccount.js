import Income from './Income';

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

    const transfer = function (incomeDate, incomeCredit, bankAccount) {
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

export default BankAccount;
