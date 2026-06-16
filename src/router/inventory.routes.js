export default [
  {
    path: 'inventory',
    name: 'InventoryDashboard',
    component: () => import('@/modules/inventory/pages/InventoryDashboard.vue')
  },
  {
    path: 'receipt/create',
    name: 'InventoryReceiptCreate',
    component: () => import('@/modules/inventory/pages/ReceiptFormPage.vue')
  },
  {
    path: 'issue/create',
    name: 'InventoryIssueCreate',
    component: () => import('@/modules/inventory/pages/IssueFormPage.vue')
  },
  {
    path: 'transfer/create',
    name: 'InventoryTransferCreate',
    component: () => import('@/modules/inventory/pages/InventoryTransferPage.vue')
  },
  {
    path: 'inventory/check',
    name: 'InventoryCheck',
    component: () => import('@/modules/inventory/pages/InventoryCheckPage.vue')
  },
  {
    path: 'inventory/costing',
    name: 'InventoryCosting',
    component: () => import('@/modules/inventory/pages/InventoryCostingPage.vue')
  },
  {
    path: 'inventory/transfer',
    name: 'InventoryTransfer',
    component: () => import('@/modules/inventory/pages/InventoryTransferPage.vue')
  }
];