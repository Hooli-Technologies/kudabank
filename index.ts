require('dotenv').config()
const kudaBank = require('./src/kuda.ts')

const k = new kudaBank(process.env.PRIVATE_KEY_PATH)
k.getAccountBalance('vAcc-xIA_27ft1s').then((r:any) => {
    console.log({ r })
})

k.fundVirtualAccount('vAcc-xIA_27ft1s', 40000, 'Some experiment').then((r:any) => {
    console.log({ r })
})