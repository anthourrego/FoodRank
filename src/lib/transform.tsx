import CryptoJS from 'crypto-js';

const SECRET_KEY = 'mi-clave-super-secreta-2024';

const Transform = {
    encryptJson(jsonData: any) {
        try {
            const jsonString = JSON.stringify(jsonData);
            const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
            return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        } catch (error) {
            console.error('Error encriptando:', error);
            return null;
        }
    },
    decryptJson(encryptedData: string) {
        try {
            let base64 = encryptedData.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            const decrypted = CryptoJS.AES.decrypt(base64, SECRET_KEY);
            const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedString);
        } catch (error) {
            console.error('Error desencriptando:', error);
            return null;
        }
    }
}

export default Transform;
