import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

export const encrypt = (text: string, secret: string): string => {
    return CryptoJS.AES.encrypt(text, secret).toString();
};

export const decrypt = (ciphertext: string, secret: string): string => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
};
