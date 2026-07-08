package com.shivam.jobPortal.controller;
import java.io.IOException;
import java.util.*;
import com.shivam.jobPortal.dto.CandidateDashboardResponse;
import com.shivam.jobPortal.entity.Application;
import com.shivam.jobPortal.entity.Job;
import com.shivam.jobPortal.entity.User;
import com.shivam.jobPortal.exception.ResourceNotFoundException;
import com.shivam.jobPortal.repository.UserRepository;
import com.shivam.jobPortal.service.ApplicationService;
import com.shivam.jobPortal.service.CandidateDashboardService;
import com.shivam.jobPortal.service.FileStorageService;
import com.shivam.jobPortal.service.JobService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final ApplicationService applicationService;
    private final JobService jobService;
    private final UserRepository userRepository;
    private final CandidateDashboardService candidateDashboardService;
    private final FileStorageService fileStorageService;

    public CandidateController(
            ApplicationService applicationService,
            JobService jobService,
            UserRepository userRepository,
            CandidateDashboardService candidateDashboardService,
            FileStorageService fileStorageService) {

        this.applicationService = applicationService;
        this.jobService = jobService;
        this.userRepository = userRepository;
        this.candidateDashboardService = candidateDashboardService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/apply/{jobId}")
    public Application apply(
            @PathVariable Long jobId,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Candidate not found"));

        Job job = jobService.getJobById(jobId);

        return applicationService.apply(candidate, job);
    }

    @GetMapping("/applications")
    public List<Application> myApplications(
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Candidate not found"));

        return applicationService
                .getApplicationsByCandidate(candidate);
    }

    @GetMapping("/dashboard")
    public CandidateDashboardResponse dashboard(Authentication authentication) {

        User candidate = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        return candidateDashboardService.getDashboard(candidate);
    }

    @PostMapping("/upload-resume")
    public String uploadResume(

            @RequestParam("file") MultipartFile file,

            Authentication authentication

    ) throws IOException {

        User candidate = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Candidate not found"));

        String path = fileStorageService.uploadResume(file);

        candidate.setResumeUrl(path);

        userRepository.save(candidate);

        return "Resume uploaded successfully.";
    }
}