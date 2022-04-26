const CC = require("currency-converter-lt");

module.exports = class Currency {

    static async convertCurrency(from, to, value) {
        let result = 0;

        let currencyConverter = new CC();


        await currencyConverter.from(from).to(to).amount(value).convert().then((response) => {

            result = response;
        })
        return result
    }

    static async getDollarShekelRate() {

        let currencyConverter = new CC({from: "USD", to: "ILS"});

        let result = 0;

        await currencyConverter.rates().then((response) => {
            result = response;
        })

        return result
    }
    static async getShekelDollarRate() {

        let currencyConverter = new CC({from: "ILS", to: "USD"});

        let result = 0;

        await currencyConverter.rates().then((response) => {
            result = response;
        })

        return result
    }

}