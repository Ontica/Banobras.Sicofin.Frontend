/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';

import { FormatLibrary } from '@app/shared/utils';


export class Validate {

  static hasValue(object: any): boolean {
    if (object === null) {
      return false;
    }
    if (typeof object === 'undefined') {
      return false;
    }
    if (object === {}) {
      return false;
    }
    if (typeof object === 'string' && object === '') {
      return false;
    }
    return true;
  }


  static isEmail(value: string): boolean {
    if (!this.hasValue(value)) {
      return false;
    }
    const regularExpresion = new RegExp(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/);
    const test = regularExpresion.test(value);
    return test;
  }


  static isTrue(value: boolean): boolean {
    return value === true;
  }


  static notNull(value: any): boolean {
    if ((value === null) || (typeof value === 'undefined') || value === {}) {
      return false;
    }
    return true;
  }


  static isPositive(control: AbstractControl): ValidationErrors | null {
    if (typeof control.value === 'string' && FormatLibrary.stringToNumber(control.value) <= 0 ) {
      return { isPositive: true };
    }
    if (typeof control.value === 'number' && control.value <= 0 ) {
      return { isPositive: true };
    }
    return null;
  }


  static maxCurrencyValue(max: number): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && ( FormatLibrary.stringToNumber(control.value) > max )) {
        return { maxCurrencyValue: true };
      }
      return null;
    };
  }


  static minCurrencyValue(min: number): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && ( FormatLibrary.stringToNumber(control.value) < min )) {
        return { minCurrencyValue: true };
      }
      return null;
    };
  }


  static curpValid(curp) {
    const re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
    const validado = curp.match(re);
    if (!validado) { // Does it match the general format?
      return false;
    }
    // Validate that the check digit matches
    function digitoVerificador(curp17) {
      // Source https://consultas.curp.gob.mx/CurpSP/
      const diccionario = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
      let lngSuma = 0.0;
      let lngDigito = 0.0;

      for (let i = 0; i < 17; i++) {
        lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
      }
      lngDigito = 10 - lngSuma % 10;
      if (lngDigito === 10) {
        return 0;
      }
      return lngDigito;
    }

    if (validado[2] !== digitoVerificador(validado[1])) {
      return false;
    }
    return true;
  }


  static rfcValid(rfc: string) {
    // regex from the SAT official site to validate RFCs
    const patternPM = '^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])' +
      '([A-Z0-9]{3}))|(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])' +
      '([A-Z0-9]{3}))|(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|' +
      '(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$';
    const patternPF = '^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])' +
      '([A-Z0-9]{3}))|(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])' +
      '([A-Z0-9]{3}))|(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|' +
      '(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$';

    if (rfc.match(patternPM) || rfc.match(patternPF)) {
      return true;
    } else {
      return false;
    }
  }

}
