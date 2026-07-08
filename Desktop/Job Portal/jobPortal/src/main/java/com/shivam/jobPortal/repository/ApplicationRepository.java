package com.shivam.jobPortal.repository;

import com.shivam.jobPortal.entity.Application;
import com.shivam.jobPortal.entity.ApplicationStatus;
import com.shivam.jobPortal.entity.Job;
import com.shivam.jobPortal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository
        extends JpaRepository<Application, Long> {


    List<Application> findByCandidate(User candidate);

    List<Application> findByJob(Job job);

    Optional<Application> findByCandidateAndJob(
            User candidate,
            Job job
    );

    long countByJobRecruiter(User recruiter);

    long countByJobRecruiterAndStatus(User recruiter,
                                      ApplicationStatus status);

    long countByCandidate(User candidate);

    long countByCandidateAndStatus(User candidate,
                                   ApplicationStatus status);

    boolean existsByCandidateAndJobRecruiter(
            User candidate,
            User recruiter
    );

}