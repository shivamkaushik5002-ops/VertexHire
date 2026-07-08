package com.shivam.jobPortal.service;

import com.shivam.jobPortal.dto.RecruiterDashboardResponse;
import com.shivam.jobPortal.entity.ApplicationStatus;
import com.shivam.jobPortal.entity.User;
import com.shivam.jobPortal.repository.ApplicationRepository;
import com.shivam.jobPortal.repository.JobRepository;
import org.springframework.stereotype.Service;

@Service
public class RecruiterDashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public RecruiterDashboardService(JobRepository jobRepository,
                                     ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public RecruiterDashboardResponse getDashboard(User recruiter) {

        long totalJobs = jobRepository.countByRecruiter(recruiter);

        long totalApplications =
                applicationRepository.countByJobRecruiter(recruiter);

        long pending =
                applicationRepository.countByJobRecruiterAndStatus(
                        recruiter,
                        ApplicationStatus.PENDING
                );

        long accepted =
                applicationRepository.countByJobRecruiterAndStatus(
                        recruiter,
                        ApplicationStatus.ACCEPTED
                );

        long rejected =
                applicationRepository.countByJobRecruiterAndStatus(
                        recruiter,
                        ApplicationStatus.REJECTED
                );

        return new RecruiterDashboardResponse(
                totalJobs,
                totalApplications,
                pending,
                accepted,
                rejected
        );
    }
}