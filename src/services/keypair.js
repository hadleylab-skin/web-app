import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import tree from 'libs/tree';

const iv = CryptoJS.enc.Latin1.parse('{+!%i=]%Y/upi8!Z');
const padding = CryptoJS.pad.Pkcs7;
const mode = CryptoJS.mode.CBC;

function getPrivateKey() {
    const password = tree.get('loginPage', 'password');
    const encryptedPrivateKey = tree.get('token', 'data', 'doctor', 'data', 'privateKey');
    return decryptAES(encryptedPrivateKey, password);
}

function getPublicKey() {
    return tree.get('token', 'data', 'doctor', 'data', 'publicKey');
}

export function encryptRSA(data, publicKey = undefined) {
    let _publicKey = publicKey || getPublicKey();
    const encryptor = new JSEncrypt.JSEncrypt();
    encryptor.setPublicKey(_publicKey);
    return encryptor.encrypt(data);
}

export function decryptRSA(data) {
    const privateKey = getPrivateKey();
    const decryptor = new JSEncrypt.JSEncrypt();
    decryptor.setPrivateKey(privateKey);
    return decryptor.decrypt(data);
}

export function encryptAES(data, key) {
    return CryptoJS.AES.encrypt(data, key, { iv, mode, padding }).toString();
}

export function decryptAES(ciphertext, key) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key, { iv, mode, padding });
    return bytes.toString(CryptoJS.enc.Utf8);
}
