import { defineStore } from "pinia"
import { getAccounts } from "../service/masterData.api"

export const useMasterDataStore = defineStore("masterData", {
    state: () => ({

        expanded: [],  
        page: 1,        
        pageSize: 5,
        tab: "account",

        accounts: [],
        filteredAccounts: [],
        selected: [],

        filter: {
            keyword: "",
            type: "",
            status: ""
        }
    }),

    actions: {
        async loadAccounts() {
            this.accounts = await getAccounts()
            this.filteredAccounts = this.accounts
        },

        getChildren(id) {
            return this.accounts.filter(a => a.parentId === id)
        },

        toggleExpand(id) {
            if (this.expanded.includes(id)) {
                this.expanded = this.expanded.filter(i => i !== id)
            } else {
                this.expanded.push(id)
            }
        },

        applyFilter() {
            this.filteredAccounts = this.accounts.filter(a => {
                return (
                    (!this.filter.keyword || a.name.includes(this.filter.keyword)) &&
                    (!this.filter.type || a.type === this.filter.type) &&
                    (this.filter.status === "" || a.active == this.filter.status)
                )
            })
        },

        toggleAll(e) {
            this.selected = e.target.checked
                ? this.accounts.map(a => a.id)
                : []
        },

        deleteSelected() {
            this.accounts = this.accounts.filter(
                a => !this.selected.includes(a.id)
            )
            this.applyFilter()
        },

        remove(id) {
            const hasTransaction = id === 3 // giả lập

            if (hasTransaction) {
                alert("Tài khoản đã phát sinh, không thể xóa!")
                return
            }

            this.accounts = this.accounts.filter(a => a.id !== id)
        },

        toggleStatus(status) {
            this.accounts.forEach(a => {
                if (this.selected.includes(a.id)) {
                    a.active = status
                }
            })
        },

        toggleSelect(id) {
            if (this.selected.includes(id)) {
                this.selected = this.selected.filter(i => i !== id)
            } else {
                this.selected.push(id)
            }

            // chọn con
            const children = this.getChildren(id)
            children.forEach(c => {
                if (!this.selected.includes(c.id)) {
                    this.selected.push(c.id)
                }
            })
        }
    },
    getters: {
        visibleAccounts(state) {
            const result = []

            const build = (parentId = null) => {
                const nodes = state.accounts.filter(a => a.parentId === parentId)

                nodes.forEach(n => {
                    result.push(n)
                    if (state.expanded.includes(n.id)) {
                        build(n.id)
                    }
                })
            }

            build()
            return result
        },

        paginatedAccounts(state) {
            const start = (state.page - 1) * state.pageSize
            return this.visibleAccounts.slice(start, start + state.pageSize)
        }
    }


})