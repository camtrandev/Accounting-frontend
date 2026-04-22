<script setup>
import { useMasterDataStore } from "../store/masterData.store"

const store = useMasterDataStore()
</script>

<template>
    <div class="table-wrapper">
        <table>
            <!-- HEADER -->
            <thead>
                <tr>
                    <th><input type="checkbox" /></th>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Cấp</th>
                    <th>Loại</th>
                    <th>Tính chất</th>
                    <th>Theo dõi</th>
                    <th>Công nợ</th>
                    <th>Kho</th>
                    <th>Đối tượng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>

            <!-- BODY -->
            <tbody>
                <tr v-for="acc in store.paginatedAccounts" :key="acc.id">
                    <!-- CHECK -->
                    <td>
                        <input type="checkbox" :checked="store.selected.includes(acc.id)"
                            @change="store.toggleSelect(acc.id)" />
                    </td>

                    <!-- CODE -->
                    <td class="code">{{ acc.code }}</td>

                    <!-- NAME (TREE) -->
                    <td>
                        <div class="tree" :style="{ paddingLeft: acc.level * 20 + 'px' }">

                            <!-- NÚT MỞ TREE -->
                            <span v-if="store.getChildren(acc.id).length" class="arrow"
                                @click="store.toggleExpand(acc.id)" style="cursor: pointer">
                                {{ store.expanded.includes(acc.id) ? '▾' : '▸' }}
                            </span>

                            <span>{{ acc.name }}</span>
                        </div>
                    </td>

                    <td>{{ acc.level }}</td>
                    <td>{{ acc.type }}</td>
                    <td>{{ acc.nature }}</td>

                    <!-- CHECK ICON -->
                    <td class="check">✔</td>
                    <td class="check">✔</td>
                    <td class="check">✔</td>
                    <td class="check">✔</td>

                    <!-- STATUS -->
                    <td>
                        <span :class="acc.active ? 'badge-green' : 'badge-red'">
                            {{ acc.active ? 'Hoạt động' : 'Ngừng' }}
                        </span>
                    </td>

                    <!-- ACTION -->
                    <td>
                        <button class="btn-edit">Sửa</button>
                        <button @click.stop="store.remove(acc.id)" class="btn-delete">
                            Xóa
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <button @click="store.page--">‹</button>
            <span class="page">Page {{ store.page }}</span>
            <button @click="store.page++">›</button>
        </div>
    </div>
</template>

<style scoped>
.table-wrapper {
    width: 100%;
    overflow: hidden;
}

/* TABLE */
table {
    width: 100%;
    border-collapse: collapse;
}

/* HEADER */
th {
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    padding: 12px;
    background: #f8fafc;
}

/* ROW */
td {
    padding: 12px;
    font-size: 14px;
    color: #334155;
}

tr {
    transition: 0.2s;
    border-bottom: 1px solid #f1f5f9;
}

tr:hover {
    background: #f1f5ff;
}

/* CODE */
.code {
    font-weight: 600;
    color: #1e293b;
}

/* TREE */
.tree {
    display: flex;
    align-items: center;
    gap: 6px;
}

.arrow {
    font-size: 12px;
    color: #6366f1;
}

.name {
    font-weight: 500;
}

/* CHECK ICON */
.check {
    color: #22c55e;
    font-weight: bold;
}

/* BADGE */
.badge-green {
    background: #dcfce7;
    color: #16a34a;
    padding: 4px 8px;
    border-radius: 8px;
}

.badge-red {
    background: #fee2e2;
    color: #dc2626;
    padding: 4px 8px;
    border-radius: 8px;
}

/* BUTTON */
.btn-edit {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 13px;
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Hover */
.btn-delete:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

/* Click */
.btn-delete:active {
  transform: scale(0.95);
}

/* Disabled */
.btn-delete:disabled {
  background: #fecaca;
  cursor: not-allowed;
  box-shadow: none;
}

.page {
    margin: 0 10px;
}
</style>