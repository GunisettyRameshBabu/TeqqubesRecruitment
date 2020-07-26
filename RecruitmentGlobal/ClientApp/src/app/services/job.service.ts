import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}

  getJobOpenings(req) {
    return this.http.post(
      environment.apiUrl + 'Openings/GetOpeningsByCountry/' + req.type,req
    );
  }

  getJobs() {
    return this.http.get(environment.apiUrl + 'Openings/GetJobs');
  }

  getJobDetails(id,userid) {
    return this.http.get(environment.apiUrl + 'Openings/' + id);
  }

  getJobForEdit(id: number) {
    return this.http.get(environment.apiUrl + 'Openings/GetOpeningById/' + id);
  }



  addOrUpdateOpening(opening: any) {
    if (opening.id == 0) {
      return this.http.post(environment.apiUrl + 'Openings', opening);
    } else {
      return this.http.put(
        environment.apiUrl + 'Openings/' + opening.id,
        opening
      );
    }
  }

  getNewJobid(id: any) {
    return this.http.get(environment.apiUrl + 'Countries/GetJobCode/' + id);
  }

  getCandidateStatus() {
    return this.http.get(environment.apiUrl + 'JobCandidateStatus');
  }

  getJobCandidates(jobid) {
    return this.http.get(
      environment.apiUrl + 'JobCandidates/GetByJobId/' + jobid
    );
  }

  getJobCandidate(id) {
    return this.http.get(
      environment.apiUrl + 'JobCandidates/' + id
    );
  }

  getDashboardData() {
    return this.http.get(
      environment.apiUrl + 'Openings/GetDashBoardData'
    );
  }

  getDashboardFilteredData(filter) {
    return this.http.post(
      environment.apiUrl + 'Openings/GetDashBoardData', filter
    );
  }

  getJobCandidatesByStatus(id) {
    return this.http.get(
      environment.apiUrl + 'JobCandidates/GetJobCandidatesByStatus/'+ id
    );
  }

  public addOrUpdateCandidate = (candidate) => {
    if (candidate.id != 0) {
      return this.http.put(
        environment.apiUrl + 'JobCandidates/' + candidate.id,
        candidate
      );
    } else {
      return this.http.post(environment.apiUrl + 'JobCandidates', candidate);
    }
  };

  public addCandidateResume = (id, files) => {
    const formData = new FormData();
    if (files != undefined && files.length > 0) {
      let fileToUpload = files[0];
      formData.append('file', fileToUpload, fileToUpload.name);
    }
    return this.http.put(
      environment.apiUrl + 'JobCandidates/UploadAttachment/' + id,
      formData
    );
  };

  public addRecruitCareResume = (id, files) => {
    const formData = new FormData();
    if (files != undefined && files.length > 0) {
      let fileToUpload = files[0];
      formData.append('file', fileToUpload, fileToUpload.name);
    }
    return this.http.put(
      environment.apiUrl + 'RecruitCares/UploadAttachment/' + id,
      formData
    );
  };

  public GetRecruitCare(req) {
    return this.http.post(
      environment.apiUrl + 'RecruitCares/GetRecruitCareByMe', req
    );
  }

  public MoveToJobCandidates(id) {
    return this.http.delete(
      environment.apiUrl + 'RecruitCares/MoveToJobCandidates/' + id
    );
  }

  public DeleteRecruitCare(id) {
    return this.http.delete(
      environment.apiUrl + 'RecruitCares/' + id
    );
  }
  public addOrUpdateRecruitCare(item) {
    if (item.id > 0) {
      return this.http.put(
        environment.apiUrl + 'RecruitCares/' + item.id,
        item
      );
    } else {
      return this.http.post(environment.apiUrl + 'RecruitCares', item);
    }
  }

  public SendEmail(data: { key: string , value: any }[] ) {
    return this.http.post(
      environment.apiUrl + 'RecruitCares/SendEmail', data
    );
  }

  getStatesByJobId(id: number, includeDefaults = false) {
    return this.http.get(
      environment.apiUrl + 'States/GetStatesByJobId/' + id + '/'+includeDefaults
    );
  }
}
