/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { Subject } from '@app/models';


@Injectable()
export class AccessControlDataService {

  constructor(private http: HttpService) { }


  getContexts(): Observable<Identifiable[]> {
    const path = `v4/onepoint/security/management/contexts`;

    return this.http.get<Identifiable[]>(path);
  }


  getRolesByContext(contextUID: string): Observable<Identifiable[]> {
    const path = `v4/onepoint/security/management/contexts/${contextUID}/roles`;

    return this.http.get<Identifiable[]>(path);
  }


  getFeaturesByContext(contextUID: string): Observable<Identifiable[]> {
    const path = `v4/onepoint/security/management/contexts/${contextUID}/features`;

    return this.http.get<Identifiable[]>(path);
  }


  searchSubjects(contextUID: string, keywords: string): Observable<Subject[]> {
    Assertion.assertValue(contextUID, 'contextUID');

    let path = `v4/onepoint/security/management/subjects/?contextuid=${contextUID}`;

    if (!!keywords) {
      path += `&keywords=${keywords}`;
    }

    return this.http.get<Subject[]>(path);
  }


  getSubjectContexts(subjectUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}/contexts`;

    return this.http.get<Identifiable[]>(path);
  }


  getSubjectRolesByContext(subjectUID: string, contextUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}/contexts/${contextUID}/roles`;

    return this.http.get<Identifiable[]>(path);
  }


  getSubjectFeaturesByContext(subjectUID: string, contextUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}/contexts/${contextUID}/features`;

    return this.http.get<Identifiable[]>(path);
  }


  assignContextToSubject(subjectUID: string, contextUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}/contexts/${contextUID}`;

    return this.http.post<Identifiable[]>(path);
  }


  removeContextToSubject(subjectUID: string, contextUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}/contexts/${contextUID}`;

    return this.http.delete<Identifiable[]>(path);
  }


  assignRoleToSubject(subjectUID: string, contextUID: string, roleUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(roleUID, 'roleUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}` +
      `/contexts/${contextUID}/roles/${roleUID}`;

    return this.http.post<Identifiable[]>(path);
  }


  removeRoleToSubject(subjectUID: string, contextUID: string, roleUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(roleUID, 'roleUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}` +
      `/contexts/${contextUID}/roles/${roleUID}`;

    return this.http.delete<Identifiable[]>(path);
  }


  assignFeatureToSubject(subjectUID: string, contextUID: string, featureUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(featureUID, 'featureUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}` +
      `/contexts/${contextUID}/features/${featureUID}`;

    return this.http.post<Identifiable[]>(path);
  }


  removeFeatureToSubject(subjectUID: string, contextUID: string, featureUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(featureUID, 'featureUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}` +
      `/contexts/${contextUID}/features/${featureUID}`

    return this.http.delete<Identifiable[]>(path);
  }

}
