/**
 * Prototype Authentication & Account Repository.
 *
 * Implements local prototype accounts with real password hashing (SHA-256),
 * session management, duplicate email prevention, and per-user account isolation.
 *
 * NOTE: Prototype authentication — production deployment would use a secure authentication service.
 */

export interface PrototypeAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  onboardingCompleted: boolean;
  observationStyle: 'independent' | 'balanced' | 'guided';
  avatarUrl?: string;
}

export interface PrototypeSession {
  userId: string;
  email: string;
  loggedInAt: number;
}

export interface AuthResult {
  success: boolean;
  account?: PrototypeAccount;
  error?: string;
}

export interface IAuthRepository {
  signUp(name: string, email: string, password: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  getSession(): Promise<PrototypeAccount | null>;
  signOut(): Promise<void>;
  updateAccount(userId: string, updates: Partial<PrototypeAccount>): Promise<PrototypeAccount | null>;
  completeOnboarding(userId: string): Promise<void>;
  getAccountById(userId: string): PrototypeAccount | null;
}

const ACCOUNTS_STORAGE_KEY = 'leafstory_prototype_accounts_v3';
const SESSION_STORAGE_KEY = 'leafstory_prototype_session_v3';
export const TESTING_ACCOUNT_ID = 'usr_daksh_testing_100d';

export class LocalAuthRepository implements IAuthRepository {
  private seeded = false;

  private async ensureTestingAccountSeeded(): Promise<void> {
    if (this.seeded) return;
    this.seeded = true;

    const accounts = this.getAllAccounts();
    const exists = accounts.some(
      (a) => a.id === TESTING_ACCOUNT_ID || a.email.toLowerCase() === 'daksh@leafstory.test'
    );
    if (!exists) {
      const passwordHash = await this.hashPassword('LeafStory100!');
      const testingAccount: PrototypeAccount = {
        id: TESTING_ACCOUNT_ID,
        name: 'Daksh Patel',
        email: 'daksh@leafstory.test',
        passwordHash,
        createdAt: '2026-07-01T09:00:00Z',
        onboardingCompleted: true,
        observationStyle: 'balanced',
      };
      accounts.push(testingAccount);
      this.saveAllAccounts(accounts);
    }
  }
  /**
   * Cryptographically hash password using Web Crypto API SHA-256
   */
  private async hashPassword(password: string): Promise<string> {
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      console.warn('[AuthRepository] Web Crypto unavailable, using fallback hash');
    }
    // Fallback lightweight hash for environments without Web Crypto
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'fallback_hash_' + Math.abs(hash).toString(16);
  }

  /**
   * Load all prototype accounts from local storage
   */
  private getAllAccounts(): PrototypeAccount[] {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[AuthRepository] Failed to read accounts from storage:', e);
    }
    return [];
  }

  /**
   * Save accounts list to local storage
   */
  private saveAllAccounts(accounts: PrototypeAccount[]): void {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('[AuthRepository] Failed to persist accounts:', e);
    }
  }

  /**
   * Save session
   */
  private saveSession(session: PrototypeSession | null): void {
    try {
      if (session) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[AuthRepository] Failed to update session:', e);
    }
  }

  /**
   * SIGN UP:
   * - Validates name, email, password
   * - Prevents duplicate emails
   * - Saves new prototype account
   * - Sets active session
   */
  async signUp(name: string, email: string, password: string): Promise<AuthResult> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      return { success: false, error: 'Please enter your name.' };
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const accounts = this.getAllAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const passwordHash = await this.hashPassword(password);
    const newAccount: PrototypeAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: trimmedName,
      email: trimmedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
      onboardingCompleted: false, // New users will see the animated product demo
      observationStyle: 'balanced',
    };

    accounts.push(newAccount);
    this.saveAllAccounts(accounts);

    // Set active session
    this.saveSession({
      userId: newAccount.id,
      email: newAccount.email,
      loggedInAt: Date.now(),
    });

    return {
      success: true,
      account: newAccount,
    };
  }

  /**
   * SIGN IN:
   * - Looks up account by lowercase email
   * - Strictly verifies password hash against saved account
   * - Nonexistent account or wrong password returns identical generic error
   * - NEVER simply checks whether password field is non-empty
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    await this.ensureTestingAccountSeeded();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return {
        success: false,
        error: 'Please enter both your email address and password.',
      };
    }

    const accounts = this.getAllAccounts();
    const account = accounts.find((a) => a.email.toLowerCase() === trimmedEmail);

    // Nonexistent account check: return generic message without revealing existence
    if (!account) {
      return {
        success: false,
        error: "We couldn't sign you in. Check your email and password and try again.",
      };
    }

    // Verify password hash
    const inputHash = await this.hashPassword(password);
    if (inputHash !== account.passwordHash) {
      return {
        success: false,
        error: "We couldn't sign you in. Check your email and password and try again.",
      };
    }

    // Passwords match! Establish prototype session
    this.saveSession({
      userId: account.id,
      email: account.email,
      loggedInAt: Date.now(),
    });

    return {
      success: true,
      account,
    };
  }

  /**
   * Get active session and corresponding account
   */
  async getSession(): Promise<PrototypeAccount | null> {
    await this.ensureTestingAccountSeeded();
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;

      const session: PrototypeSession = JSON.parse(raw);
      if (!session || !session.userId) return null;

      const account = this.getAccountById(session.userId);
      if (!account) {
        // Session orphaned, clear it
        this.saveSession(null);
        return null;
      }

      return account;
    } catch (e) {
      console.warn('[AuthRepository] Failed to restore session:', e);
      return null;
    }
  }

  /**
   * SIGN OUT: Clear prototype session
   */
  async signOut(): Promise<void> {
    this.saveSession(null);
  }

  /**
   * Update account properties
   */
  async updateAccount(
    userId: string,
    updates: Partial<PrototypeAccount>
  ): Promise<PrototypeAccount | null> {
    const accounts = this.getAllAccounts();
    const index = accounts.findIndex((a) => a.id === userId);
    if (index === -1) return null;

    const updated: PrototypeAccount = {
      ...accounts[index],
      ...updates,
    };
    accounts[index] = updated;
    this.saveAllAccounts(accounts);
    return updated;
  }

  /**
   * Mark onboarding completed for a specific user account
   */
  async completeOnboarding(userId: string): Promise<void> {
    await this.updateAccount(userId, { onboardingCompleted: true });
  }

  /**
   * Find account by ID
   */
  getAccountById(userId: string): PrototypeAccount | null {
    const accounts = this.getAllAccounts();
    return accounts.find((a) => a.id === userId) || null;
  }
}

// Export singleton repository
export const AuthRepository: IAuthRepository = new LocalAuthRepository();
