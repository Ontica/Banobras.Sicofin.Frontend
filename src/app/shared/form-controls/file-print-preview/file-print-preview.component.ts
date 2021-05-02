/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { MediaType } from '@app/core/data-types';

import { PrinterService } from '@app/shared/utils/printer.service';


@Component({
  selector: 'emp-ng-file-print-preview',
  templateUrl: './file-print-preview.component.html',
  styleUrls: ['./file-print-preview.component.scss']
})
export class FilePrintPreviewComponent {

  @Input() title: string;

  @Input() hint: string;

  display = false;

  url: string = null;

  constructor(private printerService: PrinterService) { }

  open(url, type) {
    if (!this.validUrl(url)) {
      return;
    }

    if (type === MediaType.html) {

      this.openWindowCenter(url);


      return;
    }
    this.url = url;
    this.display = true;
  }


  onClose() {
    this.url = null;
    this.display = false;
  }


  private validUrl(url: string) {
    return url !== null && url !== undefined && url !== '';
  }


  private openWindowCenter(url: string, width: number = 1100, height: number = 600) {
    const top = Math.floor((screen.height / 2) - (height / 2));
    const left = Math.floor((screen.width / 2) - (width / 2));

    return window.open(url, '_blank',
      `resizable=yes,width=${width},height=${height},top=${top},left=${left}`);
  }

}
