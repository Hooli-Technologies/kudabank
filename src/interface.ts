interface KudaApiReturn {
    status: Boolean,
    message: String
}

interface Account {
    Account: {
        AccountNumber: String,
        Email: String,
        PHoneNumber: String,
        LastName: String,
        FirstName: String,
        AccountName: String,
        TrackingReference: String,
        CreationDate: String,
    }
}

export interface BankObject {
    bankName: String,
    bankCode: String
}

export interface Beneficiary {
    BeneficiaryAccountNumber: String,
    BeneficiaryName: String,
    SenderAccountNumber: String | null,
    SenderName: String | null,
    BeneficiaryCustomerID: Number,
    BeneficiaryBankCode: String,
    NameEnquiryID: Number,
    ResponseCode: String | null,
    TransferCharge: Number | null,
    SessionID: String
}

export interface VirtualAccountDetail extends KudaApiReturn {
    Data: Account
}

