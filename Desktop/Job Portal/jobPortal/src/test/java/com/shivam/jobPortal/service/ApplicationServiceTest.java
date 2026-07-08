package com.shivam.jobPortal.service;

import com.shivam.jobPortal.entity.Job;
import com.shivam.jobPortal.entity.User;
import com.shivam.jobPortal.repository.JobRepository;
import com.shivam.jobPortal.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class should {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobService jobService;

    @Test
    void shouldReturnAllJobs() {

        Job job = new Job();
        job.setTitle("Java Developer");

        when(jobRepository.findAll())
                .thenReturn(List.of(job));

        List<Job> jobs = jobService.getAllJobs();

        assertEquals(1, jobs.size());
        assertEquals("Java Developer", jobs.get(0).getTitle());

        verify(jobRepository, times(1)).findAll();
    }

    @Test
    void shouldCreateJob() {

        User recruiter = new User();
        recruiter.setEmail("recruiter@gmail.com");

        Job job = new Job();
        job.setTitle("Backend Developer");

        when(jobRepository.save(any(Job.class)))
                .thenReturn(job);

        Job saved = jobService.createJob(job, recruiter);

        assertEquals("Backend Developer", saved.getTitle());

        verify(jobRepository).save(job);
    }
}