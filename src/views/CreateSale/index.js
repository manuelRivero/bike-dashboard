import { Box, Checkbox, ClickAwayListener, makeStyles } from '@material-ui/core'
import GridItem from 'components/Grid/GridItem'
import React, { useEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce'

import TextInput from 'components/TextInput/Index'
import { getProducts } from 'store/products'
import { useDispatch, useSelector } from 'react-redux'
import GridContainer from 'components/Grid/GridContainer'
import ProductQuantityCounter from 'components/ProductQuantityCounter'
import Button from 'components/CustomButtons/Button.js'

//icons
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import CustomModal from 'components/CustomModal'
import { resetCreateSaleSuccess } from 'store/sales'
import { createSale } from 'store/sales'

//form
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
const schema = yup.object({
    orderType: yup
        .string()
        .required('Campo obligatorio')
        .oneOf(['0', '1', '2'], 'Campo obligatorio'),
    products: yup.array().when('orderType', (orderType, schema) => {
        if (orderType === '0' || orderType === '2')
            return schema
                .min(1, 'Campo obligatorio')
                .required('Campo obligatorio')
    }),

    total: yup.string().when('orderType', (orderType, schema) => {
        if (orderType === '0' || orderType === '2')
            return schema
                .required('Campo obligatorio')
    }),

    repairTotal: yup
        .string()
        .when('orderType', {
            is: '1' || '2',
            then: yup.string().required('Campo obligatorio'),
        }),
    description: yup
        .string()
        .when('orderType', {
            is: '1' || '2',
            then: yup.string().required('Campo obligatorio'),
        }),
    paymentMethod: yup
        .string()
        .oneOf(['1', '0'], 'Campo obligatorio')
        .required('Campo obligatorio'),
})
const useStyles = makeStyles({
    root: {},
    productCard: {
        position: 'relative',
        borderRadius: '.5rem',
        padding: '.5rem',
        backgroundColor: '#fff',
        paddingTop: '1rem',
    },
    inputWrapper: {
        position: 'relative',
    },
    productsList: {
        zIndex: 100,
        boxShadow: '10px 11px 43px -18px rgba(0,0,0,0.75)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderRadius: '.5rem',
        padding: '.5rem',
        backgroundColor: '#fff',
        transform: 'translateY(100%)',
        width: '100%',
        maxWidth: '350px',
    },
    productsListItem: {
        cursor: 'pointer',
        padding: '5px',
        '& > p': {
            margin: 0,
        },
        '&:hover': {
            backgroundColor: '#c2c2c2',
        },
    },
    productQuantityWrapper: {
        display: 'flex',
        gap: '.5rem',
    },
    trashIcon: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        color: 'red',
        cursor: 'pointer',
    },
    paymentWrapper: {
        display: 'flex',
        gap: '1rem',
    },
    descriptionRow: {
        '& .MuiFormControl-root': {
            width: '100%',
        },
    },
})
export default function CreateSale() {
    const formRef = useRef(null)
    const classes = useStyles()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { productsData, loadingProductsData } = useSelector(
        (state) => state.products
    )

    const { loadingCreateSale, createSaleSuccess } = useSelector(
        (state) => state.sales
    )

    //form
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        clearErrors,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            orderType: '0',
            paymentMethod: '1',
            description: '',
            products: [],
            repairTotal: '0',
            total:'0'
        },
    })
    const { append, fields, replace } = useFieldArray({
        control,
        name: 'products',
    })

    const watchOrderType = watch('orderType')
    const watchProducts = watch('products')
    const watchRepairTotal = watch('repairTotal')

    const [searchValue, setSearchValue] = useState('')
    const [options, setOptions] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0)
    const [formAlert, setFormAlert] = useState(null)

    const changeInputHandler = async () => {
        const value = formRef.current.elements.search.value
        dispatch(
            getProducts({
                access: user.token,
                filters: { search: value, page: 0 },
            })
        )
    }
    const debouncedChangeHandler = React.useMemo(
        () => debounce(changeInputHandler, 1000),
        []
    )
    const addProduct = (product) => {
        console.log('watch products', watchProducts)
        const productList = [...watchProducts]
        const targetProduct = productList.findIndex(
            (e) => e._id === product._id
        )
        if (targetProduct < 0) {
            append({ ...product, selectedQuantity: 1 })
        }
    }
    const handleQuantity = (product, quantity) => {
        const productList = [...watchProducts]
        const targetProduct = productList.findIndex(
            (e) => e._id === product._id
        )
        console.log('target product', targetProduct)
        if (targetProduct >= 0) {
            productList[targetProduct].selectedQuantity = quantity
        }
        replace(productList)
    }
    const handleTotal = () => {
        let total = 0
        if (watchOrderType === '0') {
            watchProducts.forEach((e) => {
                total = parseInt(e.price) * parseInt(e.selectedQuantity) + total
            })
            return total
        }
        if (watchOrderType === '1') {
            return total + parseInt(watchRepairTotal)
        }
        if (watchOrderType === '2') {
            watchProducts.forEach((e) => {
                total = parseInt(e.price) * parseInt(e.selectedQuantity) + total
            })
            total = total + parseInt(watchRepairTotal)
            setValue("total", total)
            return total
        }
    }
    const removeProduct = (id) => {
        const productList = [...watchProducts].filter((e) => e._id !== id)
        replace(productList)
    }
    const handleSuccess = () => {
        dispatch(resetCreateSaleSuccess())
        reset()
    }
    const submit = (values) => {
        console.log('values', values)
        let data = {}
        switch (values.orderType) {
            case '0':
                data.orderType = '0'
                data.paymentMethod = values.paymentMethod
                data.products = values.products.map((e) => ({
                    _id: e._id,
                    quantity: e.selectedQuantity,
                }));

                break
            case '1':
                data.orderType = '1'
                data.paymentMethod = values.paymentMethod
                data.paymentMethod = values.paymentMethod
                data.description = values.description
                data.repairTotal = values.repairTotal

                break
                case '2':
                    data.orderType = '2'
                    data.paymentMethod = values.paymentMethod
                    data.paymentMethod = values.paymentMethod
                    data.description = values.description
                    data.repairTotal = values.repairTotal
                    data.paymentMethod = values.paymentMethod
                    data.products = values.map((e) => ({
                        _id: e._id,
                        quantity: e.selectedQuantity,
                    }));
                    data.total = values.total
    
                    break

            default:
                break
        }
        setFormAlert(null)
        dispatch(
            createSale({
                access: user.token,
                saleData: data
            })
        )
    }
    useEffect(() => {
        console.log('product data', productsData)
        if (productsData?.data && productsData.data.length > 0) {
            setOptions(productsData.data)
            setIsOpen(true)
            return
        } else {
            setOptions([])
            setIsOpen(false)
            return
        }
    }, [loadingProductsData, productsData])
    console.log('errors', errors)
    useEffect(() => {
        switch (watchOrderType) {
            case '0':
                setValue('description', '')
                setValue('repairTotal', '0')
                clearErrors()
                break
            case '1':
                replace([])
                clearErrors()
                break
            case '2':
                clearErrors()
                setValue('description', '')
                setValue('repairTotal', '0')
                replace([])
                break

            default:
                break
        }
    }, [watchOrderType])
    useEffect(()=>{
        const handleProductsTotal = ()=>{
            let total = 0
            watchProducts.forEach((e) => {
                total = parseInt(e.price) * parseInt(e.selectedQuantity) + total
            })
            setValue("total", total)
        }
        handleProductsTotal()

    },[watchProducts])
    
    return (
        <Box>
            <form onSubmit={handleSubmit(submit)}>
                <Box>
                    <Box>
                        <Box>
                            <h4>Slecciona el tipo de orden</h4>
                            <Box className={classes.paymentWrapper}>
                                <Controller
                                    name="orderType"
                                    control={control}
                                    render={({ field }) => (
                                        <Box>
                                            <label htmlFor="sale">
                                                Venta
                                                <Checkbox
                                                    id="sale"
                                                    classes={{
                                                        checked:
                                                            classes.checked,
                                                    }}
                                                    checked={
                                                        field.value === '0'
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={() =>
                                                        field.onChange('0')
                                                    }
                                                    inputProps={{
                                                        'aria-label':
                                                            'primary checkbox',
                                                    }}
                                                />
                                            </label>
                                        </Box>
                                    )}
                                />

                                <Controller
                                    name="orderType"
                                    control={control}
                                    render={({ field }) => (
                                        <Box>
                                            <label htmlFor="repair">
                                                Reparación o mantenimiento
                                                <Checkbox
                                                    id="repair"
                                                    classes={{
                                                        checked:
                                                            classes.checked,
                                                    }}
                                                    checked={
                                                        field.value === '1'
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={() =>
                                                        field.onChange('1')
                                                    }
                                                    inputProps={{
                                                        'aria-label':
                                                            'primary checkbox',
                                                    }}
                                                />
                                            </label>
                                        </Box>
                                    )}
                                />

                                <Controller
                                    name="orderType"
                                    control={control}
                                    render={({ field }) => (
                                        <Box>
                                            <label htmlFor="repair-sañe">
                                                Reparación con productos
                                                <Checkbox
                                                    id="repair-sale"
                                                    classes={{
                                                        checked:
                                                            classes.checked,
                                                    }}
                                                    checked={
                                                        field.value === '2'
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={() =>
                                                        field.onChange('2')
                                                    }
                                                    inputProps={{
                                                        'aria-label':
                                                            'primary checkbox',
                                                    }}
                                                />
                                            </label>
                                        </Box>
                                    )}
                                />
                            </Box>
                            {errors.orderType && (
                                <p>{errors.orderType.message}</p>
                            )}
                        </Box>
                    </Box>
                </Box>
                {(watchOrderType === '1' || watchOrderType === '2') && (
                    <Box>
                        <h4>Concepto o descripción de la reparación</h4>
                        <Box style={{ marginBottom: '1rem' }}>
                            <Controller
                                name="repairTotal"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        multiline={true}
                                        error={fieldState.error ? true : false}
                                        errorMessage={fieldState.error}
                                        icon={null}
                                        label={'Total de la reparación'}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </Box>
                        <Box className={classes.descriptionRow}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        rows={5}
                                        multiline={true}
                                        error={fieldState.error ? true : false}
                                        errorMessage={fieldState.error}
                                        icon={null}
                                        label={'Descripción'}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                )}
                {(watchOrderType === '0' || watchOrderType === '2') && (
                    <>
                        <h4>Agrega productos a tu nueva orden</h4>
                        <Box>
                            <form ref={formRef}>
                                <Box className={classes.inputWrapper}>
                                    <TextInput
                                        name={'search'}
                                        error={false}
                                        errorMessage={null}
                                        icon={null}
                                        label={'Busca por nombre'}
                                        value={searchValue}
                                        onChange={({ target }) => {
                                            setSearchValue(target.value)
                                            debouncedChangeHandler(target.value)
                                        }}
                                    />
                                    {isOpen && (
                                        <ClickAwayListener
                                            onClickAway={() => setIsOpen(false)}
                                        >
                                            <Box
                                                className={classes.productsList}
                                            >
                                                {options.map(
                                                    (product, index) => {
                                                        return (
                                                            <Box
                                                                key={`product-item-${index}`}
                                                                className={
                                                                    classes.productsListItem
                                                                }
                                                                onClick={() => {
                                                                    addProduct(
                                                                        product
                                                                    )
                                                                    setIsOpen(
                                                                        false
                                                                    )
                                                                    setSearchValue(
                                                                        ''
                                                                    )
                                                                }}
                                                            >
                                                                <p>
                                                                    {
                                                                        product.name
                                                                    }
                                                                </p>
                                                            </Box>
                                                        )
                                                    }
                                                )}
                                            </Box>
                                        </ClickAwayListener>
                                    )}
                                </Box>
                            </form>
                        </Box>

                        <h4>Productos agregados:</h4>
                        <GridContainer>
                            {fields.map((product, index) => {
                                return (
                                    <GridItem
                                        key={`selected-product-${index}`}
                                        xs={12}
                                        sm={6}
                                        md={4}
                                    >
                                        <Box className={classes.productCard}>
                                            <Box
                                                className={classes.trashIcon}
                                                onClick={() =>
                                                    removeProduct(product._id)
                                                }
                                            >
                                                <DeleteForeverIcon />
                                            </Box>
                                            <p>
                                                Nombre:{' '}
                                                <strong>{product.name}</strong>
                                            </p>
                                            <p>
                                                Id:{' '}
                                                <strong>{product._id}</strong>
                                            </p>
                                            <Box
                                                className={
                                                    classes.productQuantityWrapper
                                                }
                                            >
                                                <p>Cantidad:</p>
                                                <ProductQuantityCounter
                                                    onChange={(
                                                        product,
                                                        quantity
                                                    ) =>
                                                        handleQuantity(
                                                            product,
                                                            quantity
                                                        )
                                                    }
                                                    product={product}
                                                />
                                            </Box>
                                            <p>
                                                Precio:{' '}
                                                <strong>{product.price}</strong>
                                            </p>
                                        </Box>
                                    </GridItem>
                                )
                            })}
                            {watchProducts.length === 0 && (
                                <GridItem>
                                    <p>No has seleccionado ningún producto</p>
                                </GridItem>
                            )}
                        </GridContainer>
                        {errors.products && (
                            <GridItem>
                                <p>{errors.products.message}</p>
                            </GridItem>
                        )}
                    </>
                )}
                <Box>
                    <h5>Metodo de pago:</h5>
                    <Box className={classes.paymentWrapper}>
                        <Box>
                            <label htmlFor="cash">
                                Efectivo
                                <Checkbox
                                    id="cash"
                                    classes={{
                                        checked: classes.checked,
                                    }}
                                    checked={
                                        selectedPaymentMethod === 0
                                            ? true
                                            : false
                                    }
                                    onChange={() => setSelectedPaymentMethod(0)}
                                    inputProps={{
                                        'aria-label': 'primary checkbox',
                                    }}
                                />
                            </label>
                        </Box>
                        <Box>
                            <label htmlFor="card">
                                Transferencia o pago con tarjeta
                                <Checkbox
                                    id="card"
                                    classes={{
                                        checked: classes.checked,
                                    }}
                                    checked={
                                        selectedPaymentMethod === 1
                                            ? true
                                            : false
                                    }
                                    onChange={() => setSelectedPaymentMethod(1)}
                                    inputProps={{
                                        'aria-label': 'primary checkbox',
                                    }}
                                />
                            </label>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <h4>Total de la orden:{handleTotal()}</h4>
                </Box>
                {formAlert && (
                    <Box>
                        <p>{formAlert}</p>
                    </Box>
                )}
                {Object.keys(errors).length > 0 && (
                    <Box>
                        <p>
                            Hay algunos errores en el formulario, verifica la
                            información para continuar
                        </p>
                    </Box>
                )}
                <Box className={classes.submitRow}>
                    <Button
                        isLoading={loadingCreateSale}
                        disabled={loadingCreateSale}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Guardar orden
                    </Button>
                </Box>
                <CustomModal
                    open={createSaleSuccess}
                    handleClose={handleSuccess}
                    icon={'success'}
                    title="¡Listo!"
                    subTitle="Tu orden se guardo exitosamente"
                    hasCancel={false}
                    hasConfirm={true}
                    cancelCb={() => {}}
                    confirmCb={handleSuccess}
                />
            </form>{' '}
        </Box>
    )
}
