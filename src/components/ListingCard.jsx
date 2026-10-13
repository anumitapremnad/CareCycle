import {
  MapPin,
  Calendar,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function ListingCard({ listing, onRequestToggle }) {
  const isAvailable = listing.status === 'Available';

  const formatExpiry = (expiry, isDurable) => {
    if (isDurable) {
      return 'Durable Equipment (No expiry)';
    }
    if (!expiry) {
      return 'Expiry date not specified';
    }
    // Attempt friendly date formatting if YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(expiry)) {
      try {
        const [year, month, day] = expiry.split('-');
        const dateObj = new Date(year, month - 1, day);
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } catch {
        return expiry;
      }
    }
    return expiry;
  };

  return (
    <article className={`listing-card listing-card--${isAvailable ? 'available' : 'requested'}`}>
      <div className="listing-card__header">
        <div className="listing-card__category-wrap">
          <span className="listing-card__category">{listing.category}</span>
        </div>
        <span
          className={`listing-card__status-badge ${
            isAvailable ? 'badge--mint' : 'badge--peach'
          }`}
        >
          {isAvailable ? (
            <>
              <CheckCircle2 size={13} className="badge-icon" />
              <span>Available</span>
            </>
          ) : (
            <>
              <Clock size={13} className="badge-icon" />
              <span>Requested</span>
            </>
          )}
        </span>
      </div>

      <div className="listing-card__body">
        <h4 className="listing-card__title">{listing.name}</h4>

        <div className="listing-card__meta-list">
          <div className="listing-meta-row">
            <Layers size={15} className="listing-meta-icon" />
            <span className="listing-meta-label">Quantity:</span>
            <span className="listing-meta-val">{listing.quantity}</span>
          </div>

          <div className="listing-meta-row">
            <MapPin size={15} className="listing-meta-icon" />
            <span className="listing-meta-label">Pickup Hub:</span>
            <span className="listing-meta-val">{listing.location}</span>
          </div>

          <div className="listing-meta-row">
            <Calendar size={15} className="listing-meta-icon" />
            <span className="listing-meta-label">Expiry / Shelf-Life:</span>
            <span
              className={`listing-meta-val ${
                listing.isDurable ? 'listing-meta-val--durable' : ''
              }`}
            >
              {formatExpiry(listing.expiry, listing.isDurable)}
            </span>
          </div>
        </div>

        {listing.donorNotes && (
          <div className="listing-card__notes">
            <div className="listing-notes-header">
              <Sparkles size={13} className="notes-icon" />
              <span>Condition & Packaging Notes</span>
            </div>
            <p className="listing-notes-text">{listing.donorNotes}</p>
          </div>
        )}
      </div>

      <div className="listing-card__footer">
        <div className="listing-card__donor-meta">
          <span className="donor-label">Contributed by:</span>
          <span className="donor-name">{listing.donorName || 'Community Neighbor'}</span>
        </div>

        <div className="listing-card__actions">
          {isAvailable ? (
            <button
              type="button"
              className="btn btn--primary btn--request"
              onClick={() => onRequestToggle(listing.id)}
              aria-label={`Request ${listing.name}`}
            >
              <HeartHandshake size={16} />
              <span>Request Supply</span>
            </button>
          ) : (
            <div className="requested-action-group">
              <span className="requested-tag">
                <CheckCircle2 size={14} /> Reserved
              </span>
              <button
                type="button"
                className="btn btn--ghost btn--cancel-request"
                onClick={() => onRequestToggle(listing.id)}
                title="Mark this item as available again"
                aria-label={`Cancel request for ${listing.name}`}
              >
                <RotateCcw size={14} />
                <span>Return to Shelf</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
