import { useState } from 'react';
import {
  Settings,
  Database,
  RotateCcw,
  AlertTriangle,
  Server,
} from 'lucide-react';

export default function SettingsView({
  listings,
  requests,
  hubs,
  verifications,
  flaggedListings,
  userState,
  onResetData,
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmReset = () => {
    onResetData();
    setShowConfirmModal(false);
  };

  return (
    <section className="settings-view" aria-labelledby="settings-title">
      <div className="view-header">
        <div className="view-header__title-group">
          <div className="view-badge">
            <Settings size={14} />
            <span>Prototype Environment</span>
          </div>
          <h2 id="settings-title" className="view-title">
            Demo Settings &amp; Data Management
          </h2>
          <p className="view-subtitle">
            Inspect local prototype storage, review data scope limitations, and reset demonstration datasets to their default baseline.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Storage Architecture Disclosure */}
        <div className="card settings-card">
          <div className="settings-card__header">
            <Database size={20} className="text-forest" />
            <h3 className="settings-card__title">Local Storage Architecture</h3>
          </div>
          <div className="settings-card__body">
            <p className="settings-text">
              CareCycle operates entirely inside your web browser using HTML5 <code>localStorage</code>. There is no remote database or central cloud backend.
            </p>
            <div className="storage-inventory-list">
              <div className="storage-inventory-item">
                <span>Active Demo Role</span>
                <strong className="capitalize">{userState?.role || 'community'} member</strong>
              </div>
              <div className="storage-inventory-item">
                <span>Cataloged Supplies</span>
                <strong>{listings.length} items</strong>
              </div>
              <div className="storage-inventory-item">
                <span>Community Requests</span>
                <strong>{requests.length} records</strong>
              </div>
              <div className="storage-inventory-item">
                <span>Community Hubs</span>
                <strong>{hubs.length} hubs</strong>
              </div>
              <div className="storage-inventory-item">
                <span>Verification Applications</span>
                <strong>{verifications.length} records</strong>
              </div>
              <div className="storage-inventory-item">
                <span>Safety / Flagged Reports</span>
                <strong>{flaggedListings.length} reports</strong>
              </div>
            </div>

            <div className="demo-disclaimer-pill mt-3">
              <Server size={14} />
              <span>
                <strong>Browser Isolation:</strong> Changes made here only affect this specific browser profile. Other tabs or devices do not synchronize.
              </span>
            </div>
          </div>
        </div>

        {/* Reset Demo Data Card */}
        <div className="card settings-card">
          <div className="settings-card__header">
            <RotateCcw size={20} className="text-peach" />
            <h3 className="settings-card__title">Restore Coherent Baseline Data</h3>
          </div>
          <div className="settings-card__body">
            <p className="settings-text">
              If you have added donations, completed requests, or altered hub trust badges and wish to return to the original clean demonstration catalog, you can perform a full reset.
            </p>

            <div className="reset-warning-box">
              <AlertTriangle size={16} className="text-peach" />
              <span>
                This will reset all listings, requests, verifications, and trust badges to their factory demonstration state.
              </span>
            </div>

            <button
              type="button"
              className="btn btn--outline btn--danger mt-3"
              onClick={() => setShowConfirmModal(true)}
            >
              <RotateCcw size={16} />
              <span>Reset All Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop" onClick={() => setShowConfirmModal(false)} role="presentation">
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-header__icon-box text-peach">
                <AlertTriangle size={24} />
              </div>
              <div className="modal-header__text">
                <h3 className="modal-title">Confirm Full Demo Data Reset</h3>
                <p className="modal-subtitle">
                  Restore the initial fictional catalog, requests, and hub statuses.
                </p>
              </div>
            </div>

            <div className="modal-body-content">
              <p className="modal-body-text">
                Are you sure you want to reset your local prototype data? All custom listings, requests, and verification decisions created during this session will be restored to the initial mock baseline.
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--primary btn--danger"
                onClick={handleConfirmReset}
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
