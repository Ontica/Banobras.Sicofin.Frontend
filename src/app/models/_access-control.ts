/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';


export enum AccessControlQueryType {
  Subjects = 'Subjects',
  Roles    = 'Roles',
  Features = 'Feature',
}


export const AccessControlQueryTypeList: Identifiable[] = [
  {uid: AccessControlQueryType.Subjects, name: 'Usuarios'},
  {uid: AccessControlQueryType.Roles,    name: 'Roles'},
  {uid: AccessControlQueryType.Features, name: 'Permisos'},
];


export interface AccessControlSelectionData {
  type: AccessControlQueryType,
  item: Subject | Role | Feature,
}


export const EmptyAccessControlSelectionData: AccessControlSelectionData = {
  type: AccessControlQueryType.Subjects,
  item: Empty,
}


export enum SecurityItemType {
  Context = 'Context',
  Role    = 'Role',
  Feature = 'Feature',
}


export interface SecurityItem extends Identifiable {
  uid: string;
  name: string;
  description?: string;
  group?: string;
}


export interface Subject {
  uid: string;
  userID: string;
  fullName: string;
  nickName: string;
  eMail: string;
  workplace: string;
  businessID: string;
  lastAccess: DateString;
  isSystem: boolean;
  status: string;
}


export interface Role extends SecurityItem {

}


export interface Feature extends SecurityItem {

}


export interface SubjectFields {
  fullName: string;
  nickName: string;
  eMail: string;
  userID: string;
  roles?: string[];
}


export const EmptySubject: Subject = {
  uid: '',
  userID: '',
  fullName: '',
  nickName: '',
  eMail: '',
  workplace: '',
  businessID: '',
  lastAccess: '',
  isSystem: false,
  status: '',
}
