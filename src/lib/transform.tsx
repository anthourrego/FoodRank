import CryptoJS from 'crypto-js';

const SECRET_KEY = 'mi-clave-super-secreta-2024';

const Transform = {
    encryptJson(jsonData: { [key: string]: string }) {
        try {
            const jsonString = JSON.stringify(jsonData);
            const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
            return encrypted;
        } catch (error) {
            console.error('Error encriptando:', error);
            return null;
        }
    },
    decryptJson(encryptedData: string) {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedString);
        } catch (error) {
            console.error('Error desencriptando:', error);
            return null;
        }
    }
}

export default Transform;
