/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Inject, Injectable } from '@angular/core';
import { HttpService } from '@app/core';
import { Observable } from 'rxjs';
import { reportHttpProgress, Progress } from './http-progress';
import { Saver, SAVER } from './saver.provider';


@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor(private http: HttpService,
              @Inject(SAVER) private save: Saver) { }

  download(url: string, filename?: string): Observable<Progress> {

    return this.http.get(url, {reportProgress: true,
                               observe: 'events',
                               responseType: 'blob'})
      .pipe(
        reportHttpProgress(blob => this.save(blob, filename))
      );
  }
}
