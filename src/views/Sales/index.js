import React, { useEffect, useState } from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// core components
import GridItem from 'components/Grid/GridItem.js'
import GridContainer from 'components/Grid/GridContainer.js'
import Table from 'components/Table/Table.js'
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'
import Button from 'components/CustomButtons/Button'
import ReactPaginate from 'react-paginate'


//icons 
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { useDispatch, useSelector } from 'react-redux'
import {
    // getSales,
    changeSalesStatus,
} from 'store/sales'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import {
    Box,
    Checkbox,
    ClickAwayListener,
    Dialog,
    DialogTitle,
    Fade,
    MenuItem,
    MenuList,
    Popper,
} from '@material-ui/core'
import moment from 'moment'
import { getSales } from 'store/sales'

const styles = {
    cardCategoryWhite: {
        '&,& a,& a:hover,& a:focus': {
            color: 'rgba(255,255,255,.62)',
            margin: '0',
            fontSize: '14px',
            marginTop: '0',
            marginBottom: '0',
        },
        '& a,& a:hover,& a:focus': {
            color: '#FFFFFF',
        },
    },
    cardTitleWhite: {
        color: '#FFFFFF',
        marginTop: '0px',
        minHeight: 'auto',
        fontWeight: '300',
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: '3px',
        textDecoration: 'none',
        '& small': {
            color: '#777',
            fontSize: '65%',
            fontWeight: '400',
            lineHeight: '1',
        },
    },
    filtersWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    dropdown: {
        backgroundColor: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        zIndex: 100,
        position: 'relative',
    },
    activeStatus: {
        backgroundColor: '#c2c2c2',
    },
    modalBody: {
        padding: '1rem',
    },
    paymentImageRow: {
        display: 'flex',
        justifyContent: 'center',
    },
    paymentImage: {
        maxWidth: '166px',
    },
    dropZone: {
        borderRadius: '16px',
        border: 'solid 1px #c2c2c2',
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        flexDirection: 'column',
        alignItems: 'center',
    },
    modalButtonRow: {
        display: 'flex',
        justifyContent: 'center',
    },
    pagination: {
        display: 'flex',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        gap: '1rem',
        marginTop: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
    },
    page: {
        padding: '.5rem',
        borderRadius: '4px',
        border: 'solid 1px transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '25px',
        height: '25px',
        "& > a":{
            color:'#3c4858'

        }
    },
    activePage: {
        border: 'solid 1px #00ACC1 !important',
        "& > a":{
            color:'#00ACC1'

        }
    },
}

const useStyles = makeStyles(styles)

