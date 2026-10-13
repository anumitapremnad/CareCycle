import { useState } from 'react';
import {
  Clock,
  Package,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  Layers,
} from 'lucide-react';

export default function MyRequestsView({
  requests,
  onCancelRequest,
  onNavigateToShelf,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Filter for user's requests (in demo mode, Elena V. (You))
  const myRequests = requests.filter(
    (r) => r.requestedBy.includes('You') || r.requestedBy === 'Elena Vance' || r.requestedBy === 'Elena V. (You)'
  );

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleStartCancel = (id) => {
    setCancellingId(id);
    setCancelReason('');
  };

  const handleConfirmCancel = (id) => {
    onCancelRequest(id, cancelReason || 'Cancelled by requester');
    setCancellingId(null);
    setCancelReason('');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Ready for collection':
        return 'badge--mint';
      case 'Completed':
        return 'badge--forest';
      case 'Requested':
        return 'badge--peach';
      case 'Declined':
      case 'Cancelled':
        return 'badge--neutral';
      default:
        return 'badge--neutral';
    }
  };

  const isEligibleForCancel = (status) => {
    return status === 'Requested' || status === 'Accepted';
  };

  return (
    <section className="my-requests-view" aria-labelledby="my-requests-title">
      <div className="view-header">
        <div className="view-header__title-group">
          <div className="view-badge">
            <Clock size={14} />
            <span>Community Member Dashboard</span>
          </div>
          <h2 id="my-requests-title" className="view-title">
            My Supply Requests
          </h2>
          <p className="view-subtitle">
            Track the status of your requested health supplies, review collection instructions, and view full activity timelines.
          </p>
        </div>

        <button
          type="button"
          className="btn btn--outline"
          onClick={onNavigateToShelf}
        >
          <Layers size={16} />
          <span>Browse More Supplies</span>
        </button>
      </div>

      {myRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon-wrap">
            <Package size={36} />
          </div>
          <h3 className="empty-state__title">No active requests found</h3>
          <p className="empty-state__desc">
            You haven&apos;t reserved any supplies yet. Browse the community shelf to find available first aid, mobility aids, or unopened OTC relief.
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onNavigateToShelf}
          >
            <span>Explore Community Shelf</span>
          </button>
        </div>
      ) : (
        <div className="requests-list">
          {myRequests.map((req) => {
            const isExpanded = expandedId === req.id;
            const canCancel = isEligibleForCancel(req.status);
            const isCancelling = cancellingId === req.id;

            return (
              <article key={req.id} className="request-card">
                <div className="request-card__header">
                  <div className="request-card__id-group">
                    <span className="request-id-pill">{req.id}</span>
                    <span className="request-created-time">
                      Requested on {new Date(req.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className={`status-pill ${getStatusBadgeClass(req.status)}`}>
                    {req.status}
                  </span>
                </div>

                <div className="request-card__body">
                  <h3 className="request-card__title">{req.listingTitle}</h3>
                  <div className="request-meta-grid">
                    <div className="request-meta-item">
                      <Package size={14} className="request-meta-icon" />
                      <span><strong>Category:</strong> {req.category}</span>
                    </div>
                    <div className="request-meta-item">
                      <MapPin size={14} className="request-meta-icon" />
                      <span><strong>Hub:</strong> {req.hubName}</span>
                    </div>
                    <div className="request-meta-item">
                      <MapPin size={14} className="request-meta-icon" />
                      <span><strong>Pickup Location:</strong> {req.pickupLocation}</span>
                    </div>
                    {req.contactNote && (
                      <div className="request-meta-item request-meta-item--full">
                        <span><strong>Your Note:</strong> {req.contactNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cancellation prompt if open */}
                {isCancelling && (
                  <div className="cancel-prompt-box">
                    <div className="cancel-prompt-header">
                      <AlertTriangle size={16} className="cancel-warning-icon" />
                      <strong>Cancel this reservation?</strong>
                    </div>
                    <p className="cancel-prompt-text">
                      This supply will immediately be returned to the shelf as Available for other neighbors.
                    </p>
                    <input
                      type="text"
                      className="form-input cancel-reason-input"
                      placeholder="Optional reason (e.g. No longer needed, obtained alternate aid)"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <div className="cancel-prompt-actions">
                      <button
                        type="button"
                        className="btn btn--outline btn--compact"
                        onClick={() => setCancellingId(null)}
                      >
                        Keep Request
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary btn--compact btn--danger"
                        onClick={() => handleConfirmCancel(req.id)}
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  </div>
                )}

                <div className="request-card__footer">
                  <button
                    type="button"
                    className="btn-toggle-timeline"
                    onClick={() => toggleExpand(req.id)}
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Hide Activity Timeline' : 'View Activity Timeline'}</span>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {canCancel && !isCancelling && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--compact btn--cancel-req"
                      onClick={() => handleStartCancel(req.id)}
                    >
                      <RotateCcw size={14} />
                      <span>Cancel Request</span>
                    </button>
                  )}
                </div>

                {/* Timeline Drawer */}
                {isExpanded && (
                  <div className="request-timeline-panel">
                    <h4 className="timeline-heading">Request Status History</h4>
                    <ol className="timeline-list">
                      {req.history &&
                        req.history.map((event, idx) => (
                          <li key={idx} className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                              <div className="timeline-top">
                                <span className="timeline-status-tag">{event.status}</span>
                                <time className="timeline-time">
                                  {new Date(event.timestamp).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </time>
                              </div>
                              <p className="timeline-actor">
                                <strong>{event.actor}</strong> ({event.actorRole})
                              </p>
                              {event.note && <p className="timeline-note">{event.note}</p>}
                            </div>
                          </li>
                        ))}
                    </ol>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
