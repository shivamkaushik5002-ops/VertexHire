package com.shivam.jobPortal.repository;

import com.shivam.jobPortal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.shivam.jobPortal.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiter(User recruiter);
    Optional<Job> findByIdAndRecruiterEmail(Long id, String email);
    long countByRecruiter(User recruiter);

    List<Job> findByTitleContainingIgnoreCase(String keyword);

    List<Job> findByLocationContainingIgnoreCase(String location);

    List<Job> findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String title,
            String company,
            String location
    );

}