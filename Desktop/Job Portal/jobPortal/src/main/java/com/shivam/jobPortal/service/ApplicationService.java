package com.shivam.jobPortal.service;

import com.shivam.jobPortal.dto.ApplicationResponse;
import com.shivam.jobPortal.entity.Application;
import com.shivam.jobPortal.entity.Job;
import com.shivam.jobPortal.entity.User;
import com.shivam.jobPortal.repository.ApplicationRepository;
import com.shivam.jobPortal.entity.ApplicationStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application apply(User candidate, Job job) {

        if (applicationRepository
                .findByCandidateAndJob(candidate, job)
                .isPresent()) {

            throw new RuntimeException(
                    "You have already applied for this job");
        }

        Application application = new Application();

        application.setCandidate(candidate);
        application.setJob(job);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus(ApplicationStatus.PENDING);

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByCandidate(User candidate) {
        return applicationRepository.findByCandidate(candidate);
    }

    public Application updateStatus(
            Long applicationId,
            ApplicationStatus status,
            Authentication authentication
    ) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        application.setStatus(status);

        return applicationRepository.save(application);
    }
    public List<Application> getApplicationsByJob(Job job) {

        return applicationRepository.findByJob(job);
    }

    public List<ApplicationResponse> getApplicationResponses(Job job) {

        return applicationRepository
                .findByJob(job)
                .stream()
                .map(application -> {

                    User candidate = application.getCandidate();

                    return new ApplicationResponse(

                            application.getId(),

                            candidate.getId(),

                            candidate.getName(),

                            candidate.getEmail(),

                            job.getId(),

                            job.getTitle(),

                            application.getStatus(),

                            candidate.getResumeUrl() != null,

                            "/api/recruiter/resume/" + candidate.getId()

                    );

                })
                .toList();
    }
}