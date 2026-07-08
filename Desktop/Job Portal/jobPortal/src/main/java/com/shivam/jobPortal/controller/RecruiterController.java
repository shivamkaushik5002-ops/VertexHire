package com.shivam.jobPortal.controller;

import com.shivam.jobPortal.dto.ApplicationResponse;
import com.shivam.jobPortal.dto.RecruiterDashboardResponse;
import com.shivam.jobPortal.entity.Application;
import com.shivam.jobPortal.entity.ApplicationStatus;
import com.shivam.jobPortal.entity.Job;
import com.shivam.jobPortal.entity.User;
import com.shivam.jobPortal.exception.ResourceNotFoundException;
import com.shivam.jobPortal.exception.UnauthorizedException;
import com.shivam.jobPortal.repository.UserRepository;
import com.shivam.jobPortal.service.ApplicationService;
import com.shivam.jobPortal.service.JobService;
import com.shivam.jobPortal.service.RecruiterDashboardService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import com.shivam.jobPortal.repository.ApplicationRepository;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {

    private final ApplicationService applicationService;
    private final JobService jobService;
    private final UserRepository userRepository;
    private final RecruiterDashboardService recruiterDashboardService;
    private final ApplicationRepository applicationRepository;

    public RecruiterController(ApplicationService applicationService, JobService jobService,
                               UserRepository userRepository,
                               RecruiterDashboardService recruiterDashboardService,
    ApplicationRepository applicationRepository) {
        this.applicationService = applicationService;
        this.jobService = jobService;
        this.userRepository = userRepository;
        this.recruiterDashboardService = recruiterDashboardService;
        this.applicationRepository = applicationRepository;
    }

    @PostMapping("/jobs")
    public Job createJob(@Valid @RequestBody Job job,
                         Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        return jobService.createJob(job, recruiter);
    }

    @GetMapping("/jobs")
    public List<Job> getMyJobs(Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        return jobService.getJobsByRecruiter(recruiter);
    }

    @PutMapping("/jobs/{jobId}")
    public Job updateJob(@Valid @PathVariable Long jobId,
                         @RequestBody Job updatedJob,
                         Authentication authentication) {

        return jobService.updateJob(
                jobId,
                updatedJob,
                authentication
        );
    }

    @DeleteMapping("/jobs/{jobId}")
    public String deleteJob(@PathVariable Long jobId,
                            Authentication authentication) {

        jobService.deleteJob(jobId, authentication);

        return "Job deleted successfully";
    }

    @PutMapping("/applications/{applicationId}/status")
    public Application updateStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {

        return applicationService.updateStatus(
                applicationId,
                status,
                authentication
        );
    }

    @GetMapping("/jobs/{jobId}/applications")
    public List<ApplicationResponse> getApplications(
            @PathVariable Long jobId,
            Authentication authentication) {

        String email = authentication.getName();

        Job job = jobService.getOwnedJob(jobId, email);

        return applicationService.getApplicationResponses(job);
    }

    @GetMapping("/dashboard")
    public RecruiterDashboardResponse dashboard(Authentication authentication) {

        User recruiter = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        return recruiterDashboardService.getDashboard(recruiter);
    }

    @GetMapping("/resume/{candidateId}")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long candidateId,
            Authentication authentication)
            throws MalformedURLException {

        User recruiter = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recruiter not found"));

        User candidate = userRepository
                .findById(candidateId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Candidate not found"));


        if (candidate.getResumeUrl() == null) {
            throw new ResourceNotFoundException("Resume not uploaded");
        }

        Path path = Paths.get(candidate.getResumeUrl());

        Resource resource = new UrlResource(path.toUri());

        if (!applicationRepository.existsByCandidateAndJobRecruiter(
                candidate,
                recruiter)) {

            throw new UnauthorizedException(
                    "You are not authorized to access this resume.");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                path.getFileName().toString() + "\"")
                .body(resource);
    }




}