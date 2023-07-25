import React, { useEffect } from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// core components
import GridItem from 'components/Grid/GridItem.js'
import GridContainer from 'components/Grid/GridContainer.js'
import Table from 'components/Table/Table.js'
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'
import { useDispatch, useSelector } from 'react-redux'
import { getSale } from 'store/sales'

import { useParams } from 'react-router-dom'
import { Box } from '@material-ui/core'
import moment from 'moment'

import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const paymentMethod = {
    0: 'Efectivo',
    1: 'Transferencia o pago con tarjeta',
}

const orderType = {
    0: 'Venta',
    1: 'Reparación o mantenimiento',
    2: 'Venta y reparación',
}

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
    backButton: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        cursor: 'pointer',
    },
}

const useStyles = makeStyles(styles)

export default function SaleDetail() {
    const history = useHistory()
    const { id } = useParams()
    console.log('id', id)
    const classes = useStyles()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { saleData, loadingSaleData } = useSelector((state) => state.sales)

    useEffect(() => {
        dispatch(getSale({ access: user.token, id }))
    }, [])
    return (
        <>
            <Box
                className={classes.backButton}
                onClick={() => history.push('/admin/orders')}
            >
                <ArrowBackIcon />
                <p>Volver a ordenes</p>
            </Box>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>
                                Detalle de la orden {id}
                            </h4>
                            <p className={classes.cardCategoryWhite}>
                                Visualiza los productos y todo el detalle de la
                                orden
                            </p>
                        </CardHeader>
                        <CardBody>
                            {loadingSaleData ? (
                                <p>Cargando datos...</p>
                            ) : (
                                <Box>
                                    <p>
                                        Status:{' '}
                                        <strong>{saleData.status}</strong>
                                    </p>
                                    <p>
                                        Metodo de pago:{' '}
                                        <strong>
                                            {
                                                paymentMethod[
                                                    saleData.paymentMethod
                                                ]
                                            }
                                        </strong>
                                    </p>
                                    <p>
                                        Tipo de orden:{' '}
                                        <strong>
                                            {orderType[saleData.orderType]}
                                        </strong>
                                    </p>
                                    <p>
                                        Fecha:{' '}
                                        <strong>
                                            {' '}
                                            {moment(saleData.createdAt).format(
                                                'DD-MM-YYYY HH:mm:ss'
                                            )}{' '}
                                        </strong>
                                    </p>
                                    <p>
                                        Total de la orden:{' '}
                                        <strong> {saleData.total} </strong>
                                    </p>
                                    {saleData.description && <p>
                                        Descripción de la orden:{' '}
                                        <strong> {saleData.description} </strong>
                                    </p>}
                                    {saleData.products ? (
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={[
                                                'Id del producto',
                                                'Nombre del producto',
                                                'Cantidad',
                                                'Precio',
                                            ]}
                                            tableData={saleData.products.map(
                                                (product) => {
                                                    return [
                                                        product.data._id,
                                                        product.data.name,
                                                        product.quantity,
                                                        product.data.price,
                                                    ]
                                                }
                                            )}
                                        />
                                    ): (<p>Esta orden no contiene productos</p>)}
                                </Box>
                            )}
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </>
    )
}
