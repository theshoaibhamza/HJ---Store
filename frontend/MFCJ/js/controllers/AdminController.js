/**
 * =====================================================
 * CHANDNI JEWELLERY - Admin Controller
 * =====================================================
 */

import { apiService } from '../services/ApiService.js';
import { productModel } from '../models/ProductModel.js';
import { orderModel } from '../models/OrderModel.js';
import { userModel } from '../models/UserModel.js';

export class AdminController {
  constructor() {
    this.currentSection = 'dashboard';
    this.dashboardStats = {};
    this.pendingConfirmCallback = null; // For custom confirm dialog
  }

  /**
   * Initialize admin controller
   */
  init() {
    this.initEventListeners();
    this.initSidebar();
    this.loadDashboard();
    this.createConfirmDialog();
  }

  /**
   * Create accessible confirm dialog
   */
  createConfirmDialog() {
    // Check if dialog already exists
    if (document.getElementById('confirmDialog')) return;

    const dialog = document.createElement('div');
    dialog.id = 'confirmDialog';
    dialog.className = 'confirm-dialog';
    dialog.setAttribute('role', 'alertdialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'confirmDialogTitle');
    dialog.setAttribute('aria-describedby', 'confirmDialogMessage');
    dialog.setAttribute('aria-hidden', 'true');
    dialog.innerHTML = `
      <div class="confirm-dialog__overlay"></div>
      <div class="confirm-dialog__content" role="document">
        <h2 id="confirmDialogTitle" class="confirm-dialog__title">Confirm Action</h2>
        <p id="confirmDialogMessage" class="confirm-dialog__message"></p>
        <div class="confirm-dialog__actions">
          <button type="button" class="btn btn--secondary" data-confirm-cancel>Cancel</button>
          <button type="button" class="btn btn--danger" data-confirm-ok>Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    // Add dialog styles if not present
    if (!document.getElementById('confirmDialogStyles')) {
      const styles = document.createElement('style');
      styles.id = 'confirmDialogStyles';
      styles.textContent = `
        .confirm-dialog {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 9999;
        }
        .confirm-dialog.is-open {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .confirm-dialog__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        .confirm-dialog__content {
          position: relative;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        .confirm-dialog__title {
          margin: 0 0 1rem;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .confirm-dialog__message {
          margin: 0 0 1.5rem;
          color: #666;
        }
        .confirm-dialog__actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
      `;
      document.head.appendChild(styles);
    }

    // Bind dialog events
    const cancelBtn = dialog.querySelector('[data-confirm-cancel]');
    const okBtn = dialog.querySelector('[data-confirm-ok]');
    const overlay = dialog.querySelector('.confirm-dialog__overlay');

    cancelBtn.addEventListener('click', () => this.closeConfirmDialog(false));
    okBtn.addEventListener('click', () => this.closeConfirmDialog(true));
    overlay.addEventListener('click', () => this.closeConfirmDialog(false));

    // Handle escape key
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
  showConfirmDialog(message, title = 'Confirm Action') {
    return new Promise((resolve) => {
      const dialog = document.getElementById('confirmDialog');
      const titleEl = dialog.querySelector('#confirmDialogTitle');
      const messageEl = dialog.querySelector('#confirmDialogMessage');
      const okBtn = dialog.querySelector('[data-confirm-ok]');

      titleEl.textContent = title;
      messageEl.textContent = message;
      
      dialog.classList.add('is-open');
      dialog.setAttribute('aria-hidden', 'false');
      
      // Store callback and focus the confirm button
      this.pendingConfirmCallback = resolve;
      okBtn.focus();
    });
  }

  /**
   * Close confirm dialog
   * @param {boolean} confirmed
   */
  closeConfirmDialog(confirmed) {
    const dialog = document.getElementById('confirmDialog');
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
    // Sidebar navigation
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavigation(e));
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }
    
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => this.closeSidebar());
    }

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => this.showAddProductModal());
    }

    // Add promo code button
    const addPromoBtn = document.getElementById('addPromoBtn');
    if (addPromoBtn) {
      addPromoBtn.addEventListener('click', () => this.showAddPromoModal());
    }

    // Use event delegation for form submissions - MUCH MORE RELIABLE
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'addProductForm') {
        console.log('🟡 Form submit delegated event detected');
        this.handleAddProduct(e);
      }
      if (e.target.id === 'addPromoForm') {
        console.log('🟡 Promo form submit delegated event detected');
        this.handleAddPromo(e);
      }
    });

    // Global click handlers using event delegation
    document.addEventListener('click', (e) => {
      // Order status update
      if (e.target.matches('[data-update-order-status]')) {
        this.handleOrderStatusUpdate(e);
      }
      
      // Delete product
      if (e.target.matches('[data-delete-product]')) {
        this.handleDeleteProduct(e);
      }
      
      // Delete promo code
      if (e.target.matches('[data-delete-promo]')) {
        this.handleDeletePromo(e);
      }

      // View product (using event delegation instead of inline onclick)
      if (e.target.matches('[data-view-product]')) {
        const productId = e.target.dataset.viewProduct;
        window.open(`/pages/product.html?id=${productId}`, '_blank');
      }
    });

    // Track previous values for select elements
    document.addEventListener('focus', (e) => {
      if (e.target.matches('[data-update-order-status]')) {
        e.target.dataset.previousValue = e.target.value;
      }
    }, true);
  }

  /**
   * Initialize sidebar
   */
  initSidebar() {
    // Auto-open sidebar on desktop
    if (window.innerWidth > 768) {
      this.openSidebar();
    }

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.openSidebar();
      } else {
        this.closeSidebar();
      }
    });
  }

  /**
   * Handle navigation
   */
  handleNavigation(event) {
    event.preventDefault();
    
    const section = event.target.dataset.section;
    if (!section || section === this.currentSection) return;

    // Update nav state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('is-active');
    });
    event.target.classList.add('is-active');

    // Hide current section
    document.querySelectorAll('.content-section').forEach(sectionElement => {
      sectionElement.classList.remove('is-active');
    });

    // Show new section
    const newSection = document.getElementById(section);
    if (newSection) {
      newSection.classList.add('is-active');
    }

    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      pageTitle.textContent = this.getSectionTitle(section);
    }

    this.currentSection = section;

    // Load section data
    this.loadSectionData(section);

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

  /**
   * Get section title
   */
  getSectionTitle(section) {
    const titles = {
      dashboard: 'Dashboard',
      products: 'Products',
      orders: 'Orders',
      users: 'Users',
      promocodes: 'Promo Codes'
    };
    return titles[section] || 'Admin Panel';
  }

  /**
   * Load section data
   */
  loadSectionData(section) {
    switch (section) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'products':
        this.loadProducts();
        break;
      case 'orders':
        this.loadOrders();
        break;
      case 'users':
        this.loadUsers();
        break;
      case 'promocodes':
        this.loadPromoCodes();
        break;
    }
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.getElementById('adminMain');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar.classList.contains('is-open')) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  /**
   * Open sidebar
   */
  openSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.getElementById('adminMain');
    const overlay = document.getElementById('sidebarOverlay');

    sidebar.classList.add('is-open');
    
    if (window.innerWidth > 768) {
      main.classList.add('sidebar-open');
    } else {
      overlay.classList.add('is-visible');
    }
  }

  /**
   * Close sidebar
   */
  closeSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.getElementById('adminMain');
    const overlay = document.getElementById('sidebarOverlay');

    sidebar.classList.remove('is-open');
    main.classList.remove('sidebar-open');
    overlay.classList.remove('is-visible');
  }

  /**
   * Load dashboard data
   */
  async loadDashboard() {
    try {
      // Load stats
      const [orderStats, userStats] = await Promise.all([
        orderModel.getOrderStats(),
        this.getUserStats()
      ]);

      // Update stats cards
      this.updateStatsCards({
        totalProducts: orderStats.totalProducts || 0,
        totalOrders: orderStats.totalOrders || 0,
        totalUsers: userStats.totalUsers || 0,
        totalRevenue: orderStats.totalRevenue || 0
      });

      // Load recent orders
      this.loadRecentOrders();

    } catch (error) {
      console.error('Load dashboard error:', error);
    }
  }

  /**
   * Update stats cards
   */
  updateStatsCards(stats) {
    const totalProducts = document.getElementById('totalProducts');
    const totalOrders = document.getElementById('totalOrders');
    const totalUsers = document.getElementById('totalUsers');
    const totalRevenue = document.getElementById('totalRevenue');

    if (totalProducts) totalProducts.textContent = stats.totalProducts;
    if (totalOrders) totalOrders.textContent = stats.totalOrders;
    if (totalUsers) totalUsers.textContent = stats.totalUsers;
    if (totalRevenue) totalRevenue.textContent = `₨${stats.totalRevenue.toLocaleString()}`;
  }

  /**
   * Load recent orders
   */
  async loadRecentOrders() {
    try {
      const container = document.getElementById('recentOrdersTable');
      if (!container) return;

      const response = await orderModel.getAllOrders(1, 5);
      
      if (response.orders && response.orders.length > 0) {
        container.innerHTML = this.renderOrdersTable(response.orders, true);
      } else {
        container.innerHTML = '<p style="padding: 2rem; text-align: center;">No recent orders</p>';
      }

    } catch (error) {
      console.error('Load recent orders error:', error);
      const container = document.getElementById('recentOrdersTable');
      if (container) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: #dc3545;">Failed to load recent orders</p>';
      }
    }
  }

  /**
   * Load products
   */
  async loadProducts() {
    try {
      const container = document.getElementById('productsTable');
      if (!container) return;

      container.innerHTML = this.getLoadingHTML('Loading products...');

      const response = await productModel.getProducts({ limit: 50 });
      
      if (response.products && response.products.length > 0) {
        container.innerHTML = this.renderProductsTable(response.products);
      } else {
        container.innerHTML = '<p style="padding: 2rem; text-align: center;">No products found</p>';
      }

    } catch (error) {
      console.error('Load products error:', error);
      const container = document.getElementById('productsTable');
      if (container) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: #dc3545;">Failed to load products</p>';
      }
    }
  }

  /**
   * Load orders
   */
  async loadOrders() {
    try {
      const container = document.getElementById('ordersTable');
      if (!container) return;

      container.innerHTML = this.getLoadingHTML('Loading orders...');

      const response = await orderModel.getAllOrders();
      
      if (response.orders && response.orders.length > 0) {
        container.innerHTML = this.renderOrdersTable(response.orders);
      } else {
        container.innerHTML = '<p style="padding: 2rem; text-align: center;">No orders found</p>';
      }

    } catch (error) {
      console.error('Load orders error:', error);
      const container = document.getElementById('ordersTable');
      if (container) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: #dc3545;">Failed to load orders</p>';
      }
    }
  }

  /**
   * Load users
   */
  async loadUsers() {
    try {
      const container = document.getElementById('usersTable');
      if (!container) return;

      container.innerHTML = this.getLoadingHTML('Loading users...');

      const response = await apiService.get('/users');
      
      if (response.users && response.users.length > 0) {
        container.innerHTML = this.renderUsersTable(response.users);
      } else {
        container.innerHTML = '<p style="padding: 2rem; text-align: center;">No users found</p>';
      }

    } catch (error) {
      console.error('Load users error:', error);
      const container = document.getElementById('usersTable');
      if (container) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: #dc3545;">Failed to load users</p>';
      }
    }
  }

  /**
   * Load promo codes
   */
  async loadPromoCodes() {
    try {
      const container = document.getElementById('promocodesTable');
      if (!container) return;

      container.innerHTML = this.getLoadingHTML('Loading promo codes...');

      const response = await apiService.get('/promocodes/admin');
      
      if (response.promoCodes && response.promoCodes.length > 0) {
        container.innerHTML = this.renderPromoCodesTable(response.promoCodes);
      } else {
        container.innerHTML = '<p style="padding: 2rem; text-align: center;">No promo codes found</p>';
      }

    } catch (error) {
      console.error('Load promo codes error:', error);
      const container = document.getElementById('promocodesTable');
      if (container) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: #dc3545;">Failed to load promo codes</p>';
      }
    }
  }

  /**
   * Render products table
   */
  renderProductsTable(products) {
    return `
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(product => `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <img src="${this.escapeHtml(product.image_url[0] || '/assets/images/placeholder.jpg')}" 
                       alt="${this.escapeHtml(product.title)}"
                       style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                  <div>
                    <div style="font-weight: 500;">${this.escapeHtml(product.title)}</div>
                    <div style="font-size: 0.875rem; color: #6c757d;">${this.escapeHtml(product._id)}</div>
                  </div>
                </div>
              </td>
              <td>₨${product.price.toLocaleString()}</td>
              <td>${this.escapeHtml(product.category)}</td>
              <td>${product.quantity}</td>
              <td>
                <span class="status-badge ${product.quantity > 0 ? 'status--confirmed' : 'status--cancelled'}">
                  ${product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn--secondary btn--small" data-view-product="${this.escapeHtml(product._id)}">
                    View
                  </button>
                  <button class="btn btn--danger btn--small" data-delete-product="${this.escapeHtml(product._id)}">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Render orders table
   */
  renderOrdersTable(orders, isRecent = false) {
    return `
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            ${!isRecent ? '<th>Actions</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${orders.map(order => `
            <tr>
              <td style="font-family: monospace; font-weight: 500;">#${order._id.slice(-6).toUpperCase()}</td>
              <td>${order.shippingInfo.fname} ${order.shippingInfo.lname}</td>
              <td>₨${order.totalAmount.toLocaleString()}</td>
              <td>
                <span class="status-badge ${orderModel.getOrderStatusClass(order.orderStatus)}">
                  ${orderModel.getOrderStatusText(order.orderStatus)}
                </span>
              </td>
              <td>${orderModel.formatOrderDate(order.createdAt)}</td>
              ${!isRecent ? `
                <td>
                  <select class="form-select" data-update-order-status="${order._id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
                    <option value="pending" ${order.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${order.orderStatus === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="processing" ${order.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                  </select>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Render users table
   */
  renderUsersTable(users) {
    return `
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>
                <div>
                  <div style="font-weight: 500;">${user.firstName} ${user.lastName}</div>
                  <div style="font-size: 0.875rem; color: #6c757d;">${user._id}</div>
                </div>
              </td>
              <td>${user.email}</td>
              <td>
                <span class="status-badge ${user.role === 'admin' ? 'status--shipped' : 'status--confirmed'}">
                  ${user.role}
                </span>
              </td>
              <td>${new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <span class="status-badge ${user.isActive ? 'status--confirmed' : 'status--cancelled'}">
                  ${user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Render promo codes table
   */
  renderPromoCodesTable(promoCodes) {
    return `
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Min Order</th>
            <th>Uses</th>
            <th>Expires</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${promoCodes.map(promo => `
            <tr>
              <td style="font-family: monospace; font-weight: 500;">${promo.code}</td>
              <td>${promo.discountType === 'percentage' ? `${promo.discountValue}%` : `₨${promo.discountValue}`}</td>
              <td>₨${promo.minOrderAmount}</td>
              <td>${promo.usedCount}/${promo.maxUses || '∞'}</td>
              <td>${promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : 'Never'}</td>
              <td>
                <span class="status-badge ${promo.isActive ? 'status--confirmed' : 'status--cancelled'}">
                  ${promo.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <button class="btn btn--danger btn--small" data-delete-promo="${promo._id}">
                  Delete
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Handle order status update
   */
  async handleOrderStatusUpdate(event) {
    const orderId = event.target.dataset.updateOrderStatus;
    const newStatus = event.target.value;
    const previousStatus = event.target.dataset.previousValue || event.target.options[0].value;

    try {
      await orderModel.updateOrderStatus(orderId, newStatus);
      // Update stored previous value on success
      event.target.dataset.previousValue = newStatus;
      this.showNotification('Order status updated successfully', 'success');
    } catch (error) {
      console.error('Update order status error:', error);
      this.showNotification('Failed to update order status', 'error');
      // Restore previous value on error
      event.target.value = previousStatus;
    }
  }

  /**
   * Handle delete product
   */
  async handleDeleteProduct(event) {
    const productId = event.target.dataset.deleteProduct;
    
    const confirmed = await this.showConfirmDialog(
      'Are you sure you want to delete this product? This action cannot be undone.',
      'Delete Product'
    );
    
    if (!confirmed) {
      return;
    }

    try {
      await productModel.deleteProduct(productId);
      this.showNotification('Product deleted successfully', 'success');
      this.loadProducts(); // Reload products table
    } catch (error) {
      console.error('Delete product error:', error);
      this.showNotification('Failed to delete product', 'error');
    }
  }

  /**
   * Handle delete promo code
   */
  async handleDeletePromo(event) {
    const promoId = event.target.dataset.deletePromo;
    
    const confirmed = await this.showConfirmDialog(
      'Are you sure you want to delete this promo code? This action cannot be undone.',
      'Delete Promo Code'
    );
    
    if (!confirmed) {
      return;
    }

    try {
      await apiService.delete(`/promocodes/${promoId}`);
      this.showNotification('Promo code deleted successfully', 'success');
      this.loadPromoCodes(); // Reload promo codes table
    } catch (error) {
      console.error('Delete promo code error:', error);
      this.showNotification('Failed to delete promo code', 'error');
    }
  }

  /**
   * Show add product modal
   */
  showAddProductModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('addProductModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'addProductModal';
      modal.className = 'admin-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'addProductModalTitle');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = `
        <div class="admin-modal__overlay" data-modal-close></div>
        <div class="admin-modal__content">
          <div class="admin-modal__header">
            <h2 id="addProductModalTitle" class="admin-modal__title">Add New Product</h2>
            <button type="button" class="admin-modal__close" data-modal-close aria-label="Close modal">&times;</button>
          </div>
          <form id="addProductForm" class="admin-modal__body">
            <div class="form-group">
              <label for="productTitle">Product Title *</label>
              <input type="text" id="productTitle" name="title" required class="form-input">
            </div>
            <div class="form-group">
              <label for="productPrice">Price (₨) *</label>
              <input type="number" id="productPrice" name="price" required min="0" class="form-input">
            </div>
            <div class="form-group">
              <label for="productCategory">Category *</label>
              <select id="productCategory" name="category" required class="form-select">
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Beauty">Beauty</option>
                <option value="Health">Health</option>
                <option value="Automotive">Automotive</option>
                <option value="Toys">Toys</option>
                <option value="Food">Food</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="productQuantity">Quantity *</label>
              <input type="number" id="productQuantity" name="quantity" required min="0" class="form-input">
            </div>
            <div class="form-group">
              <label for="productDescription">Description *</label>
              <textarea id="productDescription" name="description" rows="4" class="form-textarea" required></textarea>
            </div>
            <div class="form-group">
              <label for="productImage">Image URL *</label>
              <input type="url" id="productImage" name="image_url" class="form-input" placeholder="https://example.com/image.jpg" required>
            </div>
            <div class="admin-modal__actions">
              <button type="button" class="btn btn--secondary" data-modal-close>Cancel</button>
              <button type="submit" class="btn btn--primary">Add Product</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      // Add modal styles if not present
      this.addModalStyles();

      // Bind close buttons
      modal.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => this.closeModal(modal));
      });

      // Close on escape
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeModal(modal);
      });
    } else {
      // Reset form if modal already exists
      const form = modal.querySelector('#addProductForm');
      if (form) {
        form.reset();
      }
    }

    // Note: Form submit is now handled via event delegation in initEventListeners
    this.openModal(modal);
  }

  /**
   * Show add promo code modal
   */
  showAddPromoModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('addPromoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'addPromoModal';
      modal.className = 'admin-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'addPromoModalTitle');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = `
        <div class="admin-modal__overlay" data-modal-close></div>
        <div class="admin-modal__content">
          <div class="admin-modal__header">
            <h2 id="addPromoModalTitle" class="admin-modal__title">Add New Promo Code</h2>
            <button type="button" class="admin-modal__close" data-modal-close aria-label="Close modal">&times;</button>
          </div>
          <form id="addPromoForm" class="admin-modal__body">
            <div class="form-group">
              <label for="promoCode">Promo Code *</label>
              <input type="text" id="promoCode" name="code" required class="form-input" placeholder="e.g., SAVE10">
            </div>
            <div class="form-group">
              <label for="discountType">Discount Type *</label>
              <select id="discountType" name="discountType" required class="form-select">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₨)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="discountValue">Discount Value *</label>
              <input type="number" id="discountValue" name="discountValue" required min="0" class="form-input">
            </div>
            <div class="form-group">
              <label for="minOrderAmount">Minimum Order Amount (₨)</label>
              <input type="number" id="minOrderAmount" name="minOrderAmount" min="0" value="0" class="form-input">
            </div>
            <div class="form-group">
              <label for="maxUses">Maximum Uses (leave empty for unlimited)</label>
              <input type="number" id="maxUses" name="maxUses" min="1" class="form-input">
            </div>
            <div class="form-group">
              <label for="expiresAt">Expiry Date (optional)</label>
              <input type="date" id="expiresAt" name="expiresAt" class="form-input">
            </div>
            <div class="admin-modal__actions">
              <button type="button" class="btn btn--secondary" data-modal-close>Cancel</button>
              <button type="submit" class="btn btn--primary">Add Promo Code</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      // Add modal styles if not present
      this.addModalStyles();

      // Bind close buttons
      modal.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => this.closeModal(modal));
      });

      // Close on escape
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeModal(modal);
      });
    } else {
      // Reset form if modal already exists
      const form = modal.querySelector('#addPromoForm');
      if (form) {
        form.reset();
      }
    }

