/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import * as CryptoJS from 'crypto-js';


export class Cryptography {

  static createHash(value: string): string {
    return CryptoJS.SHA256(value).toString();
  }

  static encryptAES(key: string, value: string): string {
    return CryptoJS.AES.encrypt(value, key).toString();
  }

  static decryptAES(key: string, value: string): string {
    return CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
  }

}
