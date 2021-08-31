require('dotenv').config()
const kudaBank = require('./src/kuda.ts')

const k = new kudaBank(process.env.PRIVATE_KEY_PATH, process.env.PUBLIC_KEY_PATH)

k.createVirtualAccount('Ibrahim', 'Abdullahi', 'ibrahim@hooli.ng', '09033366611').then((result: Object) => {
    console.log({ result })
})
