/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Progress } from '@app/data-services/file-services/http-progress';

import { Observable } from 'rxjs';

export enum FileTypeAccepted {
  all = '*',
  pdf = 'application/pdf',
  excel = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  image = 'image/*',
  txt = 'text/plain',
}


export type FileType = 'all' | 'pdf' | 'excel' | 'txt' | 'image';


export interface FileControlConfig {
  autoUpload?: boolean;
  fileName?: string;
  filesTypes?: FileType[];
  maxFiles?: number;
  placeholder?: string;
  placeholderReadonly?: string;
  showFileInfo?: boolean;
  textAccion?: string;
  textSave?: string;
}


export const DefaultFileControlConfig: FileControlConfig = {
  autoUpload: false,
  fileName: null,
  filesTypes: ['all'],
  maxFiles: 1,
  placeholder: 'Elija un archivo o arrástrelo y suéltelo aquí.',
  placeholderReadonly: 'No se han agregado archivos.',
  showFileInfo: true,
  textAccion: 'Agregar archivo',
  textSave: 'Guardar archivo',
};


export type FileControlActions = 'SAVE' | 'CANCEL' | 'SHOW' | 'DOWNLOAD' | 'REMOVE';


export class FileControlMenuOptions {
  name: string;
  action: FileControlActions;
  disabled?: boolean;
}


export class FileData {
  uid?: string;
  name?: string;
  url?: string;
  size?: number;
  type?: string;
  menuOptions?: FileControlMenuOptions[];
  sizeString?: string;
  fileIcon?: string;
  file?: File;
  download$?: Observable<Progress>;
}


export const EmptyFileData: FileData = {
  uid: '',
  name: '',
  url: '',
  size: 0,
  type: '',
  menuOptions: [],
  sizeString: '',
  fileIcon: '',
  file: null,
};


export interface FileViewerData {
  fileList: FileData[];
  selectedFile?: FileData;
  title?: string;
  hint?: string;
}


export const EmptyFileViewerData: FileViewerData = {
  fileList: [],
  title: 'Visor de Archivos',
  hint: '',
};
