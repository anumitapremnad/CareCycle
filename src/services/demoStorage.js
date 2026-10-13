import {
  INITIAL_HUBS,
  INITIAL_LISTINGS,
  INITIAL_REQUESTS,
  INITIAL_VERIFICATIONS,
  INITIAL_FLAGGED,
} from '../data/mockData';

const KEYS = {
  LISTINGS: 'carecycle_listings_v2',
  HUBS: 'carecycle_hubs_v2',
  REQUESTS: 'carecycle_requests_v2',
  VERIFICATIONS: 'carecycle_verifications_v2',
  FLAGGED: 'carecycle_flagged_v2',
  USER_STATE: 'carecycle_user_state_v2',
};

const DEFAULT_USER_STATE = {
  role: 'community', // 'community' | 'coordinator' | 'admin'
  coordinatorHubId: 'hub-riverside',
  userName: 'Elena Vance',
};

// Safe reading from localStorage
function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`[CareCycle DemoStorage] Error parsing ${key}:`, err);
    return fallback;
  }
}

// Safe writing to localStorage
function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[CareCycle DemoStorage] Error writing ${key}:`, err);
    return false;
  }
}

export const demoStorage = {
  // Listings
  getListings() {
    const data = safeRead(KEYS.LISTINGS, null);
    if (!data || !Array.isArray(data) || data.length === 0) {
      safeWrite(KEYS.LISTINGS, INITIAL_LISTINGS);
      return INITIAL_LISTINGS;
    }
    return data;
  },

  setListings(listings) {
    safeWrite(KEYS.LISTINGS, listings);
  },

  // Hubs
  getHubs() {
    const data = safeRead(KEYS.HUBS, null);
    if (!data || !Array.isArray(data) || data.length === 0) {
      safeWrite(KEYS.HUBS, INITIAL_HUBS);
      return INITIAL_HUBS;
    }
    return data;
  },

  setHubs(hubs) {
    safeWrite(KEYS.HUBS, hubs);
  },

  // Requests
  getRequests() {
    const data = safeRead(KEYS.REQUESTS, null);
    if (!data || !Array.isArray(data)) {
      safeWrite(KEYS.REQUESTS, INITIAL_REQUESTS);
      return INITIAL_REQUESTS;
    }
    return data;
  },

  setRequests(requests) {
    safeWrite(KEYS.REQUESTS, requests);
  },

  // Verification Requests
  getVerifications() {
    const data = safeRead(KEYS.VERIFICATIONS, null);
    if (!data || !Array.isArray(data)) {
      safeWrite(KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS);
      return INITIAL_VERIFICATIONS;
    }
    return data;
  },

  setVerifications(verifications) {
    safeWrite(KEYS.VERIFICATIONS, verifications);
  },

  // Flagged Listings
  getFlagged() {
    const data = safeRead(KEYS.FLAGGED, null);
    if (!data || !Array.isArray(data)) {
      safeWrite(KEYS.FLAGGED, INITIAL_FLAGGED);
      return INITIAL_FLAGGED;
    }
    return data;
  },

  setFlagged(flagged) {
    safeWrite(KEYS.FLAGGED, flagged);
  },

  // User Demo State
  getUserState() {
    const data = safeRead(KEYS.USER_STATE, null);
    if (!data || typeof data !== 'object') {
      safeWrite(KEYS.USER_STATE, DEFAULT_USER_STATE);
      return DEFAULT_USER_STATE;
    }
    return { ...DEFAULT_USER_STATE, ...data };
  },

  setUserState(state) {
    safeWrite(KEYS.USER_STATE, state);
  },

  // Full Reset
  resetAll() {
    try {
      localStorage.setItem(KEYS.LISTINGS, JSON.stringify(INITIAL_LISTINGS));
      localStorage.setItem(KEYS.HUBS, JSON.stringify(INITIAL_HUBS));
      localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      localStorage.setItem(KEYS.VERIFICATIONS, JSON.stringify(INITIAL_VERIFICATIONS));
      localStorage.setItem(KEYS.FLAGGED, JSON.stringify(INITIAL_FLAGGED));
      localStorage.setItem(KEYS.USER_STATE, JSON.stringify(DEFAULT_USER_STATE));
      return true;
    } catch (err) {
      console.error('[CareCycle DemoStorage] Failed to reset data:', err);
      return false;
    }
  },
};
