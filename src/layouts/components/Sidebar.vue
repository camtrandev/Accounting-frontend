<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isCollapse = ref(false)
const emit = defineEmits(['toggle'])

const handleToggles = () => {
    isCollapse.value = !isCollapse.value
    emit('toggle', isCollapse.value)
}

const hasRole = (allowedRoles) => {
    return allowedRoles.includes(authStore.userRole)
}

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

// Highlight menu cha nếu URL đang ở trong thư mục /voucher
const isVoucherRoute = computed(() => route.path.includes('/voucher'));

// State quản lý việc xổ menu (Tự động mở nếu đang ở link chứng từ)
const isVoucherOpen = ref(isVoucherRoute.value);

</script>

<template>
    <aside class="sidebar" :class="{ collapse: isCollapse }">

        <div class="sidebar-header">
            <h2 v-if="!isCollapse">Phần mềm kế toán</h2>
            <div v-if="!isCollapse && authStore.user" class="user-badge">
                {{ authStore.user.username }} ({{ authStore.userRole }})
            </div>
        </div>

        <div class="menu">

            <router-link to="/" class="menu-item" exact-active-class="active" @click="isVoucherOpen = false">
                <span>📊</span>
                <span v-if="!isCollapse">Dashboard</span>
                <span v-if="!isCollapse" class="arrow"></span>
            </router-link>

            <router-link v-if="hasRole(['Admin', 'Accountant'])" to="/master-data" class="menu-item"
                exact-active-class="active" @click="isVoucherOpen = false">
                <span>📁</span>
                <span v-if="!isCollapse">Danh mục</span>
                <span v-if="!isCollapse" class="arrow"></span>
            </router-link>

            <router-link to="/voucher" v-if="hasRole(['Admin', 'Accountant'])" class="menu-item has-submenu"
                @click="isVoucherOpen = !isVoucherOpen" :class="{ 'active': isVoucherOpen || isVoucherRoute }">
                <span class="icon">🗃️</span>
                <span v-if="!isCollapse" class="menu-text">Chứng từ</span>
                <span v-if="!isCollapse" class="arrow" :class="{ 'open': isVoucherOpen }">›</span>
            </router-link>

            <div v-show="isVoucherOpen && !isCollapse" class="submenu-container">
                <router-link to="/vouchers/purchase" class="submenu-item" active-class="active">
                    <span class="dot"></span> Hoá đơn mua hàng
                </router-link>
                <router-link to="/vouchers/sale" class="submenu-item" active-class="active">
                    <span class="dot"></span> Hoá đơn bán hàng
                </router-link>
                <router-link to="/vouchers/receipt" class="submenu-item" active-class="active">
                    <span class="dot"></span> Phiếu thu
                </router-link>
                <router-link to="/vouchers/payment" class="submenu-item" active-class="active">
                    <span class="dot"></span> Phiếu chi
                </router-link>
            </div>

            <router-link v-if="hasRole(['Admin', 'Accountant'])" to="/ledger" class="menu-item"
                exact-active-class="active" @click="isVoucherOpen = false">
                <span>📒</span>
                <span v-if="!isCollapse">Sổ cái</span>
                <span v-if="!isCollapse" class="arrow"></span>
            </router-link>

            <router-link v-if="hasRole(['Admin', 'Accountant'])" to="/inventory" class="menu-item"
                exact-active-class="active" @click="isVoucherOpen = false">
                <span>💰</span>
                <span v-if="!isCollapse">Kho</span>
                <span v-if="!isCollapse" class="arrow"></span>
            </router-link>

            <router-link v-if="hasRole(['Admin', 'Accountant', 'Viewer'])" to="/reports" class="menu-item"
                exact-active-class="active" @click="isVoucherOpen = false">
                <span>📄</span>
                <span v-if="!isCollapse">Báo cáo</span>
                <span v-if="!isCollapse" class="arrow"></span>
            </router-link>

            <router-link v-if="hasRole(['Admin'])" to="/permission" class="menu-item" exact-active-class="active"
                @click="isVoucherOpen = false">
                <span>⚙️</span>
                <span v-if="!isCollapse">Phân quyền</span>
                <span v-if="!isCollapse" class="arrow"></span>
            </router-link>
        </div>

        <div class="bottom">
            <div class="dark-mode">
                <span v-if="!isCollapse">Dark Mode</span>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="logout" @click="handleLogout">
                🚪
                <span v-if="!isCollapse">Log Out</span>
            </div>

            <div class="collapse-btn" @click="handleToggles">
                ☰
                <span v-if="!isCollapse">Thu gọn</span>
            </div>
        </div>

    </aside>
</template>

<style scoped>
.sidebar {
    width: 220px;
    height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    background: linear-gradient(180deg, #ede9fe, #c7d2fe);
    transition: 0.3s;
    z-index: 1000;
}

.sidebar.collapse {
    width: 80px;
    margin-right: 20px;
}

.sidebar-header {
    margin-bottom: 20px;
}

.user-badge {
    font-size: 12px;
    color: #4f46e5;
    background: rgba(255, 255, 255, 0.5);
    padding: 4px 8px;
    border-radius: 8px;
    display: inline-block;
    margin-top: 5px;
    font-weight: 600;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
}

.menu::-webkit-scrollbar {
    width: 0px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 15px;
    border-radius: 14px;
    text-decoration: none;
    color: #334155;
    transition: 0.3s;
    cursor: pointer;
}

.menu-item:hover {
    background: rgba(99, 102, 241, 0.1);
}


.menu-item.active {
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    color: white;
}

.menu-item.active .arrow,
.menu-item.active .icon,
.menu-item.active .menu-text {
    color: white;
}

.arrow {
    margin-left: auto;
    transition: transform 0.3s ease;
    font-size: 18px;
}

.arrow.open {
    transform: rotate(90deg);
}

/* ==================================
   CSS CHO SUB-MENU (MENU CON)
   ================================== */
.submenu-container {

    background-color: transparent;
    margin: 4px 0 10px 12px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.submenu-item {
    display: flex;
    align-items: center;
    padding: 10px 16px 10px 24px;
    color: #4a5568;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s;
    border-radius: 10px;
}

.submenu-item .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #cbd5e0;
    margin-right: 12px;
    transition: all 0.2s;
}

.submenu-item:hover {
    background-color: rgba(255, 255, 255, 0.4);
    color: #5a67d8;
}


.submenu-item.active {
    background-color: #ffffff;
    color: #4f46e5;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.submenu-item.active .dot {
    background-color: #4f46e5;
    transform: scale(1.3);
    /* Chấm tròn to lên xíu khi được chọn */
}

/* ==================================
   Phần Bottom 
   ================================== */
.bottom {
    margin-top: auto;
    margin-bottom: 70px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.dark-mode {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 14px;
}

.switch {
    position: relative;
    width: 40px;
    height: 20px;
    cursor: pointer;
}

.switch input {
    display: none;
}

.slider {
    position: absolute;
    background: #cbd5e1;
    border-radius: 20px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.slider:before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: 0.3s;
}

input:checked+.slider:before {
    transform: translateX(20px);
}

.logout,
.collapse-btn {
    padding: 12px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: 0.2s;
}

.logout:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}
</style>