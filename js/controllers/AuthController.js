/**
 * =====================================================
 * CHANDNI JEWELLERY - Auth Controller
 * =====================================================
 */

import { userModel } from '../models/UserModel.js';
import { cartModel } from '../models/CartModel.js';

export class AuthController {
  constructor() {
    this.pendingConfirmCallback = null;
    this.initEventListeners();
    this.checkAuthState();
    this.createConfirmDialog();
  }

  /**
   * Create accessible confirm dialog
   */
  createConfirmDialog() {
    // Check if dialog already exists
    if (document.getElementById('authConfirmDialog')) return;

    const dialog = document.createElement('div');
    dialog.id = 'authConfirmDialog';
    dialog.className = 'auth-confirm-dialog';
    dialog.setAttribute('role', 'alertdialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'authConfirmTitle');
    dialog.setAttribute('aria-describedby', 'authConfirmMessage');
    dialog.setAttribute('aria-hidden', 'true');
    dialog.innerHTML = `
      <div class="auth-confirm-dialog__overlay"></div>
      <div class="auth-confirm-dialog__content" role="document">
        <h2 id="authConfirmTitle" class="auth-confirm-dialog__title">Confirm</h2>
        <p id="authConfirmMessage" class="auth-confirm-dialog__message"></p>
        <div class="auth-confirm-dialog__actions">
          <button type="button" class="btn btn--secondary" data-confirm-cancel>Cancel</button>
          <button type="button" class="btn btn--primary" data-confirm-ok>Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    // Add dialog styles if not present
    if (!document.getElementById('authConfirmDialogStyles')) {
      const styles = document.createElement('style');
      styles.id = 'authConfirmDialogStyles';
      styles.textContent = `
        .auth-confirm-dialog {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 9999;
        }
        .auth-confirm-dialog.is-open {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-confirm-dialog__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        .auth-confirm-dialog__content {
          position: relative;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        .auth-confirm-dialog__title {
          margin: 0 0 1rem;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .auth-confirm-dialog__message {
          margin: 0 0 1.5rem;
          color: #666;
        }
        .auth-confirm-dialog__actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        .is-hidden {
          display: none !important;
        }
        .is-visible {
          display: block !important;
        }
      `;
      document.head.appendChild(styles);
    }

    // Bind dialog events
    const cancelBtn = dialog.querySelector('[data-confirm-cancel]');
    const okBtn = dialog.querySelector('[data-confirm-ok]');
    const overlay = dialog.querySelector('.auth-confirm-dialog__overlay');

    cancelBtn.addEventListener('click', () => this.closeConfirmDialog(false));
    okBtn.addEventListener('click', () => this.closeConfirmDialog(true));
    overlay.addEventListener('click', () => this.closeConfirmDialog(false));

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeConfirmDialog(false);
      }
    });
  }

  /**
   * Show accessible confirm dialog
   * @param {string} message - The confirmation message
   * @param {string} title - Optional title
   * @returns {Promise<boolean>}
   */
  showConfirmDialog(message, title = 'Confirm') {
    return new Promise((resolve) => {
      const dialog = document.getElementById('authConfirmDialog');
      const titleEl = dialog.querySelector('#authConfirmTitle');
      const messageEl = dialog.querySelector('#authConfirmMessage');
      const okBtn = dialog.querySelector('[data-confirm-ok]');

      titleEl.textContent = title;
      messageEl.textContent = message;
      
      dialog.classList.add('is-open');
      dialog.setAttribute('aria-hidden', 'false');
      
      this.pendingConfirmCallback = resolve;
      okBtn.focus();
    });
  }

  /**
   * Close confirm dialog
   * @param {boolean} confirmed
   */
  closeConfirmDialog(confirmed) {
    const dialog = document.getElementById('authConfirmDialog');
    dialog.classList.remove('is-open');
    dialog.setAttribute('aria-hidden', 'true');
    
    if (this.pendingConfirmCallback) {
      this.pendingConfirmCallback(confirmed);
      this.pendingConfirmCallback = null;
    }
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Logout buttons
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleLogout(e));
    });

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
    }

    // Change password form
    const passwordForm = document.getElementById('changePasswordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
    }
  }

  /**
   * Check authentication state on page load
   */
  async checkAuthState() {
    if (userModel.isLoggedIn()) {
      try {
        await userModel.getCurrentUser();
        this.updateUIForLoggedInUser();
        
        // Load cart if user is logged in
        if (typeof cartModel !== 'undefined') {
          await cartModel.getCart();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        userModel.logout();
      }
    } else {
      this.updateUIForLoggedOutUser();
    }
  }

  /**
   * Handle login form submission
   */
  async handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');


    // Clear previous errors
    this.clearFormError(form);
    
    // Disable submit button
    this.setButtonLoading(submitButton, true);

    try {
      const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      const response = await userModel.login(credentials);

      // Check if admin user based on server-provided role
      if (response && response.user && (response.user.role === 'admin' || response.user.isAdmin === true)) {
        // Redirect to admin panel
        window.location.href = '/pages/admin.html';
      } else {
        // Redirect to home or previous page
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
        window.location.href = redirectUrl;
      }
      // Note: Notification removed as redirect happens immediately

    } catch (error) {
      this.showFormError(form, error.message);
    } finally {
      this.setButtonLoading(submitButton, false);
    }
  }

  /**
   * Handle register form submission
   */
  async handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');

    // Clear previous errors
    this.clearFormError(form);
    
    // Validate passwords match
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
      this.showFormError(form, 'Passwords do not match');
      return;
    }

    // Disable submit button
    this.setButtonLoading(submitButton, true);

    try {
      const userData = {
        email: formData.get('email'),
        password: password,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phoneNumber: formData.get('phoneNumber')
      };

      await userModel.register(userData);

      // Store success message to show after redirect
      sessionStorage.setItem('authMessage', JSON.stringify({
        message: 'Registration successful! Welcome to Chandni Jewellery!',
        type: 'success'
      }));
      
      // Redirect to destination
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
      window.location.href = redirectUrl;

    } catch (error) {
      this.showFormError(form, error.message);
    } finally {
      this.setButtonLoading(submitButton, false);
    }
  }

  /**
   * Handle logout
   */
  async handleLogout(event) {
    event.preventDefault();
    
    const confirmed = await this.showConfirmDialog('Are you sure you want to logout?', 'Logout');
    if (confirmed) {
      await userModel.logout();
    }
  }

  /**
   * Handle profile update
   */
  async handleProfileUpdate(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');

    this.clearFormError(form);
    this.setButtonLoading(submitButton, true);

    try {
      const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phoneNumber: formData.get('phoneNumber'),
        email: formData.get('email')
      };

      await userModel.updateProfile(userData);
      this.showNotification('Profile updated successfully!', 'success');

    } catch (error) {
      this.showFormError(form, error.message);
    } finally {
      this.setButtonLoading(submitButton, false);
    }
  }

  /**
   * Handle password change
   */
  async handlePasswordChange(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');

    this.clearFormError(form);

    // Validate new passwords match
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    if (newPassword !== confirmPassword) {
      this.showFormError(form, 'New passwords do not match');
      return;
    }

    this.setButtonLoading(submitButton, true);

    try {
      const passwordData = {
        currentPassword: formData.get('currentPassword'),
        newPassword: newPassword
      };

      await userModel.changePassword(passwordData);
      this.showNotification('Password changed successfully!', 'success');
      form.reset();

    } catch (error) {
      this.showFormError(form, error.message);
    } finally {
      this.setButtonLoading(submitButton, false);
    }
  }

  /**
   * Update UI for logged in user
   */
  updateUIForLoggedInUser() {
    // Hide login/register links
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => link.classList.add('is-hidden'));

    // Show user menu
    const userMenus = document.querySelectorAll('.user-menu');
    userMenus.forEach(menu => menu.classList.remove('is-hidden'));

    // Update user name if available
    if (userModel.currentUser) {
      const userNameElements = document.querySelectorAll('.user-name');
      userNameElements.forEach(element => {
        element.textContent = userModel.currentUser.firstName || userModel.currentUser.email;
      });
    }
  }

  /**
   * Update UI for logged out user
   */
  updateUIForLoggedOutUser() {
    // Show login/register links
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => link.classList.remove('is-hidden'));

    // Hide user menu
    const userMenus = document.querySelectorAll('.user-menu');
    userMenus.forEach(menu => menu.classList.add('is-hidden'));
  }

  /**
   * Show form error
   */
  showFormError(form, message) {
    let errorElement = form.querySelector('.form-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error is-hidden';
      form.insertBefore(errorElement, form.firstChild);
    }
    errorElement.textContent = message;
    errorElement.classList.remove('is-hidden');
  }

  /**
   * Clear form error
   */
  clearFormError(form) {
    const errorElement = form.querySelector('.form-error');
    if (errorElement) {
      errorElement.classList.add('is-hidden');
    }
  }

  /**
   * Set button loading state
   */
  setButtonLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.innerHTML = `
        <span class="loading-spinner"></span>
        Loading...
      `;
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'Submit';
    }
  }

  /**
   * Show notification
   * @param {string} message - Message to display (will be safely escaped)
   * @param {string} type - Notification type: 'info', 'success', 'error', 'warning'
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Build notification structure safely without innerHTML for user content
    const content = document.createElement('div');
    content.className = 'notification__content';
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification__message';
    messageSpan.textContent = message; // Safe: uses textContent to prevent XSS
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification__close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    
    content.appendChild(messageSpan);
    content.appendChild(closeBtn);
    notification.appendChild(content);

    document.body.appendChild(notification);

    // Add close functionality (closeBtn already defined above)
    closeBtn.addEventListener('click', () => notification.remove());

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 4000);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      notification.classList.add('is-visible');
    });
  }

  /**
   * Redirect to login if not authenticated
   */
  requireAuth() {
    if (!userModel.isLoggedIn()) {
      const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/pages/login.html?redirect=${currentUrl}`;
      return false;
    }
    return true;
  }

  /**
   * Redirect to home if not admin
   */
  requireAdmin() {
    if (!userModel.isAdmin()) {
      window.location.href = '/';
      return false;
    }
    return true;
  }
}

// Create singleton instance
export const authController = new AuthController();