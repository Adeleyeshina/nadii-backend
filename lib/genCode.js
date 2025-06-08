import crypto from 'crypto';
// const generateCode = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString()
// }

const generateCode = () => {
    return crypto.randomBytes(32).toString('hex')
}

export default generateCode