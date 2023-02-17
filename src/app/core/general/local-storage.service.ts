/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { CORRUPT_LOCAL_STORAGE_MESSAGE } from '../errors/error-messages';

import { Cryptography } from '../security/cryptography';

export enum StorageKeys {
  sessionToken = 'key-01',
  identity     = 'key-02',
  permissions  = 'key-03',
  defaultRoute = 'key-04',
}

@Injectable()
export class LocalStorageService {

  private ENCRYPTION_KEY = environment.security_id;

  set<T>(key: StorageKeys, value: T) {
    localStorage.setItem(key, Cryptography.encryptAES(this.ENCRYPTION_KEY, JSON.stringify(value)));
  }

  get<T>(key: StorageKeys): T {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(Cryptography.decryptAES(this.ENCRYPTION_KEY, value)) as T : null;
    } catch (error) {
      throw new Error(`${CORRUPT_LOCAL_STORAGE_MESSAGE} (DECRYPT): ${key}`);
    }
  }

  remove(key: StorageKeys) {
    localStorage.removeItem(key);
  }

  removeAll() {
    localStorage.clear();
  }

}
