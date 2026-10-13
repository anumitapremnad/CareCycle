import { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Package,
  FileCheck,
  Send,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import TrustBadge from './TrustBadge';

export default function AdminReviewView({
  hubs,
  verifications,
  flaggedListings,
  listings,
  requests,
  onReviewVerification,
  onUpdateHubTrust,
  onResolveFlag,
  onRemoveListing,
}) {
  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications' | 'hubs' | 'flagged' | 'overview'
  const [reviewModal, setReviewModal] = useState(null); // { item, action: 'approve' | 'reject' }
  const [reviewerNotes, setReviewerNotes] = useState('');

  const pendingVerifications = verifications.filter((v) => v.status === 'pending');
  const openFlags = flaggedListings.filter((f) => f.status === 'open');

  const handleStartReview = (item, action) => {
    setReviewModal({ item, action });
    setReviewerNotes(
      action === 'approve'
        ? 'Verified organizational drop-off facility and adherence to sealed/durable prototype policies.'
        : 'Incomplete facility storage documentation or ineligible item classification.'
    );
  };

  const handleConfirmReview = () => {
    if (!reviewModal) return;
    onReviewVerification(reviewModal.item.id, reviewModal.action, reviewerNotes);
    setReviewModal(null);
    setReviewerNotes('');
  };

  return (
    <section className="admin-review-view" aria-labelledby="admin-title">
      <div className="view-header">
        <div className="view-header__title-group">
          <div className="view-badge view-badge--admin">
            <ShieldAlert size={14} />
            <span>Platform Administration &amp; Oversight</span>
          </div>
          <h2 id="admin-title" className="view-title">
            Administrator Review Center
          </h2>
          <p className="view-subtitle">
            Evaluate organization verification petitions, inspect reported safety flags, and regulate network trust badges.
          </p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="admin-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'verifications'}
          className={`admin-tab ${activeTab === 'verifications' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('verifications')}
        >
          <FileCheck size={16} />
          <span>Verification Queue</span>
          {pendingVerifications.length > 0 && (
            <span className="tab-counter-badge">{pendingVerifications.length}</span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'hubs'}
          className={`admin-tab ${activeTab === 'hubs' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('hubs')}
        >
          <Building2 size={16} />
          <span>Hub Trust Badges ({hubs.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'flagged'}
          className={`admin-tab ${activeTab === 'flagged' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('flagged')}
        >
          <AlertTriangle size={16} />
          <span>Safety Reports</span>
          {openFlags.length > 0 && (
            <span className="tab-counter-badge tab-counter-badge--warning">
              {openFlags.length}
            </span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`admin-tab ${activeTab === 'overview' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Package size={16} />
          <span>System Vitality</span>
        </button>
      </div>

      {/* Tab 1: Organization Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="admin-tab-content">
          <div className="tab-intro-bar">
            <h3>Organization Verification Requests</h3>
            <span className="count-label">
              {pendingVerifications.length} pending review &bull; {verifications.length} total recorded
            </span>
          </div>

          {verifications.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={36} />
              <h4>No verification requests in queue</h4>
              <p>Organizations that submit verification requests will appear here for review.</p>
            </div>
          ) : (
            <div className="verifications-admin-list">
              {verifications.map((item) => (
                <div key={item.id} className="admin-review-card">
                  <div className="admin-review-card__header">
                    <div>
                      <span className="request-id-pill">{item.id}</span>
                      <h4 className="admin-review-card__org-name">{item.orgName}</h4>
                      <span className="admin-meta-text">
                        Type: {item.orgType} &bull; Submitted: {new Date(item.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span
                      className={`status-pill ${
                        item.status === 'approved'
                          ? 'badge--forest'
                          : item.status === 'rejected'
                          ? 'badge--neutral'
                          : 'badge--peach'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="admin-review-card__body">
                    <p><strong>Representative:</strong> {item.contactPerson} ({item.contactEmail} | {item.contactPhone})</p>
                    <p><strong>Application Statement:</strong> {item.explanation}</p>
                    {item.reviewerNotes && (
                      <div className="reviewer-notes-box">
                        <strong>Previous Decision Notes:</strong> {item.reviewerNotes}
                      </div>
                    )}
                  </div>

                  {item.status === 'pending' && (
                    <div className="admin-review-card__actions">
                      <button
                        type="button"
                        className="btn btn--outline btn--danger btn--compact"
                        onClick={() => handleStartReview(item, 'reject')}
                      >
                        <XCircle size={14} />
                        <span>Reject Application</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary btn--compact"
                        onClick={() => handleStartReview(item, 'approve')}
                      >
                        <CheckCircle2 size={14} />
                        <span>Approve &amp; Assign Trust Badge</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Hub Trust Overrides */}
      {activeTab === 'hubs' && (
        <div className="admin-tab-content">
          <div className="tab-intro-bar">
            <h3>Direct Hub Trust Management</h3>
            <span className="count-label">
              Explicitly set demonstration verification status for any hub
            </span>
          </div>

          <div className="hubs-trust-table-wrapper card">
            <table className="hubs-trust-table">
              <thead>
                <tr>
                  <th>Hub / Organization</th>
                  <th>Classification</th>
                  <th>Current Trust Badge</th>
                  <th>Assign Status</th>
                </tr>
              </thead>
              <tbody>
                {hubs.map((hub) => (
                  <tr key={hub.id}>
                    <td>
                      <strong>{hub.name}</strong>
                      <span className="table-subtext">{hub.location}</span>
                    </td>
                    <td>{hub.type}</td>
                    <td>
                      <TrustBadge status={hub.trustStatus} />
                    </td>
                    <td>
                      <select
                        className="form-select form-select--compact"
                        value={hub.trustStatus}
                        onChange={(e) => onUpdateHubTrust(hub.id, e.target.value)}
                        aria-label={`Update trust status for ${hub.name}`}
                      >
                        <option value="verified_admin">Verified by administrator (demo)</option>
                        <option value="verification_pending">Verification pending</option>
                        <option value="unverified">Organization details not verified</option>
                        <option value="demo_profile">Demo profile</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Safety Reports & Flagged Listings */}
      {activeTab === 'flagged' && (
        <div className="admin-tab-content">
          <div className="tab-intro-bar">
            <h3>Safety Reports &amp; Flagged Supplies</h3>
            <span className="count-label">
              Community submissions regarding medicine packaging or guidelines
            </span>
          </div>

          {flaggedListings.length === 0 ? (
            <div className="empty-state">
              <ShieldCheck size={36} />
              <h4>No flagged items reported</h4>
              <p>All items on the community shelf are currently clear of reports.</p>
            </div>
          ) : (
            <div className="flagged-list">
              {flaggedListings.map((flag) => (
                <div key={flag.id} className="flagged-card card">
                  <div className="flagged-card__header">
                    <div>
                      <span className="request-id-pill">{flag.id}</span>
                      <h4 className="flagged-card__title">{flag.listingName}</h4>
                      <span className="admin-meta-text">
                        Reported by {flag.reportedBy} &bull; {new Date(flag.reportedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className={`status-pill ${
                        flag.status === 'open' ? 'badge--peach' : 'badge--mint'
                      }`}
                    >
                      {flag.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flagged-card__body">
                    <p className="flag-reason-text">
                      <AlertTriangle size={15} className="inline-icon text-peach" />
                      <strong>Report Reason:</strong> {flag.reason}
                    </p>
                    {flag.resolutionNotes && (
                      <p className="flag-resolution-text">
                        <strong>Resolution:</strong> {flag.resolutionNotes}
                      </p>
                    )}
                  </div>

                  {flag.status === 'open' && (
                    <div className="flagged-card__actions">
                      <button
                        type="button"
                        className="btn btn--outline btn--compact"
                        onClick={() =>
                          onResolveFlag(
                            flag.id,
                            'resolved',
                            'Inspected item with hub coordinator. Verified sealed sterile condition.'
                          )
                        }
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Safe / Resolve</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline btn--danger btn--compact"
                        onClick={() => onRemoveListing(flag.listingId, flag.id)}
                      >
                        <Trash2 size={14} />
                        <span>Remove Listing from Shelf</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: System Vitality Overview */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content">
          <div className="tab-intro-bar">
            <h3>Platform-Wide Aggregations</h3>
            <span className="count-label">Stored demonstration state metrics</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card__body">
                <span className="stat-card__value">{listings.length}</span>
                <span className="stat-card__label">Total Listings</span>
                <span className="stat-card__subtext">
                  {listings.filter((l) => l.status === 'Available').length} available
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__body">
                <span className="stat-card__value">{requests.length}</span>
                <span className="stat-card__label">Total Requests</span>
                <span className="stat-card__subtext">
                  {requests.filter((r) => r.status === 'Completed').length} completed
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__body">
                <span className="stat-card__value">{hubs.length}</span>
                <span className="stat-card__label">Registered Hubs</span>
                <span className="stat-card__subtext">
                  {hubs.filter((h) => h.trustStatus === 'verified_admin').length} admin-verified
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__body">
                <span className="stat-card__value">{flaggedListings.length}</span>
                <span className="stat-card__label">Total Reports</span>
                <span className="stat-card__subtext">{openFlags.length} active investigations</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Dialog */}
      {reviewModal && (
        <div className="modal-backdrop" onClick={() => setReviewModal(null)} role="presentation">
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-header__icon-box">
                {reviewModal.action === 'approve' ? (
                  <CheckCircle2 size={24} className="text-mint" />
                ) : (
                  <XCircle size={24} className="text-danger" />
                )}
              </div>
              <div className="modal-header__text">
                <h3 className="modal-title">
                  {reviewModal.action === 'approve'
                    ? `Approve Verification for ${reviewModal.item.orgName}`
                    : `Reject Verification for ${reviewModal.item.orgName}`}
                </h3>
                <p className="modal-subtitle">
                  {reviewModal.action === 'approve'
                    ? 'This will assign the "Verified by an administrator (demo only)" trust badge to this hub.'
                    : 'This will set the hub status to "Organization details not verified".'}
                </p>
              </div>
            </div>

            <div className="modal-body-content">
              <div className="form-field">
                <label htmlFor="reviewer-notes" className="form-label">
                  Reviewer Rationale &amp; Audit Notes
                </label>
                <textarea
                  id="reviewer-notes"
                  rows={3}
                  className="form-textarea"
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setReviewModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn ${
                  reviewModal.action === 'approve' ? 'btn--primary' : 'btn--primary btn--danger'
                }`}
                onClick={handleConfirmReview}
              >
                <Send size={15} />
                <span>Confirm Decision</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
