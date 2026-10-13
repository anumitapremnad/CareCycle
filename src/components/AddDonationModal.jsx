import { useState, useEffect, useCallback } from 'react';
import { X, PackagePlus, AlertCircle, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../data/mockListings';

const FORM_CATEGORIES = CATEGORIES.filter((c) => c !== 'All Categories');

const INITIAL_FORM_STATE = {
  name: '',
  category: FORM_CATEGORIES[0] || 'First Aid & Wound Care',
  quantity: '',
  location: '',
  isDurable: false,
  expiry: '',
  donorNotes: '',
  donorName: '',
  safetyAcknowledge: false,
};

export default function AddDonationModal({ isOpen, onClose, onAddListing }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleClose = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    onClose();
  }, [onClose]);

  // Handle ESC key to close modal
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

  const validate = (data = formData) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Supply name is required.';
    } else if (data.name.trim().length < 3) {
      newErrors.name = 'Supply name must be at least 3 characters.';
    }

    if (!data.category || data.category === 'All Categories') {
      newErrors.category = 'Please select a valid supply category.';
    }

    if (!data.quantity.trim()) {
      newErrors.quantity = 'Quantity is required (e.g. "2 boxes", "1 unit").';
    }

    if (!data.location.trim()) {
      newErrors.location = 'Pickup location or community hub is required.';
    }

    if (!data.isDurable) {
      if (!data.expiry) {
        newErrors.expiry = 'Expiration date is required for non-durable supplies.';
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        if (data.expiry < todayStr) {
          newErrors.expiry = 'Safety policy: Expired medical supplies cannot be accepted.';
        }
      }
    }

    if (!data.donorNotes.trim()) {
      newErrors.donorNotes = 'Condition & storage description is required for safety verification.';
    } else if (data.donorNotes.trim().length < 10) {
      newErrors.donorNotes = 'Please provide at least 10 characters describing the packaging or condition.';
    }

    if (!data.safetyAcknowledge) {
      newErrors.safetyAcknowledge = 'You must confirm safety and non-prescription criteria.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    const updated = { ...formData, [name]: newVal };
    setFormData(updated);

    // If already touched, validate live
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
      const newListing = {
        id: `cc-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        quantity: formData.quantity.trim(),
        location: formData.location.trim(),
        expiry: formData.isDurable ? 'Non-perishable (Durable Equipment)' : formData.expiry,
        isDurable: formData.isDurable,
        status: 'Available',
        donorNotes: formData.donorNotes.trim(),
        donorName: formData.donorName.trim() || 'Community Member',
        dateAdded: new Date().toISOString().split('T')[0],
      };

      onAddListing(newListing);
      handleClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="presentation">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-header__icon-box">
            <PackagePlus size={22} />
          </div>
          <div className="modal-header__text">
            <h3 id="modal-title" className="modal-title">
              Add a Supply Donation
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

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Supply Name */}
          <div className={`form-field ${errors.name && touched.name ? 'form-field--error' : ''}`}>
            <label htmlFor="supply-name" className="form-label">
              Supply Item Name <span className="required-star">*</span>
            </label>
            <input
              id="supply-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Sterile Gauze Rolls, Folding Cane, Pediatric Oximeter"
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
                Quantity & Unit <span className="required-star">*</span>
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

          {/* Pickup Location */}
          <div className={`form-field ${errors.location && touched.location ? 'form-field--error' : ''}`}>
            <label htmlFor="supply-location" className="form-label">
              Pickup Hub or Community Location <span className="required-star">*</span>
            </label>
            <input
              id="supply-location"
              type="text"
              name="location"
              className="form-input"
              placeholder="e.g. Riverside Community Hub, Desk 104, or Neighborhood Pantry"
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
                <span>This item is <strong>durable hardware/equipment</strong> (non-perishable, e.g. crutches, walker, oximeter)</span>
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
                <span className="field-hint">
                  Perishable items must be unexpired and in original sealed packaging.
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
              Condition & Packaging Notes <span className="required-star">*</span>
            </label>
            <textarea
              id="supply-notes"
              name="donorNotes"
              rows={3}
              className="form-textarea"
              placeholder="e.g. Unopened factory seal intact, stored in a dry closet, gently cleaned durable hardware with antiseptic..."
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

          {/* Contributor Name (Optional) */}
          <div className="form-field">
            <label htmlFor="supply-donor" className="form-label">
              Your Name / Group (Optional demo handle)
            </label>
            <input
              id="supply-donor"
              type="text"
              name="donorName"
              className="form-input"
              placeholder="e.g. Maya S. or Civic Clinic Volunteer (Defaults to Community Member)"
              value={formData.donorName}
              onChange={handleChange}
            />
          </div>

          {/* Safety Checkbox */}
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
                  <strong>Safety Attestation:</strong> I confirm this supply is not a prescription medication, is unexpired, and is in unbroken original packaging or thoroughly sanitized durable condition.
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
