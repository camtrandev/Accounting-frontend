import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store' // Import store để check token

// Import Layouts
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

// Import Pages
import Dashboard from '@/modules/dashboard/pages/DashboardPage.vue'
import MasterDataPage from '@/modules/master-data/pages/MasterDataPage.vue'
import documentPage from '@/modules/vouchers/pages/documentPage.vue'
import DocumentPurchase from '@/modules/vouchers/components/page/documentPurchase.vue'

// phần kho
import InventoryDashboard from '@/modules/inventory/pages/InventoryDashboard.vue'
import ReceiptFormPage from '@/modules/inventory/pages/ReceiptFormPage.vue'
import IssueFormPage from '@/modules/inventory/pages/IssueFormPage.vue'


const routes = [
  // 1. Tuyến đường Đăng nhập (Sử dụng AuthLayout trống)
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/modules/auth/pages/Login.vue') // Lazy load trang Login
      }
    ],
    meta: { requiresAuth: false } // Không yêu cầu đăng nhập
  },

  // 2. Các tuyến đường chính của ứng dụng (Sử dụng MainLayout)
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true }, //  Yêu cầu CÓ TOKEN mới được vào
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'master-data',
        name: 'MasterData',
        component: MasterDataPage
      },

      //Chứng từ
      {
        path: 'voucher',
        name: 'Document',
        component: documentPage
      },
      {
        path: 'vouchers/purchase',
        name: 'DocumentPurchase',
        component: DocumentPurchase
      },

      // phần kho
      {
        path: 'inventory',
        name: 'InventoryDashboard',
        component: InventoryDashboard
      },

      {
        path: 'receipt/create', // URL: /inventory/receipt/create
        name: 'InventoryReceiptCreate',
        component: ReceiptFormPage
      },
      // Sau này nếu có làm chức năng Sửa phiếu nhập, bạn thêm ở đây:
      // {
      //   path: 'receipt/edit/:id',
      //   name: 'InventoryReceiptEdit',
      //   component: ReceiptFormPage
      // },

      // ==========================================
      // NHÓM 2: PHIẾU XUẤT KHO (ISSUE)
      // ==========================================
      {
        path: 'issue/create', // URL: /inventory/issue/create
        name: 'InventoryIssueCreate',
        component: IssueFormPage
      },
      // 3. KIỂM KÊ KHO
      {
        path: 'check',
        name: 'InventoryCheck',
        component: () => import('../modules/inventory/pages/InventoryCheckPage.vue')
      },
      // 4. TÍNH GIÁ XUẤT KHO
      {
        path: 'costing',
        name: 'InventoryCosting',
        component: () => import('../modules/inventory/pages/InventoryCostingPage.vue')
      },
      // 5. PHIẾU CHUYỂN KHO
      {
        path: 'transfer',
        name: 'InventoryTransfer', // Tên này khớp 100% với tên trong InventoryQuickActions.vue
        component: () => import('../modules/inventory/pages/InventoryTransferPage.vue')
      },

      // Trang Báo cáo
      {
        path: '/reports',
        
        children: [
          {
            path: '',
            name: 'ReportDashboard',
            component: () => import('../modules/reports/pages/ReportDashboard.vue')
          }
          // Sau này nếu có làm trang chi tiết cho từng báo cáo, bạn sẽ thêm vào đây.
          // Ví dụ:
          // {
          //   path: 'inventory-summary',
          //   name: 'ReportInventorySummary',
          //   component: () => import('../modules/reports/pages/InventorySummaryReport.vue')
          // }
        ]
      },
      
      // THÊM ROUTE PHÂN QUYỀN VÀO ĐÂY
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/modules/auth/pages/Permission.vue'), // Bạn hãy tạo file này
        meta: { requiresAuth: true, role: 'Admin' } // Chỉ Admin mới vào được
      },

      {
        path: '/ledger',
        
        children: [
          {
            path: '',
            name: 'LedgerPage',
            component: () => import('../modules/ledger/pages/LedgerPage.vue')
          }
          // Sau này nếu có làm trang chi tiết cho từng sổ cái , bạn sẽ thêm vào đây.
          // Ví dụ:
          // {
          //   path: 'inventory-summary',
          //   name: 'ReportInventorySummary',
          //   component: () => import('../modules/reports/pages/InventorySummaryReport.vue')
          // }
        ]
      },

    ]
  },

  // 3. Chuyển hướng các URL không tồn tại về trang chủ
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// BẢO VỆ ROUTER TRƯỚC KHI CHUYỂN TRANG
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isLoggedIn

  // Nếu trang yêu cầu đăng nhập mà người dùng chưa đăng nhập
  if (to.meta.requiresAuth && !isAuthenticated) {
    authStore.returnUrl = to.fullPath // Lưu lại URL để tí đăng nhập xong trả về đúng chỗ
    next('/login')
  }
  // Nếu đã đăng nhập rồi mà cố tình quay lại trang /login
  else if (to.path === '/login' && isAuthenticated) {
    next('/') // Đá về Dashboard
  }
  // Hợp lệ thì cho đi tiếp
  else {
    next()
  }
})

export default router