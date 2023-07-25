import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUSers } from 'api/dashboard'
import {
    getSalesStats,
    getNotifications as getNotificationsRequest,
    getMonthlySales as getMonthlySalesRequest,
    getTopProducts as getTopProductsRequest,
} from 'api/dashboard'
import moment from 'moment'

const initialState = {
    salesStats: null,
    loadingStats: true,
    users: null,
    notifications: null,
    notificationsPage: 0,
    monthlySales: null,
    topProductsData: null,
    loadingTopsProducts: true,
}

export const getStats = createAsyncThunk(
    '/get/stats',
    async (args, { rejectWithValue }) => {
        console.log("store from", args.from )
        try {
            const [salesStats, users, dailySales] = await Promise.all([
                getSalesStats(args.access, args.from ?  args.from : moment(new Date()).format("DD-MM-YYYY")),
                getUSers(args.access),
            ])
            return [salesStats, users, dailySales]
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const getSalesByDate = createAsyncThunk(
    '/get/getSalesByDate',
    async (args, { rejectWithValue }) => {
        try {
            const response = await getSalesStats(args.access, args.from)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const getNotifications = createAsyncThunk(
    '/get/notifications',
    async (args, { rejectWithValue }) => {
        try {
            const response = await getNotificationsRequest(
                args.access,
                args.page
            )
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const getMonthlySales = createAsyncThunk(
    '/get/getMonthlySales',
    async (args, { rejectWithValue }) => {
        try {
            const [monthlySales] = await Promise.all([
                getMonthlySalesRequest(args.access, args.date),
            ])
            return monthlySales
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const getTopProducts = createAsyncThunk(
    '/get/topProducs',
    async (args, { rejectWithValue }) => {
        try {
            const [monthlySales] = await Promise.all([
                getTopProductsRequest(args.access, args.page),
            ])
            return monthlySales
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        userAdded: (state, action) => {
            state.users = [...state.users, action.payload]
        },
        notificationAdded: (state, action) => {
            console.log('notification added action', action)

            state.notifications.notifications = [
                ...state.notifications.notifications,
                action.payload,
            ]
        },
        setReadednotification: (state, action) => {
            console.log('notification added action', action)
            const newNotifications = [
                ...state.notifications.notifications,
            ].map((e) => ({ ...e, readed: true }))
            state.notifications.notifications = newNotifications
        },
        setNotificationsPage: (state, action) => {
            console.log('action', action.payload)
            state.notificationsPage = action.payload.page
        },
        resetNotifications:(state) => {
            console.log("reset notifications")
            state.notifications = null
            state.notificationsPage = 0
        }
    },
    extraReducers: {
        [getStats.pending]: (state) => {
            state.loadingStats = true
        },
        [getStats.fulfilled]: (state, action) => {
            state.loadingStats = false
            console.log('getStats action', action)

            state.salesStats = action.payload[0].data.total
            state.users = action.payload[1].data.users
        },
        [getStats.rejected]: (state) => {
            state.loadingStats = false
        },
        [getSalesByDate.pending]: (state) => {
            state.loadingStats = true
        },
        [getSalesByDate.fulfilled]: (state, action) => {
            state.loadingStats = false
            state.salesStats = action.payload.data.total
        },
        [getSalesByDate.rejected]: (state) => {
            state.loadingStats = false
        },
        [getMonthlySales.pending]: (state) => {
            state.loadingMonthlySales = true
        },
        [getMonthlySales.fulfilled]: (state, action) => {
            state.loadingMonthlySales = false
            state.monthlySales = action.payload.data.sales
        },
        [getMonthlySales.rejected]: (state) => {
            state.loadingMonthlySales = false
        },

        [getTopProducts.pending]: (state) => {
            state.loadingTopsProducts = true
        },
        [getTopProducts.fulfilled]: (state, action) => {
             console.log("action top products", action.payload.data.topProducts)
            state.loadingTopsProducts = false
            state.topProductsData = {
                data: action.payload.data.data,
                metada: action.payload.data.metadata,
            }
        },
        [getTopProducts.rejected]: (state) => {
            state.loadingTopsProducts = false
        },
        [getNotifications.pending]: (state) => {
            state.loadingNotifications = true
        },
        [getNotifications.fulfilled]: (state, action) => {
            state.loadingNotifications = false
            // console.log('action.payload.data', action.payload.data)
            const notifications = state.notifications
                ? state.notifications.notifications
                : []
            state.notifications = {
                notifications: [
                    ...notifications,
                    ...action.payload.data.notifications,
                ],
                total: action.payload.data.total,
            }
        },
        [getNotifications.rejected]: (state) => {
            state.loadingNotifications = false
        },
    },
})
export const {
    resetNotifications,
    userAdded,
    notificationAdded,
    setReadednotification,
    setNotificationsPage,
} = dashboardSlice.actions

export default dashboardSlice.reducer
