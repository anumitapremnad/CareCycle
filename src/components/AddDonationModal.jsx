import { useState, useEffect, useCallback } from 'react';
import {
  X,
  PackagePlus,
  AlertCircle,
  ShieldCheck,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const FORM_CATEGORIES = CATEGORIES.filter((c) => c !== 'All Categories');

export default function AddDonationModal({
  isOpen,
  onClose,
  onAddListing,
  hubs = [],
  initialHubId = '',
}) {
  const getInitialState = useCallback(() => ({
    name: '',
    category: FORM_CATEGORIES[0] || 'First Aid & Wound Care',
    quantity: '',
    hubId: initialHubId || (hubs[0] ? hubs[0].id : 'hub-independent'),
    location: '',
    isDurable: false,
    expiry: '',
    donorNotes: '',
    donorName: '',
    safetyAcknowledge: false,
  }), [hubs, initialHubId]);

  const [formData, setFormData] = useState(getInitialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleClose = useCallback(() => {
    setFormData(getInitialState());
    setErrors({});
    setTouched({});
    onClose();
  }, [getInitialState, onClose]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  // Check if expiring soon (< 45 days)
  const isExpiringSoon = (() => {
    if (formData.isDurable || !formData.expiry) return false;
    const expiryDate = new Date(formData.expiry);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 45;
  })();

  const validate = (data = formData) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Supply title is required.';
    } else if (data.name.trim().length < 3) {
      newErrors.name = 'Supply title must be at least 3 characters.';
    }

    if (!data.category || data.category === 'All Categories') {
      newErrors.category = 'Please select a valid supply category.';
    }

    if (!data.quantity.trim()) {
      newErrors.quantity = 'Available quantity is required (e.g. "2 boxes (50 ct)", "1 unit").';
    }

    if (!data.location.trim()) {
      newErrors.location = 'Pickup location / collection instructions are required.';
    }

    if (!data.isDurable) {
      if (!data.expiry) {
        newErrors.expiry = 'Expiration date is required for non-durable supplies.';
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        if (data.expiry < todayStr) {
          newErrors.expiry = 'Prohibited: Expired medical supplies cannot be accepted under safety policy.';
        }
      }
    }

    if (!data.donorNotes.trim()) {
      newErrors.donorNotes = 'Condition & packaging description is required for safety verification.';
    } else if (data.donorNotes.trim().length < 10) {
      newErrors.donorNotes = 'Please provide at least 10 characters describing seal and packaging condition.';
    }

    if (!data.safetyAcknowledge) {
      newErrors.safetyAcknowledge = 'You must confirm safety, non-prescription status, and legal adherence.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    const updated = { ...formData, [name]: newVal };
    setFormData(updated);

    if (touched[name]) {
      const fieldErrors = validate(updated);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name] || undefined,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validate();
    setErrors((prev) => ({
      ...prev,
      [field]: currentErrors[field] || undefined,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);
    setTouched({
      name: true,
      category: true,
      quantity: true,
      location: true,
      expiry: true,
      donorNotes: true,
      safetyAcknowledge: true,
    });

    if (Object.keys(formErrors).length === 0) {
      const associatedHub = hubs.find((h) => h.id === formData.hubId);

      const newListing = {
        id: `cc-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        quantity: formData.quantity.trim(),
        hubId: formData.hubId || 'hub-independent',
        hubName: associatedHub ? associatedHub.name : 'Independent Community Drop-off',
        location: formData.location.trim(),
        expiry: formData.isDurable ? 'Non-perishable (Durable Equipment)' : formData.expiry,
        isDurable: formData.isDurable,
        status: 'Available',
        donorNotes: formData.donorNotes.trim(),
        donorName: formData.donorName.trim() || 'Community Contributor',
        dateAdded: new Date().toISOString().split('T')[0],
        flagged: false,
        flagReason: null,
      };

      onAddListing(newListing);
      handleClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="presentation">
      <div
        className="modal-container modal-container--wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-modal-title"
      >
        <div className="modal-header">
          <div className="modal-header__icon-box">
            <PackagePlus size={22} />
          </div>
          <div className="modal-header__text">
            <h3 id="add-modal-title" className="modal-title">
              List a Medical Supply Donation
            </h3>
            <p className="modal-subtitle">
              Pass care forward by sharing unopened surplus health items or clean durable aids.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Safety & Legal Guidance Banner */}
        <div className="donation-safety-banner">
          <ShieldCheck size={20} className="donation-safety-banner__icon" />
          <div className="donation-safety-banner__text">
            <strong>Important Safety &amp; Legal Notice:</strong>
            <p>
              Medicine sharing and redistribution may be restricted by local and national law. CareCycle does not authorize medicine transfers, certify medical efficacy, or replace qualified professional healthcare guidance. Only factory-sealed OTC essentials and sanitized durable hardware are permitted. <em>Prescription medicines (Rx) are strictly prohibited.</em>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Supply Name */}
          <div className={`form-field ${errors.name && touched.name ? 'form-field--error' : ''}`}>
            <label htmlFor="supply-name" className="form-label">
              Supply Item Title <span className="required-star">*</span>
            </label>
            <input
              id="supply-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Sterile Gauze Rolls, Folding Cane, Pediatric Pulse Oximeter"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              autoFocus
            />
            {errors.name && touched.name && (
              <p className="field-error-message">
                <AlertCircle size={14} /> {errors.name}
              </p>
            )}
          </div>

          <div className="form-grid-2">
            {/* Category */}
            <div className={`form-field ${errors.category && touched.category ? 'form-field--error' : ''}`}>
              <label htmlFor="supply-category" className="form-label">
                Category <span className="required-star">*</span>
              </label>
              <select
                id="supply-category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                onBlur={() => handleBlur('category')}
              >
                {FORM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && touched.category && (
                <p className="field-error-message">
                  <AlertCircle size={14} /> {errors.category}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className={`form-field ${errors.quantity && touched.quantity ? 'form-field--error' : ''}`}>
              <label htmlFor="supply-quantity" className="form-label">
                Available Quantity &amp; Unit <span className="required-star">*</span>
              </label>
              <input
                id="supply-quantity"
                type="text"
                name="quantity"
                className="form-input"
                placeholder="e.g. 2 boxes (50 ct), 1 unit, 3 rolls"
                value={formData.quantity}
                onChange={handleChange}
                onBlur={() => handleBlur('quantity')}
              />
              {errors.quantity && touched.quantity && (
                <p className="field-error-message">
                  <AlertCircle size={14} /> {errors.quantity}
                </p>
              )}
            </div>
          </div>

          <div className="form-grid-2">
            {/* Associated Community Hub */}
            <div className="form-field">
              <label htmlFor="supply-hub" className="form-label">
                <Building2 size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Associated Hub / Partner
              </label>
              <select
                id="supply-hub"
                name="hubId"
                className="form-select"
                value={formData.hubId}
                onChange={handleChange}
              >
                {hubs.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.type})
                  </option>
                ))}
                <option value="hub-independent">Independent Community Drop-off</option>
              </select>
            </div>

            {/* Pickup Location / Specific Instructions */}
            <div className={`form-field ${errors.location && touched.location ? 'form-field--error' : ''}`}>
              <label htmlFor="supply-location" className="form-label">
                Pickup Room / Locker Instructions <span className="required-star">*</span>
              </label>
              <input
                id="supply-location"
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Room 104, Locker 12, or Drop-box A"
                value={formData.location}
                onChange={handleChange}
                onBlur={() => handleBlur('location')}
              />
              {errors.location && touched.location && (
                <p className="field-error-message">
                  <AlertCircle size={14} /> {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Expiry vs Durable Section */}
          <div className="form-field-card">
            <div className="form-checkbox-row">
              <label className="checkbox-label-inline">
                <input
                  type="checkbox"
                  name="isDurable"
                  checked={formData.isDurable}
                  onChange={handleChange}
                />
                <span>
                  This item is <strong>durable equipment / non-perishable</strong> (e.g. crutches, walker, oximeter, blood pressure cuff)
                </span>
              </label>
            </div>

            {!formData.isDurable && (
              <div
                className={`form-field mt-3 ${
                  errors.expiry && touched.expiry ? 'form-field--error' : ''
                }`}
              >
                <label htmlFor="supply-expiry" className="form-label">
                  Expiration Date <span className="required-star">*</span>
                </label>
                <input
                  id="supply-expiry"
                  type="date"
                  name="expiry"
                  className="form-input"
                  value={formData.expiry}
                  onChange={handleChange}
                  onBlur={() => handleBlur('expiry')}
                />

                {isExpiringSoon && (
                  <div className="expiring-warning-pill mt-2">
                    <AlertTriangle size={14} />
                    <span>
                      Approaching Expiry Notice: This item expires within 45 days. Ensure local coordinators can arrange pickup promptly.
                    </span>
                  </div>
                )}

                <span className="field-hint">
                  Perishable items must be unexpired and factory-sealed. Expired items are strictly rejected.
                </span>
                {errors.expiry && touched.expiry && (
                  <p className="field-error-message">
                    <AlertCircle size={14} /> {errors.expiry}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Condition Notes */}
          <div className={`form-field ${errors.donorNotes && touched.donorNotes ? 'form-field--error' : ''}`}>
            <label htmlFor="supply-notes" className="form-label">
              Condition, Packaging &amp; Seal Notes <span className="required-star">*</span>
            </label>
            <textarea
              id="supply-notes"
              name="donorNotes"
              rows={3}
              className="form-textarea"
              placeholder="e.g. Unopened factory tamper seal intact, stored in dry temperature-controlled cabinet, sanitized durable hardware..."
              value={formData.donorNotes}
              onChange={handleChange}
              onBlur={() => handleBlur('donorNotes')}
            />
            {errors.donorNotes && touched.donorNotes && (
              <p className="field-error-message">
                <AlertCircle size={14} /> {errors.donorNotes}
              </p>
            )}
          </div>

          {/* Contributor Handle */}
          <div className="form-field">
            <label htmlFor="supply-donor" className="form-label">
              Contributor Name / Group (Optional demo handle)
            </label>
            <input
              id="supply-donor"
              type="text"
              name="donorName"
              className="form-input"
              placeholder="e.g. Elena V., Civic Clinic Volunteer (Defaults to Community Contributor)"
              value={formData.donorName}
              onChange={handleChange}
            />
          </div>

          {/* Safety Attestation */}
          <div
            className={`safety-confirmation-box ${
              errors.safetyAcknowledge && touched.safetyAcknowledge
                ? 'safety-confirmation-box--error'
                : ''
            }`}
          >
            <label className="checkbox-label-block">
              <input
                type="checkbox"
                name="safetyAcknowledge"
                checked={formData.safetyAcknowledge}
                onChange={handleChange}
                onBlur={() => handleBlur('safetyAcknowledge')}
              />
              <span className="checkbox-text">
                <ShieldCheck size={18} className="shield-icon" />
                <span>
                  <strong>Safety &amp; Compliance Attestation:</strong> I confirm this supply is not a prescription pharmaceutical, is unexpired, and is in unbroken original packaging or sanitized durable condition. I acknowledge this submission does not constitute a certified medical evaluation.
                </span>
              </span>
            </label>
            {errors.safetyAcknowledge && touched.safetyAcknowledge && (
              <p className="field-error-message mt-2">
                <AlertCircle size={14} /> {errors.safetyAcknowledge}
              </p>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
            >
              <PackagePlus size={16} />
              <span>List Donation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
