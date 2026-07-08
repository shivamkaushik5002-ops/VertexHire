package com.shivam.jobPortal.service;
import com.shivam.jobPortal.exception.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import com.shivam.jobPortal.entity.Job;
import com.shivam.jobPortal.repository.JobRepository;
import org.springframework.stereotype.Service;
import com.shivam.jobPortal.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import com.shivam.jobPortal.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    private static final Logger logger =
            LoggerFactory.getLogger(JobService.class);

    public JobService(JobRepository jobRepository,
                      UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {

        return jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found"));
    }


    public Job createJob(Job job, User recruiter) {

        job.setRecruiter(recruiter);
        job.setCreatedAt(LocalDateTime.now());

        logger.info("Job created successfully");

        return jobRepository.save(job);
    }

    public List<Job> getJobsByRecruiter(User recruiter) {

        return jobRepository.findByRecruiter(recruiter);
    }

    public List<Job> getRecruiterJobs(Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recruiter not found"));

        return jobRepository.findByRecruiter(recruiter);
    }

    public Job getOwnedJob(Long jobId, String recruiterEmail) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Job not found"
                        ));

        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Access denied"
            );
        }

        return job;
    }

    public Job updateJob(Long jobId,
                         Job updatedJob,
                         Authentication authentication) {

        String email = authentication.getName();

        Job existingJob = getOwnedJob(jobId, email);

        existingJob.setTitle(updatedJob.getTitle());
        existingJob.setCompany(updatedJob.getCompany());
        existingJob.setLocation(updatedJob.getLocation());
        existingJob.setDescription(updatedJob.getDescription());
        existingJob.setSalary(updatedJob.getSalary());

        logger.info("Recruiter {} updated job {}",
                email,
                existingJob.getId());

        return jobRepository.save(existingJob);
    }
    public void deleteJob(Long jobId,
                          Authentication authentication) {

        String email = authentication.getName();

        Job job = getOwnedJob(jobId, email);

        jobRepository.delete(job);

        logger.info("Recruiter {} deleted job {}",
                email,
                job.getTitle());
        jobRepository.delete(job);
    }
    public List<Job> searchJobs(String keyword) {
        return jobRepository
                .findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocationContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword
                );
    }
    public Page<Job> getAllJobs(int page, int size, String sortBy) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).ascending()
        );

        return jobRepository.findAll(pageable);
    }


}