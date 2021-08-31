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

export interface VirtualAccountDetail extends KudaApiReturn {
    Data: Account
}
