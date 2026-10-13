import { useState, useMemo } from 'react';
import { Search, Filter, X, PackagePlus, AlertCircle, Sparkles } from 'lucide-react';
import ListingCard from './ListingCard';
import { CATEGORIES } from '../data/mockListings';

export default function CommunityShelf({
  listings,
  onRequestToggle,
  onOpenAddModal,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Available' | 'Requested'
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  // Filter listings based on search term, status, and category
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Status filter
      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'All Categories' && item.category !== categoryFilter) {
        return false;
      }

      // Search term matching name, category, or location
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesLocation = item.location.toLowerCase().includes(query);
        const matchesNotes = item.donorNotes?.toLowerCase().includes(query) || false;

        if (!matchesName && !matchesCategory && !matchesLocation && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [listings, statusFilter, categoryFilter, searchTerm]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    statusFilter !== 'All' ||
    categoryFilter !== 'All Categories';

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCategoryFilter('All Categories');
  };

  const availableCount = listings.filter((l) => l.status === 'Available').length;
  const requestedCount = listings.filter((l) => l.status === 'Requested').length;

  return (
    <section className="community-shelf" aria-labelledby="shelf-section-title">
      <div className="shelf-header">
        <div className="shelf-header__titles">
          <div className="shelf-header__badge">
            <Sparkles size={14} />
            <span>Active Community Inventory</span>
          </div>
          <h2 id="shelf-section-title" className="shelf-header__heading">
            Community Shelf
          </h2>
          <p className="shelf-header__subtext">
            Browse verified fictional surplus supplies and medical aids shared by neighbors and community hubs.
          </p>
        </div>

        <button
          type="button"
          className="btn btn--primary btn--donate-header"
          onClick={onOpenAddModal}
        >
          <PackagePlus size={18} />
          <span>Donate Supplies</span>
        </button>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="shelf-toolbar">
        {/* Search Input */}
        <div className="search-bar">
          <Search size={18} className="search-bar__icon" />
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search by supply name, category, or pickup hub..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search medical supplies"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-bar__clear"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search term"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="filter-group">
          <div className="status-tabs" role="tablist" aria-label="Status filters">
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'All'}
              className={`status-tab ${statusFilter === 'All' ? 'status-tab--active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              All ({listings.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'Available'}
              className={`status-tab ${
                statusFilter === 'Available' ? 'status-tab--active status-tab--mint' : ''
              }`}
              onClick={() => setStatusFilter('Available')}
            >
              Available ({availableCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'Requested'}
              className={`status-tab ${
                statusFilter === 'Requested' ? 'status-tab--active status-tab--peach' : ''
              }`}
              onClick={() => setStatusFilter('Requested')}
            >
              Requested ({requestedCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="category-select-wrapper">
            <Filter size={15} className="category-select-icon" />
            <select
              className="category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Meta status bar showing filter count */}
      <div className="shelf-meta-bar">
        <span className="results-counter">
          Showing <strong>{filteredListings.length}</strong> of{' '}
          <strong>{listings.length}</strong> items
          {hasActiveFilters && ' (filtered)'}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="btn-link clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Listings Grid or Empty State */}
      {filteredListings.length > 0 ? (
        <div className="listings-grid">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onRequestToggle={onRequestToggle}
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon-wrap">
            <PackagePlus size={36} />
          </div>
          <h3 className="empty-state__title">The shelf is currently empty</h3>
          <p className="empty-state__desc">
            No medical supplies or mobility aids are currently listed in this session. Help pass care forward by adding the first item.
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onOpenAddModal}
          >
            <PackagePlus size={16} />
            <span>Add First Donation</span>
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon-wrap empty-state__icon-wrap--filtered">
            <AlertCircle size={36} />
          </div>
          <h3 className="empty-state__title">No matching supplies found</h3>
          <p className="empty-state__desc">
            No community items match your current search &ldquo;{searchTerm}&rdquo; or selected filter criteria. Try adjusting your keywords or clearing the filter.
          </p>
          <div className="empty-state__actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={handleClearFilters}
            >
              Reset Search & Filters
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onOpenAddModal}
            >
              <PackagePlus size={16} />
              <span>Donate This Supply</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
