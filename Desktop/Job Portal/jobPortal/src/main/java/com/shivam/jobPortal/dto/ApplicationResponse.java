package com.shivam.jobPortal.dto;

import com.shivam.jobPortal.entity.ApplicationStatus;

public class ApplicationResponse {

    private Long applicationId;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;

    private Long jobId;
    private String jobTitle;

    private ApplicationStatus status;

    private boolean resumeUploaded;

    private String downloadResumeUrl;

    public ApplicationResponse() {
    }

    public ApplicationResponse(Long applicationId,
                               Long candidateId,
                               String candidateName,
                               String candidateEmail,
                               Long jobId,
                               String jobTitle,
                               ApplicationStatus status,
                               boolean resumeUploaded,
                               String downloadResumeUrl) {

        this.applicationId = applicationId;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.status = status;
        this.resumeUploaded = resumeUploaded;
        this.downloadResumeUrl = downloadResumeUrl;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public boolean isResumeUploaded() {
        return resumeUploaded;
    }

    public void setResumeUploaded(boolean resumeUploaded) {
        this.resumeUploaded = resumeUploaded;
    }

    public String getDownloadResumeUrl() {
        return downloadResumeUrl;
    }

    public void setDownloadResumeUrl(String downloadResumeUrl) {
        this.downloadResumeUrl = downloadResumeUrl;
    }
}