package com.shivam.jobPortal.dto;

public class RecruiterDashboardResponse {

    private long totalJobs;
    private long totalApplications;
    private long pendingApplications;
    private long acceptedApplications;
    private long rejectedApplications;

    public RecruiterDashboardResponse() {}

    public RecruiterDashboardResponse(long totalJobs,
                                      long totalApplications,
                                      long pendingApplications,
                                      long acceptedApplications,
                                      long rejectedApplications) {
        this.totalJobs = totalJobs;
        this.totalApplications = totalApplications;
        this.pendingApplications = pendingApplications;
        this.acceptedApplications = acceptedApplications;
        this.rejectedApplications = rejectedApplications;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public long getAcceptedApplications() {
        return acceptedApplications;
    }

    public void setAcceptedApplications(long acceptedApplications) {
        this.acceptedApplications = acceptedApplications;
    }

    public long getRejectedApplications() {
        return rejectedApplications;
    }

    public void setRejectedApplications(long rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }
}