/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { Subject, SubjectFields, SubjectsQuery, UpdateCredentialsFields } from '@app/models';


@Injectable()
export class AccessControlDataService {

  constructor(private http: HttpService) { }


  getWorkareas(): Observable<Identifiable[]> {
    const path = `v4/onepoint/security/management/subjects/workareas`;

    return this.http.get<Identifiable[]>(path);
  }


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


  searchSubjects(query: SubjectsQuery): Observable<Subject[]> {
    let path = `v4/onepoint/security/management/subjects/search`;

    return this.http.post<Subject[]>(path, query);
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


  createSubject(subjectFields: SubjectFields): Observable<Subject> {
    Assertion.assertValue(subjectFields, 'subjectFields');

    const path = `v4/onepoint/security/management/subjects`;

    return this.http.post<Subject>(path, subjectFields);
  }


  updateSubject(subjectUID: string, subjectFields: SubjectFields): Observable<Subject> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(subjectFields, 'subjectFields');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}`;

    return this.http.put<Subject>(path, subjectFields);
  }


  deleteSubject(subjectUID: string): Observable<void> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}`;

    return this.http.delete<void>(path);
  }


  resetCredentialsToSubject(subjectUID: string): Observable<any> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}/reset-credentials`;

    return this.http.post<any>(path);
  }


  updateCredentialsToSubject(credentialsFields: UpdateCredentialsFields): Observable<any> {
    Assertion.assertValue(credentialsFields, 'credentialsFields');

    const path = `v4/onepoint/security/management/update-my-credentials`;

    return this.http.post<any>(path, credentialsFields);
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


  assignRoleToSubject(subjectUID: string,
                      contextUID: string,
                      roleUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(roleUID, 'roleUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}` +
      `/contexts/${contextUID}/roles/${roleUID}`;

    return this.http.post<Identifiable[]>(path);
  }


  removeRoleToSubject(subjectUID: string,
                      contextUID: string,
                      roleUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(roleUID, 'roleUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}` +
      `/contexts/${contextUID}/roles/${roleUID}`;

    return this.http.delete<Identifiable[]>(path);
  }


  assignFeatureToSubject(subjectUID: string,
                         contextUID: string,
                         featureUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(featureUID, 'featureUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}` +
      `/contexts/${contextUID}/features/${featureUID}`;

    return this.http.post<Identifiable[]>(path);
  }


  removeFeatureToSubject(subjectUID: string,
                         contextUID: string,
                         featureUID: string):Observable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(featureUID, 'featureUID');

    const path = `v4/onepoint/security/management/subjects/${subjectUID}` +
      `/contexts/${contextUID}/features/${featureUID}`

    return this.http.delete<Identifiable[]>(path);
  }

}
