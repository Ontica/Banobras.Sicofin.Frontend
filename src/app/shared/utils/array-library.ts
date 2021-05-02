/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export class ArrayLibrary {

  static insertIfNotExist<T, K extends keyof T>(array: T[], item: T, key: K): T[] {
    let newArray = [...array];
    if (array.filter(element => element[key] === item[key]).length === 0) {
      newArray = [...array, ...[item]];
    }
    return newArray;
  }


  static insertItemTop<T, K extends keyof T>(array: T[], item: T, key: K): T[] {
    const oldArrayFilter = array.filter(element => element[key] !== item[key]);
    const newArray = [...[item], ...oldArrayFilter];
    return newArray;
  }

}
