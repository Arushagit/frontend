/**
 * AdminDashboard — Full-featured enquiry management dashboard.
 *
 * Features:
 * - Stats cards (Total / New / Read / Replied)
 * - Searchable, filterable enquiry table
 * - Mark as read / replied / delete actions
 * - Expandable message preview
 * - Auto-logout on token expiry
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDashboardStats,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  clearTokens,
} from '../services/api';

// ─── Types ──────────────────────────────────────────────────────────────────────
interface Enquiry {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  status_display: string;
  created_at: string;
  ip_address: string | null;
}

interface Stats {
  total: number;
  new: number;
  read: number;
  replied: number;
  recent: Enquiry[];
}

interface EnquiriesResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Enquiry[];
}

// ─── Status Config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  new: { color: '#6366f1', bg: 'rgba(99,102,241,0.15)', label: 'New', emoji: '🔵' },
  read: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Read', emoji: '🟡' },
  replied: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Replied', emoji: '🟢' },
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState<Stats | null>(null);
  const [enquiries, setEnquiries] = useState<EnquiriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const admin = (() => {
    try { return JSON.parse(localStorage.getItem('crm_admin') || '{}'); } catch { return {}; }
  })();

  // ─── Data Fetching ────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await getDashboardStats();
      setStats(data);
    } catch {
      showToast('Failed to load stats.', 'error');
    }
  }, []);

  const fetchEnquiries = useCallback(async () => {
    setTableLoading(true);
    try {
      const { data } = await getEnquiries({
        status: statusFilter || undefined,
        search: search || undefined,
        page,
        page_size: 10,
      });
      setEnquiries(data);
    } catch {
      showToast('Failed to load enquiries.', 'error');
    } finally {
      setTableLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchStats().finally(() => setLoading(false));
  }, [fetchStats]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // ─── Actions ──────────────────────────────────────────────────────────────────
  const handleStatusChange = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      await updateEnquiryStatus(id, newStatus);
      showToast(`Marked as "${newStatus}"`, 'success');
      await Promise.all([fetchStats(), fetchEnquiries()]);
    } catch {
      showToast('Failed to update status.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(id);
    try {
      await deleteEnquiry(id);
      setDeleteConfirm(null);
      showToast('Enquiry deleted.', 'success');
      await Promise.all([fetchStats(), fetchEnquiries()]);
    } catch {
      showToast('Failed to delete enquiry.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    clearTokens();
    navigate('/admin/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Loading Screen ───────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#6366f1' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b', fontFamily: 'Inter, sans-serif' }}>Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Inter', 'Segoe UI', sans-serif", color: '#f1f5f9' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .stat-card { transition:transform 0.2s,box-shadow 0.2s; cursor:default; }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 20px 40px rgba(0,0,0,0.3)!important; }
        .action-btn { border:none; cursor:pointer; border-radius:8px; padding:6px 12px; font-size:12px; font-weight:500; transition:all 0.2s; font-family:inherit; }
        .action-btn:hover { transform:translateY(-1px); }
        .action-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
        .filter-btn { border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:#94a3b8; border-radius:8px; padding:7px 14px; font-size:13px; cursor:pointer; transition:all 0.2s; font-family:inherit; }
        .filter-btn.active { background:rgba(99,102,241,0.2); border-color:#6366f1; color:#818cf8; }
        .filter-btn:hover { border-color:rgba(99,102,241,0.5); color:#f1f5f9; }
        .table-row { transition:background 0.15s; }
        .table-row:hover { background:rgba(255,255,255,0.03); }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.3); border-radius:3px; }
      `}</style>

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          color: toast.type === 'success' ? '#6ee7b7' : '#fca5a5',
          borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 500,
          backdropFilter: 'blur(10px)', animation: 'slideDown 0.3s ease-out',
          display: 'flex', alignItems: 'center', gap: 8, maxWidth: 320,
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s',
        }} onClick={() => setDeleteConfirm(null)}>
          <div style={{
            background: '#1e293b', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 20, padding: '36px', maxWidth: 380, width: '90%',
            animation: 'slideDown 0.3s ease-out',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ margin: '0 0 8px', textAlign: 'center', fontSize: 18, fontWeight: 700 }}>Delete Enquiry?</h3>
            <p style={{ margin: '0 0 28px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="action-btn" onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '11px' }}>
                Cancel
              </button>
              <button className="action-btn" onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading === deleteConfirm}
                style={{ flex: 1, background: 'rgba(239,68,68,0.2)', color: '#fca5a5', padding: '11px', border: '1px solid rgba(239,68,68,0.3)' }}>
                {actionLoading === deleteConfirm ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Nav ──────────────────────────────────────────────────────────── */}
      <nav style={{
        background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            📊
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px' }}>CRM Dashboard</span>
            <span style={{ color: '#475569', fontSize: 12, marginLeft: 10 }}>ExpertiseCo</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            ← Site
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
              {admin.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <span style={{ fontSize: 13, color: '#cbd5e1' }}>{admin.username || 'Admin'}</span>
          </div>
          <button id="admin-logout-btn" onClick={handleLogout}
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', borderRadius: 10, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}>
            Sign Out
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', background: 'linear-gradient(135deg,#f1f5f9,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Enquiry Management
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 15 }}>
            Manage and respond to contact form submissions
          </p>
        </div>

        {/* ── Stats Cards ───────────────────────────────────────────────────── */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { label: 'Total Enquiries', value: stats.total, icon: '📬', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
              { label: 'New', value: stats.new, icon: '🔵', color: '#818cf8', bg: 'rgba(99,102,241,0.08)' },
              { label: 'Read', value: stats.read, icon: '🟡', color: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
              { label: 'Replied', value: stats.replied, icon: '🟢', color: '#34d399', bg: 'rgba(16,185,129,0.08)' },
            ].map((card) => (
              <div key={card.label} className="stat-card" style={{
                background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20, padding: '24px 28px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{card.label}</p>
                    <p style={{ margin: 0, fontSize: 40, fontWeight: 800, color: card.color, letterSpacing: '-1px', lineHeight: 1 }}>{card.value}</p>
                  </div>
                  <div style={{ width: 48, height: 48, background: card.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Filters + Search ─────────────────────────────────────────────── */}
        <div style={{
          background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, padding: '20px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { value: '', label: 'All' },
              { value: 'new', label: '🔵 New' },
              { value: 'read', label: '🟡 Read' },
              { value: 'replied', label: '🟢 Replied' },
            ].map(f => (
              <button key={f.value} className={`filter-btn ${statusFilter === f.value ? 'active' : ''}`}
                onClick={() => { setStatusFilter(f.value); setPage(1); }}>
                {f.label}
                {f.value && stats && <span style={{ marginLeft: 6, opacity: 0.6 }}>({stats[f.value as keyof Stats] as number})</span>}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input
              id="admin-search-input"
              type="text"
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '8px 14px', color: '#f1f5f9', fontSize: 14,
                outline: 'none', fontFamily: 'inherit', width: 220,
              }}
            />
            <button type="submit" id="admin-search-btn" className="action-btn" style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '8px 16px', border: '1px solid rgba(99,102,241,0.3)' }}>
              Search
            </button>
            {search && (
              <button type="button" className="action-btn" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
                style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', padding: '8px 12px' }}>
                ✕
              </button>
            )}
          </form>
        </div>

        {/* ── Enquiries Table ───────────────────────────────────────────────── */}
        <div style={{
          background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        }}>
          {tableLoading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: '#64748b', fontSize: 14 }}>Loading…</p>
            </div>
          ) : enquiries?.results.length === 0 ? (
            <div style={{ padding: '80px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p style={{ color: '#64748b', fontSize: 15 }}>No enquiries found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Name', 'Email', 'Message', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '16px 20px', textAlign: 'left', color: '#475569', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enquiries?.results.map((enq) => {
                    const sc = STATUS_CONFIG[enq.status];
                    const isExpanded = expandedId === enq.id;
                    return (
                      <tr key={enq.id} className="table-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
                          {enq.name}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          <a href={`mailto:${enq.email}`} style={{ color: '#818cf8', textDecoration: 'none' }}>
                            {enq.email}
                          </a>
                        </td>
                        <td style={{ padding: '16px 20px', maxWidth: 280 }}>
                          <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', cursor: 'pointer', lineHeight: 1.5 }}
                            onClick={() => setExpandedId(isExpanded ? null : enq.id)}>
                            {isExpanded ? enq.message : (enq.message.length > 80 ? enq.message.slice(0, 80) + '…' : enq.message)}
                            {enq.message.length > 80 && (
                              <span style={{ color: '#6366f1', marginLeft: 4, fontSize: 12 }}>
                                {isExpanded ? ' ▲ less' : ' ▼ more'}
                              </span>
                            )}
                          </p>
                        </td>
                        <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            background: sc.bg, color: sc.color, padding: '4px 12px',
                            borderRadius: 20, fontSize: 12, fontWeight: 600,
                          }}>
                            {sc.emoji} {sc.label}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 12, color: '#475569', whiteSpace: 'nowrap' }}>
                          {enq.created_at.split(' ')[0]}
                        </td>
                        <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {enq.status !== 'replied' && (
                              <button id={`mark-replied-${enq.id}`}
                                className="action-btn"
                                onClick={() => handleStatusChange(enq.id, 'replied')}
                                disabled={actionLoading === enq.id}
                                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                                {actionLoading === enq.id ? '…' : '✓ Reply'}
                              </button>
                            )}
                            {enq.status === 'new' && (
                              <button id={`mark-read-${enq.id}`}
                                className="action-btn"
                                onClick={() => handleStatusChange(enq.id, 'read')}
                                disabled={actionLoading === enq.id}
                                style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
                                👁 Read
                              </button>
                            )}
                            <button id={`delete-${enq.id}`}
                              className="action-btn"
                              onClick={() => setDeleteConfirm(enq.id)}
                              disabled={actionLoading === enq.id}
                              style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {enquiries && enquiries.total_pages > 1 && (
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>
                Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, enquiries.count)} of {enquiries.count}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="filter-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                  ← Prev
                </button>
                {Array.from({ length: enquiries.total_pages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === enquiries.total_pages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <>
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span key={`gap-${p}`} style={{ color: '#475569', padding: '0 4px' }}>…</span>}
                      <button key={p} className={`filter-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                        {p}
                      </button>
                    </>
                  ))}
                <button className="filter-btn" onClick={() => setPage(p => p + 1)} disabled={page === enquiries.total_pages}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
