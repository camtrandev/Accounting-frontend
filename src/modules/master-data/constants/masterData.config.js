// constants/masterData.config.js
export const MASTER_DATA_TYPES = {
  ACCOUNT: 'ACCOUNT',
  CUSTOMER: 'CUSTOMER',
  SUPPLIER: 'SUPPLIER',
  PRODUCT: 'PRODUCT',
  WAREHOUSE: 'WAREHOUSE'
};

export const MENU_CONFIG = [
  { id: MASTER_DATA_TYPES.ACCOUNT, label: 'Hệ thống tài khoản', icon: 'pi pi-book' },
  { id: MASTER_DATA_TYPES.CUSTOMER, label: 'Khách hàng', icon: 'pi pi-users' },
  { id: MASTER_DATA_TYPES.SUPPLIER, label: 'Nhà cung cấp', icon: 'pi pi-truck' },
  { id: MASTER_DATA_TYPES.PRODUCT, label: 'Vật tư hàng hóa', icon: 'pi pi-box' },
  { id: MASTER_DATA_TYPES.WAREHOUSE, label: 'Kho', icon: 'pi pi-home' }
];

// Định nghĩa cột hiển thị cho từng loại
export const COLUMN_CONFIG = {
  [MASTER_DATA_TYPES.CUSTOMER]: [
    { field: 'code', header: 'Mã khách hàng', width: '150px' },
    { field: 'name', header: 'Tên khách hàng', width: '250px' },
    { field: 'taxCode', header: 'Mã số thuế', width: '150px' },
    { field: 'address', header: 'Địa chỉ', width: '300px' },
  ],
  [MASTER_DATA_TYPES.ACCOUNT]: [
    { field: 'accountNumber', header: 'Số hiệu tài khoản', width: '150px' },
    { field: 'accountName', header: 'Tên tài khoản', width: '250px' },
    { field: 'type', header: 'Tính chất', width: '150px' },
  ],
  // ... các danh mục khác tương tự
};

export const FORM_CONFIG = {
  ACCOUNT: [
    { name: 'AccountNumber', label: 'Số hiệu tài khoản', type: 'text', required: true },
    { name: 'AccountName', label: 'Tên tài khoản', type: 'text', required: true },
    { name: 'ParentId', label: 'Tài khoản tổng hợp', type: 'select', options: [] }, // Load từ API
    { name: 'Type', label: 'Tính chất', type: 'select', options: ['Dư Nợ', 'Dư Có', 'Lưỡng tính'] }
  ],
  CUSTOMER: [
    { name: 'CustomerCode', label: 'Mã khách hàng', type: 'text', required: true },
    { name: 'CustomerName', label: 'Tên khách hàng', type: 'text', required: true },
    { name: 'TaxCode', label: 'Mã số thuế', type: 'text' },
    { name: 'Address', label: 'Địa chỉ', type: 'textarea' }
  ],
  PRODUCT: [
    { name: 'ProductCode', label: 'Mã hàng', type: 'text', required: true },
    { name: 'ProductName', label: 'Tên hàng hóa', type: 'text', required: true },
    { name: 'Unit', label: 'Đơn vị tính', type: 'text' },
    { name: 'PurchasePrice', label: 'Giá mua định mức', type: 'number' }
  ]
  // Các danh mục khác tương tự...
};