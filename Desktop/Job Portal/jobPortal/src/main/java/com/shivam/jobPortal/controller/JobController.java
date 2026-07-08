package com.shivam.jobPortal.controller;
import com.shivam.jobPortal.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;

import com.shivam.jobPortal.entity.Job;
import com.shivam.jobPortal.service.JobService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public Job createJob(@RequestBody Job job,
                         Authentication authentication) {

        return jobService.createJob(job, (User) authentication);
    }

    @GetMapping
    public Page<Job> getAllJobs(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "id") String sortBy
    ) {

        return jobService.getAllJobs(
                page,
                size,
                sortBy
        );
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Long id,
                         @RequestBody Job job,
                         Authentication authentication) {

        return jobService.updateJob(
                id,
                job,
                authentication
        );
    }

    @GetMapping("/my-jobs")
    public List<Job> getMyJobs(Authentication authentication) {

        return jobService.getRecruiterJobs(authentication);
    }



    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id,
                            Authentication authentication) {

        jobService.deleteJob(id,
                authentication);

        return "Job deleted successfully";
    }

    @GetMapping("/search")
    public List<Job> searchJobs(
            @RequestParam String keyword) {

        return jobService.searchJobs(keyword);
    }

}