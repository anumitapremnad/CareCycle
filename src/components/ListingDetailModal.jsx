import { useState } from 'react';
import {
  X,
  Package,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  HeartHandshake,
  AlertTriangle,
  RotateCcw,
  Flag,
  ShieldCheck,
} from 'lucide-react';
import TrustBadge from './TrustBadge';

export default function ListingDetailModal({
  listing,
  hub,
  onClose,
  onRequest,
  onReturnToShelf,
  onFlagListing,
}) {
  const [requestNote, setRequestNote] = useState('');
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  if (!listing) return null;

  const isAvailable = listing.status === 'Available';

  // Check if expiring soon (< 45 days)
  const isExpiringSoon = (() => {
    if (listing.isDurable || !listing.expiry || !/^\d{4}-\d{2}-\d{2}$/.test(listing.expiry)) {
      return false;
    }
    const expiryDate = new Date(listing.expiry);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 45;
  })();

  const handleRequestSubmit = () => {
    onRequest(listing.id, requestNote.trim() || 'Community member reservation');
    onClose();
  };

  const handleFlagSubmit = (e) => {
    e.preventDefault();
    if (!flagReason.trim()) return;
    onFlagListing(listing.id, listing.name, flagReason.trim());
    setShowFlagForm(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container modal-container--wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-detail-title"
      >
        <div className="modal-header">
          <div className="modal-header__icon-box">
            <Package size={24} />
          </div>
          <div className="modal-header__text">
            <div className="modal-tag-row">
              <span className="listing-card__category">{listing.category}</span>
              <span
                className={`status-pill ${
                  isAvailable ? 'badge--mint' : 'badge--peach'
                }`}
              >
                {listing.status}
              </span>
            </div>
            <h3 id="listing-detail-title" className="modal-title">
              {listing.name}
            </h3>
            <p className="modal-subtitle">
              Listed by {listing.donorName || 'Community Member'} &bull; Added on {listing.dateAdded}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-content">
          {/* Expiring soon alert if applicable */}
          {isExpiringSoon && (
            <div className="expiring-warning-pill">
              <AlertTriangle size={15} />
              <span>
                <strong>Approaching Expiration:</strong> This item expires within 45 days ({listing.expiry}). Coordinators prioritize prompt circulation.
              </span>
            </div>
          )}

          <div className="detail-meta-grid">
            <div className="detail-meta-box">
              <span className="detail-meta-label"><Layers size={14} /> Available Quantity</span>
              <span className="detail-meta-value">{listing.quantity}</span>
            </div>

            <div className="detail-meta-box">
              <span className="detail-meta-label"><Calendar size={14} /> Shelf Life / Expiry</span>
              <span className="detail-meta-value">
                {listing.isDurable ? 'Durable Non-Perishable Equipment' : listing.expiry}
              </span>
            </div>

            <div className="detail-meta-box">
              <span className="detail-meta-label"><MapPin size={14} /> Pickup Hub & Location</span>
              <span className="detail-meta-value">{listing.hubName || listing.location}</span>
              {hub && (
                <div className="mt-1">
                  <TrustBadge status={hub.trustStatus} />
                </div>
              )}
            </div>
          </div>

          {/* Condition Notes */}
          <div className="detail-notes-card">
            <div className="notes-heading">
              <Sparkles size={14} />
              <span>Packaging &amp; Condition Details</span>
            </div>
            <p className="notes-body">
              {listing.donorNotes || 'No specific packaging condition noted.'}
            </p>
          </div>

          {/* Request Intake Form (if available) */}
          {isAvailable && (
            <div className="request-intake-card">
              <h4 className="intake-title">Ready to Request this Supply?</h4>
              <p className="intake-subtitle">
                Add an optional pickup note or recovery context for the coordinator at {listing.hubName || 'the community hub'}:
              </p>
              <textarea
                rows={2}
                className="form-textarea"
                placeholder="e.g. Needed for elderly parent mobility post-surgery, can pick up on Thursday afternoon..."
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
              />
            </div>
          )}

          {/* Safety Notice Banner */}
          <div className="safety-callout-card">
            <ShieldCheck size={18} className="safety-callout-icon" />
            <p className="safety-callout-text">
              <strong>CareCycle Safety Protocol:</strong> This platform is a prototype coordination tool. We do not test pharmaceuticals or guarantee product authenticity. Only unopened, unexpired OTC supplies or sanitized durable aids should be circulated.
            </p>
          </div>

          {/* Report Flag Form */}
          {showFlagForm ? (
            <form onSubmit={handleFlagSubmit} className="flag-form-box">
              <h5 className="flag-form-title">
                <Flag size={14} /> Report Listing for Safety Inspection
              </h5>
              <p className="flag-form-subtitle">
                Submit this item to the Administrator Review Queue if you suspect broken seals, expired contents, or policy violations.
              </p>
              <input
                type="text"
                className="form-input"
                placeholder="Describe safety concern (e.g. suspect seal broken, unverified medication)..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                autoFocus
                required
              />
              <div className="flag-form-actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--compact"
                  onClick={() => setShowFlagForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--outline btn--danger btn--compact"
                >
                  Submit Safety Report
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="btn-link btn-flag-trigger"
              onClick={() => setShowFlagForm(true)}
            >
              <Flag size={13} />
              <span>Report this item for administrator safety inspection</span>
            </button>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={onClose}
          >
            Close
          </button>

          {isAvailable ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleRequestSubmit}
            >
              <HeartHandshake size={16} />
              <span>Confirm Supply Request</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                onReturnToShelf(listing.id);
                onClose();
              }}
            >
              <RotateCcw size={14} />
              <span>Return to Shelf (Testing)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
