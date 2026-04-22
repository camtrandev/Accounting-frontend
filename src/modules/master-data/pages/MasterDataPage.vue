<script setup>
import { onMounted, watch } from "vue"
import AccountTable from "../components/AccountTable.vue"
import CustomerForm from "../components/CustomerForm.vue"
import ProductForm from "../components/ProductForm.vue"
import { useMasterDataStore } from "../store/masterData.store"

const store = useMasterDataStore()

onMounted(() => {
  store.loadAccounts()
})

// 👉 AUTO FILTER (xịn hơn)
watch(
  () => store.filter,
  () => {
    store.applyFilter()
  },
  { deep: true }
)
</script>

<template>
  <div class="master-data">
    <!-- TITLE -->
    <div class="header">
      <h2>Quản lý danh mục</h2>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button class="tab" :class="{ active: store.tab === 'account' }" @click="store.tab = 'account'">
        Tài khoản kế toán
      </button>

      <button class="tab" :class="{ active: store.tab === 'customer' }" @click="store.tab = 'customer'">
        Khách hàng / NCC
      </button>

      <button class="tab" :class="{ active: store.tab === 'product' }" @click="store.tab = 'product'">
        Hàng hóa / Dịch vụ
      </button>
    </div>

    <!-- FILTER -->
    <div class="filter-bar">
      <div class="left">
        <div class="search-box">
          🔍
          <input v-model="store.filter.keyword" placeholder="Tìm kiếm..." />
        </div>

        <select v-model="store.filter.type">
          <option value="">Tất cả</option>
          <option value="Tài sản">Tài sản</option>
          <option value="Công nợ">Công nợ</option>
        </select>

        <select v-model="store.filter.status">
          <option value="">Trạng thái</option>
          <option :value="true">Hoạt động</option>
          <option :value="false">Ngừng</option>
        </select>

        <button class="btn-primary" @click="store.applyFilter"
          :disabled="!store.filter.keyword && !store.filter.type && store.filter.status === ''">
          Áp dụng
        </button>
      </div>
    </div>

    <!-- ACTION -->
    <div class="action-bar">
      <label class="select-all">
        <input type="checkbox" @change="store.toggleAll" />
        Chọn tất cả
      </label>

      <button class="btn-danger" @click="store.deleteSelected">
        🗑 Xóa hàng loạt
      </button>

      <button class="btn-gray" @click="store.toggleStatus(false)">
        ⛔ Ngừng sử dụng
      </button>

      <button class="btn-success" @click="store.toggleStatus(true)">
        ✔ Kích hoạt
      </button>
    </div>

    <!-- TABLE -->
    <div class="table-card" v-if="store.tab === 'account'">
      <AccountTable />
    </div>

    <div v-if="store.tab === 'customer'">
      <CustomerForm />
    </div>

    <div v-if="store.tab === 'product'">
      <ProductForm />
    </div>
  </div>
</template>

<style scoped>
.master-data {
  background: linear-gradient(135deg, #eef2ff, #ede9fe);
  padding: 20px;
  border-radius: 16px;
}

/* HEADER */
.header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

/* TABS */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.tab {
  padding: 8px 16px;
  border-radius: 12px;
  background: #e0e7ff;
  color: #4f46e5;
  font-weight: 500;
  border: none;
}

.tab.active {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

/* FILTER */
.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.filter-bar .left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-bar .right {
  display: flex;
  gap: 10px;
}

/* INPUT */
.input {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #f9fafb;
}

.search {
  width: 220px;
}

/* BUTTON */
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  padding: 6px 14px;
  border-radius: 10px;
}

.btn-outline {
  border: 1px solid #6366f1;
  color: #4f46e5;
  padding: 8px 12px;
  border-radius: 10px;
  background: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
  padding: 6px 12px;
  border-radius: 10px;
}


.btn-gray {
  background: #e2e8f0;
  padding: 6px 12px;
  border-radius: 10px;
}

.btn-success {
  background: #22c55e;
  color: white;
  padding: 6px 12px;
  border-radius: 10px;
}

/* ACTION BAR */
.action-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* PAGINATION MINI */
.pagination-mini {
  display: flex;
  gap: 6px;
}

.pagination-mini button {
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  background: #e0e7ff;
}

.pagination-mini .active {
  background: #6366f1;
  color: white;
}

/* TABLE CARD */
.table-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.search-box {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  margin-left: 6px;
}

select {
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 10px;
}
</style>