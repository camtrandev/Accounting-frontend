<template>
  <div class="master-table-container h-full flex flex-col">

    <!-- DESKTOP TABLE -->
    <div class="hidden md:block overflow-auto flex-1 border rounded-lg">
      <table class="accounting-table w-full">
        <thead>
          <tr>
            <th class="col-check text-center">
              <input type="checkbox" />
            </th>
            <th class="col-code">Mã khách hàng</th>
            <th class="col-name">Tên khách hàng</th>
            <th class="col-tax">Mã số thuế</th>
            <th class="col-status">Trạng thái</th>
            <th class="col-action text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in items"
            :key="item.Id"
            class="table-row"
          >
            <td class="text-center">
              <input type="checkbox" />
            </td>

            <td class="text-bold text-blue">
              {{ item.Code }}
            </td>

            <td>{{ item.Name }}</td>

            <td>{{ item.TaxCode }}</td>

            <td>
              <span
                :class="['badge', item.IsActive ? 'badge-success' : 'badge-error']"
              >
                {{ item.IsActive ? 'Đang theo dõi' : 'Ngừng theo dõi' }}
              </span>
            </td>

            <td class="text-right">
              <div class="action-buttons">
                <button @click="onEdit(item)" class="btn-icon edit">
                  Sửa
                </button>

                <button @click="onDelete(item.Id)" class="btn-icon delete">
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MOBILE CARD -->
    <div class="md:hidden flex-1 overflow-y-auto p-2 space-y-3">
      <div
        v-for="item in items"
        :key="item.Id"
        class="data-card"
      >
        <div class="card-header">
          <span class="card-code">{{ item.Code }}</span>

          <span
            :class="['card-status', item.IsActive ? 'active' : 'inactive']"
          >
            {{ item.IsActive ? '● Đang dùng' : '● Ngừng' }}
          </span>
        </div>

        <div class="card-body">
          <div class="card-name">{{ item.Name }}</div>
          <div class="card-tax">MST: {{ item.TaxCode }}</div>
        </div>

        <div class="card-footer">
          <button @click="onEdit(item)" class="btn-mobile-edit">
            Sửa
          </button>

          <button @click="onDelete(item.Id)" class="btn-mobile-delete">
            Xóa
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMasterDataStore } from '../store/masterData.store'

const store = useMasterDataStore()
const items = computed(() => store.items)

// ACTIONS
const onEdit = (item) => {
  console.log("Editing:", item)
  // TODO: mở drawer / modal
}

const onDelete = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
    console.log("Deleting:", id)
    // TODO: call API / store
  }
}
</script>

<style scoped>
.master-table-container {
  height: 100%;
  width: 100%;
  background-color: #fff;
}

/* TABLE */
.accounting-table {
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.accounting-table thead th {
  position: sticky;
  top: 0;
  background-color: #f4f7fa;
  color: #4b5563;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 2px solid #e5e7eb;
  z-index: 10;
}

.accounting-table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

/* hover */
.table-row:hover {
  background-color: #f0f7ff;
  cursor: pointer;
}

/* text */
.text-bold { font-weight: 600; }
.text-blue { color: #2563eb; }
.text-right { text-align: right; }
.text-center { text-align: center; }

/* badge */
.badge {
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
}
.badge-success { background: #dcfce7; color: #166534; }
.badge-error { background: #fee2e2; color: #991b1b; }

/* actions */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn-icon {
  border: none;
  background: none;
  cursor: pointer;
}
.btn-icon.edit { color: #2563eb; }
.btn-icon.delete { color: #dc2626; }

/* MOBILE */
.data-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-left: 4px solid #2563eb;
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-code {
  font-weight: 700;
  color: #2563eb;
}

.card-status.active { color: #166534; }
.card-status.inactive { color: #991b1b; }

.card-name {
  font-weight: 600;
  margin-top: 6px;
}

.card-tax {
  color: #6b7280;
  font-size: 13px;
}

.card-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style>