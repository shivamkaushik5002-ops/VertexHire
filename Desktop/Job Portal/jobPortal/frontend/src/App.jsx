import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }     from "./context/AuthContext";
import { ToastProvider }    from "./components/Toast";
import ProtectedRoute       from "./components/ProtectedRoute";
import AppLayout            from "./layouts/AppLayout";

import Home               from "./pages/public/Home";
import JobList            from "./pages/public/JobList";
import JobDetail          from "./pages/public/JobDetail";
import NotFound           from "./pages/public/NotFound";

import Login              from "./pages/auth/Login";
import Register           from "./pages/auth/Register";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import MyApplications     from "./pages/candidate/MyApplications";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import ManageJobs         from "./pages/recruiter/ManageJobs";
import JobApplications    from "./pages/recruiter/JobApplications";

import AdminDashboard     from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Public */}
              <Route path="/"       element={<Home />}   />
              <Route path="/jobs"   element={<JobList />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              {/* Auth */}
              <Route path="/login"    element={<Login />}    />
              <Route path="/register" element={<Register />} />

              {/* Candidate */}
              <Route
                path="/candidate/dashboard"
                element={<ProtectedRoute roles={["CANDIDATE"]}><CandidateDashboard /></ProtectedRoute>}
              />
              <Route
                path="/candidate/applications"
                element={<ProtectedRoute roles={["CANDIDATE"]}><MyApplications /></ProtectedRoute>}
              />

              {/* Recruiter */}
              <Route
                path="/recruiter/dashboard"
                element={<ProtectedRoute roles={["RECRUITER"]}><RecruiterDashboard /></ProtectedRoute>}
              />
              <Route
                path="/recruiter/jobs"
                element={<ProtectedRoute roles={["RECRUITER"]}><ManageJobs /></ProtectedRoute>}
              />
              <Route
                path="/recruiter/jobs/:jobId/applications"
                element={<ProtectedRoute roles={["RECRUITER"]}><JobApplications /></ProtectedRoute>}
              />

              {/* Admin */}
              <Route
                path="/admin"
                element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>}
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
