import { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  Package,
  Clock,
  Phone,
  Mail,
  UserCheck,
  UserPlus,
  ShieldAlert,
  ArrowRight,
  X,
  Layers,
} from 'lucide-react';
import TrustBadge from './TrustBadge';

export default function HubsView({
  hubs,
  listings,
  requests,
  onToggleJoinHub,
  onViewHubListings,
  onOpenAddDonationForHub,
}) {
  const [selectedHub, setSelectedHub] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');

  const hubTypes = ['All', ...new Set(hubs.map((h) => h.type))];

  const filteredHubs = hubs.filter((hub) => {
    if (typeFilter !== 'All' && hub.type !== typeFilter) return false;
    return true;
  });

  const getHubStats = (hubId) => {
    const hubListings = listings.filter((l) => l.hubId === hubId);
    const available = hubListings.filter((l) => l.status === 'Available').length;
    const hubRequests = requests.filter((r) => r.hubId === hubId);
    const activeRequests = hubRequests.filter(
      (r) => r.status === 'Requested' || r.status === 'Accepted' || r.status === 'Ready for collection'
    ).length;
    return {
      totalListings: hubListings.length,
      availableListings: available,
      activeRequests,
      listings: hubListings,
      requests: hubRequests,
    };
  };

  return (
    <section className="hubs-view" aria-labelledby="hubs-view-title">
      <div className="view-header">
        <div className="view-header__title-group">
          <div className="view-badge">
            <Building2 size={14} />
            <span>Community Coordination Network</span>
          </div>
          <h2 id="hubs-view-title" className="view-title">
            Community Hubs & Organizations
          </h2>
          <p className="view-subtitle">
            Explore local grassroots centers, student volunteer groups, and healthcare outreach partners coordinating safe supply drop-offs and pickups.
          </p>
        </div>

        <div className="hub-filter-wrap">
          <label htmlFor="hub-type-select" className="filter-label">
            Filter by Type:
          </label>
          <select
            id="hub-type-select"
            className="form-select hub-type-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {hubTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="demo-disclaimer-pill">
        <ShieldAlert size={14} />
        <span>
          Fictional demonstration organizations. All hub names, metrics, and contacts are illustrative demo profiles.
        </span>
      </div>

      <div className="hubs-grid">
        {filteredHubs.map((hub) => {
          const stats = getHubStats(hub.id);
          return (
            <article key={hub.id} className="hub-card">
              <div className="hub-card__header">
                <div className="hub-card__type-tag">{hub.type}</div>
                <TrustBadge status={hub.trustStatus} />
              </div>

              <div className="hub-card__body">
                <h3 className="hub-card__name">{hub.name}</h3>
                <p className="hub-card__location">
                  <MapPin size={14} className="hub-icon" />
                  <span>{hub.location}</span>
                </p>
                <p className="hub-card__desc">{hub.description}</p>

                <div className="hub-metrics-row">
                  <div className="hub-metric">
                    <Package size={15} className="hub-metric-icon" />
                    <span className="hub-metric-val">{stats.availableListings}</span>
                    <span className="hub-metric-label">Available</span>
                  </div>
                  <div className="hub-metric">
                    <Clock size={15} className="hub-metric-icon" />
                    <span className="hub-metric-val">{stats.activeRequests}</span>
                    <span className="hub-metric-label">Active Requests</span>
                  </div>
                  <div className="hub-metric">
                    <Users size={15} className="hub-metric-icon" />
                    <span className="hub-metric-val">{hub.memberCount}</span>
                    <span className="hub-metric-label">Members</span>
                  </div>
                </div>
              </div>

              <div className="hub-card__footer">
                <button
                  type="button"
                  className={`btn-hub-join ${hub.isJoined ? 'btn-hub-join--joined' : ''}`}
                  onClick={() => onToggleJoinHub(hub.id)}
                  aria-label={hub.isJoined ? `Leave ${hub.name}` : `Join ${hub.name}`}
                >
                  {hub.isJoined ? (
                    <>
                      <UserCheck size={14} />
                      <span>Joined Member</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      <span>Join Hub</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn--outline btn--compact"
                  onClick={() => setSelectedHub(hub)}
                >
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Hub Detail Modal */}
      {selectedHub && (
        <div className="modal-backdrop" onClick={() => setSelectedHub(null)} role="presentation">
          <div
            className="modal-container modal-container--wide"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hub-detail-title"
          >
            {(() => {
              const stats = getHubStats(selectedHub.id);
              return (
                <>
                  <div className="modal-header">
                    <div className="modal-header__icon-box">
                      <Building2 size={24} />
                    </div>
                    <div className="modal-header__text">
                      <div className="modal-tag-row">
                        <span className="hub-card__type-tag">{selectedHub.type}</span>
                        <TrustBadge status={selectedHub.trustStatus} showDetails />
                      </div>
                      <h3 id="hub-detail-title" className="modal-title">
                        {selectedHub.name}
                      </h3>
                      <p className="modal-subtitle">
                        <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                        {selectedHub.location}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="modal-close-btn"
                      onClick={() => setSelectedHub(null)}
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="modal-body-content">
                    <div className="hub-detail-grid">
                      <div className="hub-detail-section">
                        <h4 className="detail-section-title">About This Hub</h4>
                        <p className="detail-text">{selectedHub.description}</p>

                        <div className="hub-contact-card">
                          <h5 className="contact-card-title">Coordinator & Contact Details</h5>
                          <p className="contact-item">
                            <strong>Coordinator:</strong> {selectedHub.coordinatorName}
                          </p>
                          <p className="contact-item">
                            <Phone size={14} /> {selectedHub.contact.phone}
                          </p>
                          <p className="contact-item">
                            <Mail size={14} /> {selectedHub.contact.email}
                          </p>
                          <p className="contact-item">
                            <Clock size={14} /> {selectedHub.contact.hours}
                          </p>
                        </div>
                      </div>

                      <div className="hub-detail-section">
                        <h4 className="detail-section-title">
                          Inventory at this Hub ({stats.totalListings} total)
                        </h4>

                        {stats.listings.length > 0 ? (
                          <div className="hub-listing-preview-list">
                            {stats.listings.map((item) => (
                              <div key={item.id} className="hub-listing-item">
                                <div className="hub-listing-item__info">
                                  <strong>{item.name}</strong>
                                  <span className="hub-listing-item__meta">
                                    {item.category} &bull; {item.quantity}
                                  </span>
                                </div>
                                <span
                                  className={`status-pill ${
                                    item.status === 'Available' ? 'badge--mint' : 'badge--peach'
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty-substate">
                            <Package size={28} className="empty-substate__icon" />
                            <p>No medical supplies are currently cataloged at this hub.</p>
                            <button
                              type="button"
                              className="btn btn--outline btn--compact"
                              onClick={() => {
                                setSelectedHub(null);
                                onOpenAddDonationForHub(selectedHub.id);
                              }}
                            >
                              Donate to this Hub
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className={`btn-hub-join ${
                        selectedHub.isJoined ? 'btn-hub-join--joined' : ''
                      }`}
                      onClick={() => onToggleJoinHub(selectedHub.id)}
                    >
                      {selectedHub.isJoined ? (
                        <>
                          <UserCheck size={14} />
                          <span>Joined Member</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} />
                          <span>Join this Hub</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => {
                        const hubId = selectedHub.id;
                        setSelectedHub(null);
                        onViewHubListings(hubId);
                      }}
                    >
                      <Layers size={16} />
                      <span>View All Supplies on Shelf</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
