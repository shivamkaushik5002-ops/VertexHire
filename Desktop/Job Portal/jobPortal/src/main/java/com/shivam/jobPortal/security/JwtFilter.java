package com.shivam.jobPortal.security;

import com.shivam.jobPortal.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import java.io.IOException;



@Component
public class JwtFilter extends OncePerRequestFilter {


    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        if(authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            String token =
                    authHeader.substring(7);

            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority("ROLE_" + role)
                            )
                    );
            System.out.println("PATH = " + request.getServletPath());


            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            System.out.println("Role = " + role);
            System.out.println(
                    "Authority = ROLE_" + role
            );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
            System.out.println(
                    "Authentication = " +
                            SecurityContextHolder.getContext().getAuthentication()
            );

            System.out.println(
                    "Authenticated = " +
                            SecurityContextHolder.getContext().getAuthentication().isAuthenticated()
            );

            System.out.println("Authenticated User: " + email);
        }

        System.out.println("AUTH HEADER = " + authHeader);
        System.out.println("PATH = " + request.getServletPath());
        filterChain.doFilter(request,response);

    }
}