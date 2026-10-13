import { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  PackageCheck,
  XCircle,
  MapPin,
  ChevronDown,
  ChevronUp,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function HubRequestManager({
  coordinatorHub,
  requests,
  onUpdateRequestStatus,
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [actionPrompt, setActionPrompt] = useState(null); // { reqId, targetStatus, actionLabel }
  const [noteInput, setNoteInput] = useState('');

  const hubRequests = requests.filter((r) => r.hubId === coordinatorHub.id);

  const filteredRequests = hubRequests.filter((r) => {
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  const getAvailableTransitions = (status) => {
    switch (status) {
      case 'Requested':
        return [
          { status: 'Accepted', label: 'Accept Request', variant: 'primary' },
          { status: 'Declined', label: 'Decline Request', variant: 'danger' },
        ];
      case 'Accepted':
        return [
          { status: 'Ready for collection', label: 'Mark Ready for Collection', variant: 'primary' },
          { status: 'Declined', label: 'Decline Request', variant: 'danger' },
        ];
      case 'Ready for collection':
        return [
          { status: 'Completed', label: 'Mark as Completed (Handed Over)', variant: 'primary' },
        ];
      default:
        // Terminal states
        return [];
    }
  };

  const handleStartAction = (reqId, targetStatus, actionLabel) => {
    setActionPrompt({ reqId, targetStatus, actionLabel });
    setNoteInput('');
  };

  const handleConfirmAction = () => {
    if (!actionPrompt) return;
    onUpdateRequestStatus(
      actionPrompt.reqId,
      actionPrompt.targetStatus,
      coordinatorHub.coordinatorName || 'Hub Coordinator',
      'Organization Coordinator',
      noteInput || `Status updated to ${actionPrompt.targetStatus}`
    );
    setActionPrompt(null);
    setNoteInput('');
  };

  const getStatusBadge = (status) => {
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

  return (
    <section className="hub-request-manager" aria-labelledby="hub-req-manager-title">
      <div className="view-header">
        <div className="view-header__title-group">
          <div className="view-badge">
            <Building2 size={14} />
            <span>Coordinator Intake Management</span>
          </div>
          <h2 id="hub-req-manager-title" className="view-title">
            Requests for {coordinatorHub.name}
          </h2>
          <p className="view-subtitle">
            Review incoming supply reservations, confirm pickup locker placements, and advance fulfillment statuses safely.
          </p>
        </div>

        <div className="hub-filter-wrap">
          <label htmlFor="req-filter-select" className="filter-label">
            Filter Status:
          </label>
          <select
            id="req-filter-select"
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Requests ({hubRequests.length})</option>
            <option value="Requested">Requested (Pending Acceptance)</option>
            <option value="Accepted">Accepted</option>
            <option value="Ready for collection">Ready for collection</option>
            <option value="Completed">Completed</option>
            <option value="Declined">Declined</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon-wrap">
            <PackageCheck size={36} />
          </div>
          <h3 className="empty-state__title">No requests match this filter</h3>
          <p className="empty-state__desc">
            There are currently no supply requests for this status at {coordinatorHub.name}.
          </p>
          {filterStatus !== 'All' && (
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => setFilterStatus('All')}
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="requests-list">
          {filteredRequests.map((req) => {
            const transitions = getAvailableTransitions(req.status);
            const isExpanded = expandedId === req.id;
            const isPromptActive = actionPrompt?.reqId === req.id;

            return (
              <article key={req.id} className="request-card">
                <div className="request-card__header">
                  <div className="request-card__id-group">
                    <span className="request-id-pill">{req.id}</span>
                    <span className="request-created-time">
                      From {req.requestedBy} &bull; {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`status-pill ${getStatusBadge(req.status)}`}>
                    {req.status}
                  </span>
                </div>

                <div className="request-card__body">
                  <h3 className="request-card__title">{req.listingTitle}</h3>
                  <div className="request-meta-grid">
                    <div className="request-meta-item">
                      <span><strong>Item Category:</strong> {req.category}</span>
                    </div>
                    <div className="request-meta-item">
                      <span><strong>Requested Qty:</strong> {req.quantity}</span>
                    </div>
                    <div className="request-meta-item">
                      <MapPin size={14} className="request-meta-icon" />
                      <span><strong>Pickup Point:</strong> {req.pickupLocation}</span>
                    </div>
                    {req.contactNote && (
                      <div className="request-meta-item request-meta-item--full">
                        <span><strong>Requester Notes:</strong> {req.contactNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transition Action Buttons */}
                <div className="coordinator-action-bar">
                  <div className="action-buttons-group">
                    {transitions.map((t) => (
                      <button
                        key={t.status}
                        type="button"
                        className={`btn btn--compact ${
                          t.variant === 'danger' ? 'btn--outline btn--danger' : 'btn--primary'
                        }`}
                        onClick={() => handleStartAction(req.id, t.status, t.label)}
                        disabled={isPromptActive}
                      >
                        {t.status === 'Accepted' && <CheckCircle2 size={14} />}
                        {t.status === 'Ready for collection' && <PackageCheck size={14} />}
                        {t.status === 'Completed' && <CheckCircle2 size={14} />}
                        {t.status === 'Declined' && <XCircle size={14} />}
                        <span>{t.label}</span>
                      </button>
                    ))}
                    {transitions.length === 0 && (
                      <span className="terminal-state-text">
                        Terminal Status: No further transitions permitted.
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn-toggle-timeline"
                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Hide Timeline' : 'View Timeline'}</span>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>

                {/* Action Confirmation Modal/Prompt Box */}
                {isPromptActive && (
                  <div className="action-prompt-box">
                    <div className="action-prompt-header">
                      <AlertCircle size={16} />
                      <strong>Confirm Transition: {actionPrompt.actionLabel}</strong>
                    </div>
                    <p className="action-prompt-subtext">
                      Add coordinator instructions, locker codes, or reason notes for the recipient timeline:
                    </p>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      placeholder="e.g. Placed in Locker 12 with combination code 4192, or Supply verified in cabinet..."
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                    />
                    <div className="action-prompt-buttons">
                      <button
                        type="button"
                        className="btn btn--outline btn--compact"
                        onClick={() => setActionPrompt(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary btn--compact"
                        onClick={handleConfirmAction}
                      >
                        <Send size={14} />
                        <span>Confirm & Update Status</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Activity Timeline */}
                {isExpanded && (
                  <div className="request-timeline-panel">
                    <h4 className="timeline-heading">Complete Activity Log</h4>
                    <ol className="timeline-list">
                      {req.history &&
                        req.history.map((h, i) => (
                          <li key={i} className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                              <div className="timeline-top">
                                <span className="timeline-status-tag">{h.status}</span>
                                <time className="timeline-time">
                                  {new Date(h.timestamp).toLocaleString()}
                                </time>
                              </div>
                              <p className="timeline-actor">
                                <strong>{h.actor}</strong> ({h.actorRole})
                              </p>
                              {h.note && <p className="timeline-note">{h.note}</p>}
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
