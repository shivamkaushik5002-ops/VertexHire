import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jobApi } from "../../api/endpoints";
import { useToast } from "../../components/Toast";
import { FullPageLoader } from "../../components/Loaders";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { Badge } from "../../components/ui";
import Button from "../../components/Button";
import JobFormModal from "../../components/JobFormModal";
import {
  LayoutDashboard, Briefcase, Plus, Pencil,
  Trash2, Users, MapPin, IndianRupee, FileSearch,
} from "lucide-react";

const navItems = [
  { to: "/recruiter/dashboard", label: "Overview",    icon: LayoutDashboard, end: true },
  { to: "/recruiter/jobs",      label: "My Listings", icon: Briefcase },
];

export default function ManageJobs() {
  const { push }     = useToast();
  const [jobs,       setJobs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(null);

  const load = () => {
    setLoading(true);
    jobApi.myJobs()
      .then(({ data }) => setJobs(data || []))
      .catch(() => push("Could not load your listings.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit   = (job) => { setEditing(job); setModalOpen(true); };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editing) { await jobApi.update(editing.id, form); push("Listing updated.", "success"); }
      else         { await jobApi.create(form);              push("Listing published.", "success"); }
      setModalOpen(false);
      load();
    } catch {
      push("Could not save listing.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing permanently?")) return;
    setDeleting(id);
    try {
      await jobApi.remove(id);
      push("Listing removed.", "success");
      setJobs((j) => j.filter((x) => x.id !== id));
    } catch {
      push("Could not delete listing.", "error");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <DashboardLayout navItems={navItems}>
      <PageTransition>
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-1">Recruiter</p>
            <h1 className="font-display text-3xl text-ink">My Listings</h1>
            <p className="text-sm text-muted mt-1">
              {jobs.length} active role{jobs.length !== 1 ? "s" : ""}.
            </p>
          </div>
          <Button icon={Plus} onClick={openCreate}>New listing</Button>
        </div>

        {/* Empty state */}
        {jobs.length === 0 ? (
          <div className="card-surface py-24 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-bg mb-4">
              <FileSearch size={24} strokeWidth={1.5} className="text-navy" />
            </div>
            <p className="font-display text-lg text-ink mb-1">No listings yet</p>
            <p className="text-sm text-muted mb-6">Post your first role and start receiving applications.</p>
            <Button icon={Plus} onClick={openCreate}>Post a listing</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.05 }}
                  className="card-surface p-5 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Job info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-bg text-navy text-sm font-bold">
                        {(job.company ?? "?")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-[15px] text-ink truncate">{job.title}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-muted">{job.company}</span>
                          {job.location && (
                            <Badge tone="muted">
                              <MapPin size={9} strokeWidth={1.75} />
                              {job.location}
                            </Badge>
                          )}
                          {job.salary != null && (
                            <Badge tone="gold">
                              <IndianRupee size={9} strokeWidth={1.75} />
                              {Number(job.salary).toLocaleString("en-IN")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pl-[60px] sm:pl-0 shrink-0">
                      <Link to={`/recruiter/jobs/${job.id}/applications`}>
                        <Button size="sm" variant="teal" icon={Users}>Applicants</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Pencil}
                        onClick={() => openEdit(job)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        icon={Trash2}
                        loading={deleting === job.id}
                        onClick={() => handleDelete(job.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <JobFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initial={editing}
          saving={saving}
        />
      </PageTransition>
    </DashboardLayout>
  );
}
