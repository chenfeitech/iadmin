
import {JSEncrypt} from "jsencrypt";

// RSA加密
export function RSAEncrypt(publicKey,text){
    const jse = new JSEncrypt()
    jse.setPublicKey(publicKey)
    return jse.encrypt(text)
}