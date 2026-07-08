package com.shivam.jobPortal.service;

import com.shivam.jobPortal.dto.CandidateDashboardResponse;
import com.shivam.jobPortal.entity.ApplicationStatus;
import com.shivam.jobPortal.entity.User;
import com.shivam.jobPortal.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

@Service
public class CandidateDashboardService {

    private final ApplicationRepository applicationRepository;

    public CandidateDashboardService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public  CandidateDashboardResponse getDashboard(User candidate) {

        long totalApplications =
                applicationRepository.countByCandidate(candidate);

        long pendingApplications =
                applicationRepository.countByCandidateAndStatus(
                        candidate,
                        ApplicationStatus.PENDING);

        long acceptedApplications =
                applicationRepository.countByCandidateAndStatus(
                        candidate,
                        ApplicationStatus.ACCEPTED);

        long rejectedApplications =
                applicationRepository.countByCandidateAndStatus(
                        candidate,
                        ApplicationStatus.REJECTED);

        return new CandidateDashboardResponse(
                totalApplications,
                pendingApplications,
                acceptedApplications,
                rejectedApplications
        );
    }
}