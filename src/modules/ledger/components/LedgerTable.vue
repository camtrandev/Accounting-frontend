<template>
    <div class="table-wrapper">
        <table class="modern-table">
            <thead>
                <tr>
                    <th>Ngày CT</th>
                    <th>Số CT</th>
                    <th>Diễn giải</th>
                    <th>Tài khoản</th>
                    <th class="text-right">Phát sinh Nợ</th>
                    <th class="text-right">Phát sinh Có</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in data" :key="item.id">
                    <td>{{ item.date }}</td>
                    <td><span class="ref-no">{{ item.refNo }}</span></td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.accountCode }}</td>
                    <td class="text-right">{{ formatMoney(item.debit) }}</td>
                    <td class="text-right">{{ formatMoney(item.credit) }}</td>
                    <td>
                        <button @click="$emit('viewDetail', item)" class="btn-icon">👁️</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    data: Array,
    loading: Boolean
});

// Khai báo các sự kiện gửi lên cha
defineEmits(['viewDetail']);

const formatMoney = (val) => val ? new Intl.NumberFormat('vi-VN').format(val) : '-';
</script>

<style scoped>
.table-wrapper {
    background: white;
    border-radius: 8px;
    overflow-x: auto;
    /* Responsive cho mobile */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.modern-table {
    width: 100%;
    border-collapse: collapse;
}

.modern-table th {
    background: #f1f3f5;
    padding: 12px;
    text-align: left;
    font-weight: 600;
}

.modern-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
}

.ref-no {
    color: #007bff;
    font-weight: 500;
    cursor: pointer;
}

.text-right {
    text-align: right;
}

.btn-icon {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.1rem;
}
</style>