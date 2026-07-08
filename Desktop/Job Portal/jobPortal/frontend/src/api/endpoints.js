import api from "./client";

export const authApi = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  register: (payload) => api.post("/api/auth/register", payload),
};

export const jobApi = {
  list: (page = 0, size = 9, sortBy = "id") =>
    api.get("/api/jobs", { params: { page, size, sortBy } }),
  byId: (id) => api.get(`/api/jobs/${id}`),
  search: (keyword) => api.get("/api/jobs/search", { params: { keyword } }),
  create: (job) => api.post("/api/recruiter/jobs", job),
  update: (id, job) => api.put(`/api/recruiter/jobs/${id}`, job),
  remove: (id) => api.delete(`/api/recruiter/jobs/${id}`),
  myJobs: () => api.get("/api/recruiter/jobs"),
};

export const candidateApi = {
  apply: (jobId) => api.post(`/api/candidate/apply/${jobId}`),
  myApplications: () => api.get("/api/candidate/applications"),
  dashboard: () => api.get("/api/candidate/dashboard"),
  uploadResume: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post("/api/candidate/upload-resume", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const recruiterApi = {
  dashboard: () => api.get("/api/recruiter/dashboard"),
  applicationsForJob: (jobId) => api.get(`/api/recruiter/jobs/${jobId}/applications`),
  updateStatus: (applicationId, status) =>
    api.put(`/api/recruiter/applications/${applicationId}/status`, null, {
      params: { status },
    }),
  downloadResume: (candidateId) =>
    api.get(`/api/recruiter/resume/${candidateId}`, { responseType: "blob" }),
};
