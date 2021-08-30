const fs = require("fs")
const shortid = require("shortid");
const kuda = require('kuda-node');

class KudaBank {

    instance: any

    constructor(privateKeyFile: String, publicKeyFile: String = './secrets/kuda.public.xml') {

        let clientKey: String = privateKeyFile.split('/')?.pop() || ""
        clientKey = clientKey.split('.')[0]

        this.instance = kuda({
            publicKey: fs.readFileSync(publicKeyFile),
            privateKey: fs.readFileSync(privateKeyFile),
            clientKey
        })
    }

    private async call(serviceType: String, data: Object = {}) {
        return await this.instance({
            serviceType,
            requestRef: Math.floor(Math.random() * 1000000000000 + 1), // todo: use uuid4.
            data
        });
    }

    getAccountBalance(trackingReference?: String) {
        return this.call(
            trackingReference ? 'RETRIEVE_VIRTUAL_ACCOUNT_BALANCE' : 'ADMIN_RETRIEVE_MAIN_ACCOUNT_BALANCE',
            {trackingReference}
        )
    }

    createVirtualAccount(firstName: String, lastName: String, email: String, phoneNumber: String, trackingPrefix = 'VIRTUAL-') {
        return this.call('ADMIN_CREATE_VIRTUAL_ACCOUNT', {
            firstName,
            lastName,
            email,
            phoneNumber,
            trackingReference: trackingPrefix + shortid.generate() // todo: consider uuid4
        })
    }

    getVirtualAccountNumberDetails(trackingReference: String) {
        return this.call('ADMIN_RETRIEVE_SINGLE_VIRTUAL_ACCOUNT', {trackingReference})
    }

    fundVirtualAccount(target: String, amount: number, narration: String) {
        return this.call('FUND_VIRTUAL_ACCOUNT', {
            trackingReference: target,
            amount: (amount * 100).toString(),
            narration
        })
    }

    debitVirtualAccount(target: String, amount: number, narration: String) {
        return this.call('WITHDRAW_VIRTUAL_ACCOUNT', {
            trackingReference: target,
            amount: (amount * 100).toString(),
            narration
        })
    }

    sendMoney(amount: String, beneficiaryAccountNumber: String, beneficiaryName: String, bankName: String, from?: String) {
        /**
         * Implement this function to execute a transfer either from a virtual account is @param from is provided,
         * or from the main account if from is not provided
         *
         * Not that transfer includes
         * 1. NAME_ENQUIRY
         * 2. SINGLE_FUND_TRANSFER
         */
        throw Error('Not implemented')
    }
}

module.exports = KudaBank