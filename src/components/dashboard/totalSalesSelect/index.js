import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { getSalesByDate } from 'store/dashboard'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'

const useStyles = makeStyles({
    root: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-end',
    },
})

export default function TotalSalesSelect() {
    const classes = useStyles()
    //redux
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    //states

    const [selectedValue, setSelectedValue] = useState(new Date())

    const onChange = (value) => {
        console.log("value", moment(value).format('DD-MM-YYYY'))
        setSelectedValue(value)
        dispatch(
            getSalesByDate({
                access: user.token,
                from: moment(value).format('DD-MM-YYYY'),
            })
        )

        return
    }
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Box className={classes.root}>
                <KeyboardDatePicker
                    maxDate={new Date()}
                    onChange={onChange}
                    value={selectedValue}
                />
            </Box>
        </MuiPickersUtilsProvider>
    )
}
