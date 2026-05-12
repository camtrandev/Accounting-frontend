import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

// Import Routes theo Module
import authRoutes from './auth.routes';
import inventoryRoutes from './inventory.routes';

const routes = [
  ...authRoutes,
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/modules/dashboard/pages/DashboardPage.vue')
      },
      {
        path: 'master-data',
        name: 'MasterData',
        component: () => import('@/modules/master-data/pages/MasterDataPage.vue')
      },
      // Phân hệ Chứng từ (Viết trực tiếp hoặc tách file tùy độ lớn)
      {
        path: 'voucher',
        name: 'Document',
        component: () => import('@/modules/vouchers/pages/documentPage.vue')
      },
      {
        path: 'vouchers/purchase',
        name: 'DocumentPurchase',
        component: () => import('@/modules/vouchers/pages/PurchaseInvoicePage.vue')
      },
      {
        path: 'vouchers/sale',
        name: 'DocumentSale',
        component: () => import('@/modules/vouchers/pages/SaleInvoicePage.vue')
      },
      {
        path: 'vouchers/receipt',
        name: 'DocumentReceipt',
        component: () => import('@/modules/vouchers/pages/ReceiptVoucherPage.vue')
      },

      {
        path: 'vouchers/payment',
        name: 'DocumentPayment',
        component: () => import('@/modules/vouchers/pages/PaymentVoucherPage.vue')
      },


      // Gộp các route từ module Kho
      ...inventoryRoutes,

      // Phân hệ Báo cáo & Sổ cái
      {
        path: 'reports',
        name: 'ReportDashboard',
        component: () => import('@/modules/reports/pages/ReportDashboard.vue')
      },
      {
        path: 'ledger',
        name: 'LedgerPage',
        component: () => import('@/modules/ledger/pages/LedgerPage.vue')
      },

      // THÊM ROUTE PHÂN QUYỀN VÀO ĐÂY
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/modules/auth/pages/Permission.vue'), // Bạn hãy tạo file này
        meta: { requiresAuth: true, role: 'Admin' } // Chỉ Admin mới vào được
      },

    ]
  },
  // Catch-all route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Middleware Bảo vệ Router
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isLoggedIn;

  if (to.meta.requiresAuth && !isAuthenticated) {
    authStore.returnUrl = to.fullPath;
    return '/login';
  }

  if (to.path === '/login' && isAuthenticated) {
    return '/';
  }

  return true;
});

export default router;