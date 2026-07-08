# VertexHire — Job Portal Frontend

A luxury-styled React frontend for the Spring Boot job portal backend (auth, jobs, candidate & recruiter dashboards, applications, resume upload/download).

## Stack
React 18 + Vite, React Router, Axios, Tailwind CSS (v3), lucide-react icons.

## Color system
- Base `#0A0E27` · Surface `#1A1F3A` · Accent (gold) `#D4AF37` · Secondary (cyan) `#7ECBD9` · Text `#F5F5F5`
- Display font: Fraunces (serif) for headings, Inter for body — gives the "refined gold on deep navy" luxury feel with restrained motion (fade-ups, hover lifts, gold glow on focus/hover).

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
```

The API base URL is set in `src/api/client.js` (`API_BASE = "http://localhost:8080"`). Change it there if your backend runs elsewhere.

## ⚠️ Backend CORS — required change

Your `SecurityConfig.java` currently has no CORS configuration, so the browser will block requests from `localhost:5173` to `localhost:8080`. Add this:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

And enable it in the filter chain: `http.cors(Customizer.withDefaults())...`

## Pages built

- **Public**: Landing, job listings (search + sort + pagination), job detail + apply
- **Auth**: Login, register (role picker: Candidate / Recruiter)
- **Candidate**: Dashboard (stats + resume upload), My Applications
- **Recruiter**: Dashboard (stats), Manage Listings (create/edit/delete), Applicants per job (status update, resume download)
- **Admin**: Placeholder console page
- Role-based protected routing, JWT stored in localStorage and attached via Axios interceptor, auto-redirect to login on 401.

## Notes
- `Page<Job>` from `/api/jobs` is consumed directly (`data.content`, `data.totalPages`).
- Resume download uses `responseType: "blob"` and triggers a browser download.
- All Tailwind tokens map exactly to the requested palette (see `tailwind.config.js`).
