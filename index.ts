require('dotenv').config()
const kudaBank = require('./src/kuda.ts')

const k = new kudaBank(process.env.PRIVATE_KEY_PATH, process.env.PUBLIC_KEY_PATH)

// k.createVirtualAccount('Ibrahim', 'Abdullahi', 'ibrahim@hooli.ng', '09033366611').then((result: Object) => {
//     console.log({ result })
// })

// k.getAccountBalance('vAcc-xIA_27ft1s').then((r: any) => {
//     console.log({ r })
// })
// k.getBankCode('fb').then((r: any) => console.dir(r, { depth: null }) )
// k.enquireName('1100104603', '999129', null, false).then((r: any)=> console.log(r))

// k.getVirtualAccountNumberDetails('VIRTUAL-1TQ1BkTHso').then((result: Object) => {
//     console.dir({ result }, { depth: null})
// })
