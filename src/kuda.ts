const fs = require("fs")
const shortid = require("shortid");
const kuda = require('kuda-node');

import { VirtualAccountDetail, BankObject, Beneficiary, SendMoney } from './interface';

class KudaBank {

    instance: any

    constructor(privateKeyFile: String, publicKeyFile: String) {
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

    createVirtualAccount(firstName: String, lastName: String, email: String, phoneNumber: String, trackingPrefix = 'VIRTUAL-') : Promise<VirtualAccountDetail> {
        return this.call('ADMIN_CREATE_VIRTUAL_ACCOUNT', {
            firstName,
            lastName,
            email,
            phoneNumber,
            trackingReference: trackingPrefix + shortid.generate() // todo: consider uuid4
        })
    }

    getVirtualAccountNumberDetails(trackingReference: String):Promise<VirtualAccountDetail> {
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

    private async getBankCode(bankName: String): Promise<BankObject>{
        bankName.toLowerCase().trim()
        const banks = await this.call('BANK_LIST');
        const name: Function = (): String => {
            if (bankName == ('gtb' || 'gt bank' || 'gtbank' || 'guarantee trust bank')) return 'GTBank';
            if (bankName == ('first bank' || 'fb' || 'first' || 'firstbank')) return 'First Bank';
            if (bankName == ('Access bank' || 'Access' || 'accessbank')) return 'Access Bank';
            if((bankName == 'Kudimoney(Kudabank)' || 'Kudabank' || 'kuda')) return 'Kudimoney(Kudabank)'
            return 'Kudimoney(Kudabank)'
        }
       
        return banks.Data.banks.find((bank: any) => bank.bankName === name());

   }
    
     async enquireName(
        baneficiaryAccNo: String,
         beneficiaryBankCode: String,
         isRequestFromVirtualAccount: Boolean,
         name: String,
        SenderTrackingReference?: String        
    ): Promise<Beneficiary> {
        const beneficiary = await this.call('NAME_ENQUIRY', {
            beneficiaryAccountNumber: baneficiaryAccNo,
            beneficiaryBankCode,
            SenderTrackingReference,
            isRequestFromVirtualAccount
       })
        const res= []
         const allNames = name.toLowerCase().trim().split(' ');
         for (const name in allNames) {
             res.push(beneficiary.Data.BeneficiaryName.toLowerCase().includes(allNames[name].toLowerCase()))
         }
         if(res.includes(false)) throw new Error('Beneficiary name does not match')
         return beneficiary;
    }
    
    async sendMoney(
        amount: Number,
        beneficiaryAccountNumber: String,
        bankName: String,
        beneficiaryName: String,
        senderName: String,
        SenderTrackingReference: String,
        isRequestFromVirtualAccount: Boolean,
        from: String,
        narration?: String,
    ): Promise<SendMoney> {
        const bank: BankObject = await this.getBankCode(bankName);
        const beneficiary: Beneficiary = await this.enquireName(beneficiaryAccountNumber, bank.bankCode, isRequestFromVirtualAccount, beneficiaryName, SenderTrackingReference,)
        
        // console.log('bank', bank);
        // console.log('ben', beneficiary);
        
        
        return this.call(
            from ? 'VIRTUAL_ACCOUNT_FUND_TRANSFER' : 'SINGLE_FUND_TRANSFER',
            {
                beneficiarybankCode: bank.bankCode,
                beneficiaryAccount: beneficiaryAccountNumber,
                beneficiaryName: beneficiary.BeneficiaryName,
                amount,
                narration,
                nameEnquirySessionID: beneficiary.SessionID,
                trackingReference: SenderTrackingReference,
                senderName,
                nameEnquiryId: beneficiary.SessionID
            }
        )
        
    }

}

module.exports = KudaBank