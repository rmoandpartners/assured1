import type { WizardState } from '../types/questionnaire';

const STORAGE_KEY = 'assured_candidate_onboarding';
const SCHEMA_VERSION = '1.0.0';

interface PersistedState {
  version: string;
  data: WizardState;
  checksum: string;
  savedAt: string;
}

/**
 * Generate a simple checksum for data integrity validation
 */
function generateChecksum(data: WizardState): string {
  const str = JSON.stringify(data.responses);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

/**
 * Save wizard state to localStorage
 */
export function saveToLocalStorage(state: WizardState): boolean {
  try {
    const persistedState: PersistedState = {
      version: SCHEMA_VERSION,
      data: {
        ...state,
        meta: {
          ...state.meta,
          lastSavedAt: new Date().toISOString(),
        },
      },
      checksum: generateChecksum(state),
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    // Could be quota exceeded or other storage errors
    return false;
  }
}

/**
 * Load wizard state from localStorage
 */
export function loadFromLocalStorage(): WizardState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const persisted: PersistedState = JSON.parse(raw);

    // Validate checksum
    const currentChecksum = generateChecksum(persisted.data);
    if (persisted.checksum !== currentChecksum) {
      console.warn('Checksum mismatch - data may be corrupted, but proceeding anyway');
    }

    // Handle schema migrations if needed
    if (persisted.version !== SCHEMA_VERSION) {
      return migrateState(persisted.data, persisted.version);
    }

    return persisted.data;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Check if there is saved progress
 */
export function hasSavedProgress(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return false;
    }
    const persisted: PersistedState = JSON.parse(raw);
    // Check if there are any responses beyond initial state
    const hasResponses = Object.keys(persisted.data.responses).some(
      (qId) => Object.keys(persisted.data.responses[qId]).length > 0
    );
    return hasResponses || persisted.data.sector !== null;
  } catch {
    return false;
  }
}

/**
 * Get the last saved timestamp
 */
export function getLastSavedTime(): Date | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const persisted: PersistedState = JSON.parse(raw);
    return new Date(persisted.savedAt);
  } catch {
    return null;
  }
}

/**
 * Clear all saved progress
 */
export function clearSavedProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Migrate state from older schema versions
 */
function migrateState(data: WizardState, fromVersion: string): WizardState {
  // Currently no migrations needed, return data as-is
  // In the future, add migration logic here
  console.log(`Migrating state from version ${fromVersion} to ${SCHEMA_VERSION}`);
  return {
    ...data,
    meta: {
      ...data.meta,
      version: SCHEMA_VERSION,
    },
  };
}

/**
 * Create a debounced auto-save function
 */
export function createDebouncedSave(
  delayMs: number = 1000,
  maxWaitMs: number = 5000
): {
  save: (state: WizardState) => void;
  flush: () => void;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let maxWaitTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingState: WizardState | null = null;

  const executeSave = () => {
    if (pendingState) {
      saveToLocalStorage(pendingState);
      pendingState = null;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (maxWaitTimeoutId) {
      clearTimeout(maxWaitTimeoutId);
      maxWaitTimeoutId = null;
    }
  };

  const save = (state: WizardState) => {
    pendingState = state;

    // Clear existing debounce timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new debounce timeout
    timeoutId = setTimeout(executeSave, delayMs);

    // Set max wait timeout if not already set
    if (!maxWaitTimeoutId) {
      maxWaitTimeoutId = setTimeout(executeSave, maxWaitMs);
    }
  };

  const flush = () => {
    executeSave();
  };

  const cancel = () => {
    pendingState = null;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (maxWaitTimeoutId) {
      clearTimeout(maxWaitTimeoutId);
      maxWaitTimeoutId = null;
    }
  };

  return { save, flush, cancel };
}

/**
 * Setup persistence event listeners for browser events
 */
export function setupPersistenceListeners(
  getState: () => WizardState,
  onSave: (state: WizardState) => void
): () => void {
  // Save on page unload
  const handleBeforeUnload = () => {
    onSave(getState());
  };

  // Save when tab becomes hidden
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      onSave(getState());
    }
  };

  // Save on focus loss
  const handleBlur = () => {
    onSave(getState());
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', handleBlur);

  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleBlur);
  };
}

/**
 * Format relative time for display (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    return then.toLocaleDateString();
  }
}
