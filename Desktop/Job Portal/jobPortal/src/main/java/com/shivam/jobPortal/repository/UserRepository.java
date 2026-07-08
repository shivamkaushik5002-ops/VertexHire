package com.shivam.jobPortal.repository;

import java.util.Optional;
import com.shivam.jobPortal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);


}
