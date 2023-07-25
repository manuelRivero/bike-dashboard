import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { uploadZip } from 'api/products'
import {
    getProducts as getProductsRequest,
    uploadExcel,
    uploadProduct,
    getProductDetail as getProductsDetailRequest,
    editProduct as editProductRequest,
    getProductsTemplateExcel as getProductsTemplateExcelRequest
} from 'api/products'

const initialState = {
    productsData: null,
    loadingProductsData: true,
    loadingExcel: false,
    uploadExcelErrors:null,
    loadingZip: false,
    uploadZipError: false,
    zipErrors: null,
    loadingProduct: false,
    productSuccess: false,
    productError: false,
    productDetailError:false,
    productDetail:null,
    loadingEditProduct:false,
    editProductError:false,
    editProductSuccess:false,
    loadingTemplateExcel:false,
    templateExcelResult:null
}

export const getProductsTemplateExcel = createAsyncThunk('/get/excel-template', async (args) => {
    const [response] = await Promise.all([
        getProductsTemplateExcelRequest(args.access),
    ])
    return response
})

export const getProducts = createAsyncThunk('/get/products', async (args) => {
    const [products] = await Promise.all([
        getProductsRequest(args.access, args.filters),
    ])
    return products
})

export const getProductDetail = createAsyncThunk(
    '/get/products-detail',
    async (args) => {
        const [products] = await Promise.all([
            getProductsDetailRequest(args.access, args.id),
        ])
        return products
    }
)

export const editProduct = createAsyncThunk(
    '/put/products',
    async (args) => {
        const [products] = await Promise.all([
            editProductRequest(args.access, args.data, args.id),
        ])
        return products
    }
)

export const postProducts = createAsyncThunk('/post/products', async (args) => {
    const [products] = await Promise.all([
        uploadProduct(args.access, args.data),
    ])
    return products
})

export const postProductsExcel = createAsyncThunk(
    '/post/productsExcel',
    async (args) => {
        const [response] = await Promise.all([
            uploadExcel(args.access, args.form),
        ])
        return response
    }
)

export const postImagesFromZip = createAsyncThunk(
    '/post/productsImages',
    async (args) => {
        const [response] = await Promise.all([
            uploadZip(args.access, args.form),
        ])
        return response
    }
)

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        resetProductSuccess: (state) => {
            state.productSuccess = false
        },
        resetEditProductSuccess: (state) => {
            state.editProductSuccess = false
        },
        resetZipErrors: (state) => {
            state.zipErrors = null
        },
        resetExcelErrors: (state) => {
            state.uploadExcelErrors = null
        },
        resetProductDetail: (state) => {
            console.log("reset")
            state.productDetail = null
        }
    },
    extraReducers: {
        [getProducts.pending]: (state) => {
            state.loadingProductsData = true
        },
        [getProducts.fulfilled]: (state, action) => {
            state.loadingProductsData = false
            state.productsData = {
                data: action.payload.data.data,
                pageInfo: action.payload.data.pageInfo,
            }
        },
        [getProducts.rejected]: (state) => {
            state.loadingProductsData = false
        },
        [postProductsExcel.pending]: (state) => {
            state.loadingExcel = true
        },
        [postProductsExcel.fulfilled]: (state, action) => {
            console.log("postProductsExcel", action.payload.data)
            state.loadingExcel = false
            state.uploadExcelErrors = action.payload.data.productWithErrors

        },
        [postProductsExcel.rejected]: (state) => {
            state.loadingExcel = false
        },
        [postImagesFromZip.pending]: (state) => {
            state.loadingZip = true
        },
        [postImagesFromZip.fulfilled]: (state, action) => {
            state.loadingZip = false;
            state.zipErrors = action.payload.data.productWithErrors
        },
        [postImagesFromZip.rejected]: (state) => {
            state.loadingZip = false
        },
        [postProducts.pending]: (state) => {
            state.loadingProduct = true
        },
        [postProducts.fulfilled]: (state) => {
            state.loadingProduct = false
            state.productSuccess = true
        },
        [postProducts.rejected]: (state) => {
            state.loadingProduct = false
            state.productError = true
        },
        [getProductDetail.pending]: (state) => {
            state.loadingProductDetail = true
        },
        [getProductDetail.fulfilled]: (state, action) => {
            state.loadingProductDetail = false
            state.productDetail = action.payload.data.product
        },
        [getProductDetail.rejected]: (state) => {
            state.loadingProductDetail = false
            state.productDetailError = true
        },
        [editProduct.pending]: (state) => {
            state.loadingEditProduct = true
        },
        [editProduct.fulfilled]: (state) => {
            state.loadingEditProduct = false
            state.editProductSuccess = true
            state.editProductError = false
        },
        [editProduct.rejected]: (state) => {
            state.loadingEditProduct = false
            state.editProductError = true
        },
        [getProductsTemplateExcel.pending]: (state) => {
            state.loadingTemplateExcel = true
        },
        [getProductsTemplateExcel.fulfilled]: (state, action) => {
            state.loadingTemplateExcel = false;
            state.templateExcelResult = action.payload.data
        },
        [getProductsTemplateExcel.rejected]: (state) => {
            state.loadingTemplateExcel = false
        },
    },
})
export const { resetProductDetail, resetExcelErrors, resetProductSuccess, resetEditProductSuccess, resetZipErrors } = productsSlice.actions

export default productsSlice.reducer