export default function Sales() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { salesData, loadingSalesData } = useSelector((state) => state.sales)
    const [page, setPage] = useState(0)

    const handlePageClick = ({ selected }) => {
        setPage(selected)
        const element = document.getElementById('table-header')
        element.scrollIntoView()
    }

    useEffect(() => {
        dispatch(getSales({ access: user.token, filters: {page:0} }))
    }, [])
    console.log('salesData', salesData)
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary" id="table-header">
                        <h4 className={classes.cardTitleWhite}>
                            Tabla de ordenes
                        </h4>
                        <p className={classes.cardCategoryWhite}>
                            Aquí podras visualizar todas tus ordenes, cambiar su
                            estatus y acceder al detalle de cada orden
                        </p>
                    </CardHeader>
                    <CardBody>
                        {/* <Box className={classes.filtersWrapper}>
                            <Button
                                isLoading={false}
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => handleFilter(null)}
                            >
                                Todos
                            </Button>
                            <Button
                                isLoading={false}
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => handleFilter(0)}
                            >
                                Pendiente
                            </Button>
                            <Button
                                isLoading={false}
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => handleFilter(1)}
                            >
                                Aceptado
                            </Button>
                            <Button
                                isLoading={false}
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => handleFilter(2)}
                            >
                                Pagado
                            </Button>
                            <Button
                                isLoading={false}
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => handleFilter(3)}
                            >
                                En ruta
                            </Button>
                            <Button
                                isLoading={false}
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => handleFilter(4)}
                            >
                                Entregado
                            </Button>
                            <Button
                                isLoading={false}
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => handleFilter(5)}
                            >
                                Cancelado
                            </Button>
                        </Box> */}
                        {loadingSalesData ? (
                            <p>Cargando datos...</p>
                        ) : (
                            <>
                            <Table
                                tableHeaderColor="primary"
                                tableHead={[
                                    'Id',
                                    'Total',
                                    'Fecha',
                                    'Estatus',
                                    'Acciones',
                                ]}
                                tableData={salesData.sales.map((e) => {
                                    console.log('e', e)
                                    return [
                                        <p key={`sale-id-${e._id}`}>{e._id}</p>,
                                        <p key={`sale-total-${e._id}`}>
                                            {e.total}
                                        </p>,
                                        <p key={`sale-date-${e._id}`}>
                                            {moment(e.createdAt).format(
                                                'DD-MM-YYYY HH:mm:ss'
                                            )}
                                        </p>,
                                        <p key={`sale-status-${e._id}`}>
                                            {e.status}
                                        </p>,
                                        <Link
                                            key={`detail-button-${e._id}`}
                                            to={`/admin/orders/detail/${e._id}`}
                                        >
                                            <Button
                                                isLoading={false}
                                                variant="contained"
                                                color="primary"
                                                type="button"
                                            >
                                                Ver detalle
                                            </Button>
                                            ,
                                        </Link>,
                                    ]
                                })}
                            />
                              <ReactPaginate
                                    forcePage={page}
                                    pageClassName={classes.page}
                                    containerClassName={classes.pagination}
                                    activeClassName={classes.activePage}
                                    breakLabel="..."
                                    nextLabel={
                                        <Button
                                            isLoading={false}
                                            variant="contained"
                                            color="primary"
                                            type="button"
                                            justIcon
                                        >
                                            <ChevronRightIcon />
                                        </Button>
                                    }
                                    onPageChange={(e) => handlePageClick(e)}
                                    pageRangeDisplayed={5}
                                    pageCount={Math.ceil(
                                        salesData.pageInfo.total / 10
                                    )}
                                    previousLabel={
                                        <Button
                                            isLoading={false}
                                            variant="contained"
                                            color="primary"
                                            type="button"
                                            justIcon
                                        >
                                            <ChevronLeftIcon />
                                        </Button>
                                    }
                                    renderOnZeroPageCount={null}
                                />
                            </>
                        )}
                    </CardBody>
                  
                </Card>
            </GridItem>
        </GridContainer>
    )
}
const paymentSchema = yup.object({
    paymentMethod: yup
        .string()
        .oneOf(['1', '0'], 'Campo obligatorio')
        .required('Campo obligatorio'),
    status: yup.string().required(),
})
const ChangeStatusDropdown = ({ sale }) => {
    const dispatch = useDispatch()
    const { loadingChangeStatus } = useSelector((state) => state.sales)
    const { user } = useSelector((state) => state.auth)

    const classes = useStyles()
    //form
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(paymentSchema),
        defaultValues: {
            paymentMethod: '0',
            status: 2,
        },
    })
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [open, setOpen] = React.useState(false)
    const [showPaymentDialog, setShowPaymentDialog] = React.useState(false)

    const handleClick = (event) => {
        setOpen(!open)
        setAnchorEl(anchorEl ? null : event.currentTarget)
    }

    const onStatusChange = async (status) => {
        setOpen(false)
        setAnchorEl(null)
        if (status === 2) {
            setShowPaymentDialog(true)
            return
        }
        dispatch(
            changeSalesStatus({ access: user.token, id: sale._id, status })
        )
    }

    const submitPaymentMethod = async (values) => {
        dispatch(
            changeSalesStatus({
                access: user.token,
                id: sale._id,
                status: values.status,
                paymentMethod: values.paymentMethod,
            })
        )
    }

    useEffect(() => {
        if (loadingChangeStatus === sale._id) {
            setOpen(false)
            setAnchorEl(null)
            setShowPaymentDialog(false)
        }
    }, [loadingChangeStatus])

    return (
        <Box>
            <Button
                isLoading={loadingChangeStatus === sale._id}
                variant="contained"
                color="primary"
                type="button"
                onClick={handleClick}
            >
                Cambiar status
            </Button>
            <Popper
                open={open}
                anchorEl={anchorEl}
                transition
                placement={'top-start'}
                modifiers={{
                    preventOverflow: {
                        enabled: true,
                        boundariesElement: 'scrollParent',
                    },
                    flip: {
                        enabled: false,
                    },
                }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps}>
                        <ClickAwayListener
                            onClickAway={() => {
                                setOpen(false)
                                setAnchorEl(null)
                            }}
                        >
                            <div className={classes.dropdown}>
                                <MenuList role="menu">
                                    <MenuItem
                                        onClick={() => onStatusChange(0)}
                                        className={
                                            sale.status === 'PENDIENTE'
                                                ? classes.activeStatus
                                                : ''
                                        }
                                    >
                                        Pendiente
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => onStatusChange(1)}
                                        className={
                                            sale.status === 'ACEPTADO'
                                                ? classes.activeStatus
                                                : ''
                                        }
                                    >
                                        Aceptado
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => onStatusChange(2)}
                                        className={
                                            sale.status === 'PAGADO'
                                                ? classes.activeStatus
                                                : ''
                                        }
                                    >
                                        Pagado
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => onStatusChange(3)}
                                        className={
                                            sale.status === 'EN RUTA'
                                                ? classes.activeStatus
                                                : ''
                                        }
                                    >
                                        En ruta
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => onStatusChange(5)}
                                        className={
                                            sale.status === 'ENTREGADO'
                                                ? classes.activeStatus
                                                : ''
                                        }
                                    >
                                        Entregado
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => onStatusChange(4)}
                                        className={
                                            sale.status === 'CANCELADO'
                                                ? classes.activeStatus
                                                : ''
                                        }
                                    >
                                        Cancelado
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => onStatusChange(5)}
                                        className={
                                            sale.status === 'ENTREGADO'
                                                ? classes.activeStatus
                                                : ''
                                        }
                                    >
                                        Entregado
                                    </MenuItem>
                                </MenuList>
                            </div>
                        </ClickAwayListener>
                    </Fade>
                )}
            </Popper>
            <Dialog
                onClose={() => setShowPaymentDialog(false)}
                aria-labelledby="simple-dialog-title"
                open={showPaymentDialog}
            >
                <DialogTitle id="simple-dialog-title">
                    Seleccionar metodo de pago
                </DialogTitle>
                <Box className={classes.modalBody}>
                    <form onSubmit={handleSubmit(submitPaymentMethod)}>
                        <Box className={classes.paymentRow}>
                            <Controller
                                name="paymentMethod"
                                control={control}
                                render={({ field }) => (
                                    <label htmlFor="available">
                                        Efectivo
                                        <Checkbox
                                            id="available"
                                            classes={{
                                                checked: classes.checked,
                                            }}
                                            checked={
                                                field.value === '0'
                                                    ? true
                                                    : false
                                            }
                                            onChange={() => field.onChange('0')}
                                            inputProps={{
                                                'aria-label':
                                                    'primary checkbox',
                                            }}
                                        />
                                    </label>
                                )}
                            />
                            <Controller
                                name="paymentMethod"
                                control={control}
                                render={({ field }) => (
                                    <label htmlFor="available">
                                        Transferencia
                                        <Checkbox
                                            id="available"
                                            classes={{
                                                checked: classes.checked,
                                            }}
                                            checked={
                                                field.value === '1'
                                                    ? true
                                                    : false
                                            }
                                            onChange={() => field.onChange('1')}
                                            inputProps={{
                                                'aria-label':
                                                    'primary checkbox',
                                            }}
                                        />
                                    </label>
                                )}
                            />
                        </Box>
                        {errors.paymentMethod && (
                            <Box>{errors.paymentMethod.message}</Box>
                        )}

                        <Box className={classes.modalButtonRow}>
                            <Button
                                isLoading={loadingChangeStatus === sale._id}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Guardar
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Dialog>
        </Box>
    )
}

ChangeStatusDropdown.propTypes = {
    sale: PropTypes.object,
}
