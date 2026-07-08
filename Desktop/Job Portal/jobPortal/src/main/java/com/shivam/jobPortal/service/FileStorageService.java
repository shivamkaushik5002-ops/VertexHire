package com.shivam.jobPortal.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads/resumes/";

    public String uploadResume(MultipartFile file) throws IOException {

        Files.createDirectories(Paths.get(uploadDir));

        String fileName =
                System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path path = Paths.get(uploadDir, fileName);

        Files.copy(
                file.getInputStream(),
                path,
                StandardCopyOption.REPLACE_EXISTING
        );

        return path.toString();
    }
}