    // Note: Form submit is now handled via event delegation in initEventListeners
    this.openModal(modal);
  }

  /**
   * Handle add product form submission
   */
  async handleAddProduct(event) {
    console.log('🟢 handleAddProduct called', event);
    event.preventDefault();
    console.log('🟢 Form submission prevented');
    
    const form = event.target;
    console.log('🟢 Form element:', form);
    
    // Get form values
    const title = form.querySelector('#productTitle').value.trim();
    const price = parseFloat(form.querySelector('#productPrice').value);
    const category = form.querySelector('#productCategory').value;
    const quantity = parseInt(form.querySelector('#productQuantity').value);
    const description = form.querySelector('#productDescription').value.trim();
    const imageUrl = form.querySelector('#productImage').value.trim();

    console.log('🟢 Form values:', { title, price, category, quantity, description, imageUrl });

    // Validate before sending
    if (!title || !price || !category || quantity < 0 || !description) {
      console.warn('❌ Validation failed: missing required fields');
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (!imageUrl) {
      console.warn('❌ Validation failed: no image URL');
      this.showNotification('Please provide an image URL', 'error');
      return;
    }

    const productData = {
      title: title,
      price: price,
      category: category,
      quantity: quantity,
      description: description,
      image_url: [imageUrl]  // Must be an array
    };

    console.log('📋 Sending product data:', productData);

    try {
      const response = await apiService.post('/products', productData);
      console.log('✅ Product created:', response);
      this.showNotification('Product added successfully', 'success');
      this.closeModal(document.getElementById('addProductModal'));
      form.reset();
      this.loadProducts();
    } catch (error) {
      console.error('❌ Add product error:', error);
      const errorMessage = error.message || 'Unknown error';
      this.showNotification('Failed to add product: ' + errorMessage, 'error');
    }
  }

  /**
   * Handle add promo form submission
   */
  async handleAddPromo(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const promoData = {
      code: formData.get('code').toUpperCase(),
      discountType: formData.get('discountType'),
      discountValue: Number(formData.get('discountValue')),
      minOrderAmount: Number(formData.get('minOrderAmount')) || 0,
      maxUses: formData.get('maxUses') ? Number(formData.get('maxUses')) : null,
      expiresAt: formData.get('expiresAt') || null,
      isActive: true
    };

    try {
      await apiService.post('/promocodes', promoData);
      this.showNotification('Promo code added successfully', 'success');
      this.closeModal(document.getElementById('addPromoModal'));
      form.reset();
      this.loadPromoCodes();
    } catch (error) {
      console.error('Add promo code error:', error);
      this.showNotification('Failed to add promo code', 'error');
    }
  }

  /**
   * Open modal
   */
  openModal(modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  /**
   * Close modal
   */
  closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * Add modal styles
   */
  addModalStyles() {
    if (document.getElementById('adminModalStyles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'adminModalStyles';
    styles.textContent = `
      .admin-modal {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9998;
      }
      .admin-modal.is-open {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .admin-modal__overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
      }
      .admin-modal__content {
        position: relative;
        background: white;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }
      .admin-modal__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
      }
      .admin-modal__title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
      }
      .admin-modal__close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem;
        line-height: 1;
        color: #666;
      }
      .admin-modal__close:hover {
        color: #333;
      }
      .admin-modal__body {
        padding: 1.5rem;
      }
      .admin-modal__actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e9ecef;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        font-size: 0.875rem;
      }
      .form-input,
      .form-select,
      .form-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 0.875rem;
      }
      .form-input:focus,
      .form-select:focus,
      .form-textarea:focus {
        outline: none;
        border-color: #6d4e35;
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Get user stats
   */
  async getUserStats() {
    try {
      const response = await apiService.get('/users/admin/stats');
      return response;
    } catch (error) {
      console.error('Get user stats error:', error);
      return { totalUsers: 0 };
    }
  }

  /**
   * Get loading HTML
   */
  getLoadingHTML(text = 'Loading...') {
    return `
      <div class="loading">
        <div class="loading-spinner"></div>
        ${text}
      </div>
    `;
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__message"></span>
        <button class="notification__close" aria-label="Close notification">×</button>
      </div>
    `;

    document.body.appendChild(notification);

    const messageEl = notification.querySelector('.notification__message');
    if (messageEl) {
      messageEl.textContent = message;
    }
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => notification.remove());

    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 4000);

    requestAnimationFrame(() => {
      notification.classList.add('is-visible');
    });
  }
}

// Export for use in admin.html
window.AdminController = AdminController;