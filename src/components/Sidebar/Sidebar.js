/*eslint-disable*/
import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { NavLink, useLocation } from 'react-router-dom'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Icon from '@material-ui/core/Icon'
// core components
import AdminNavbarLinks from 'components/Navbars/AdminNavbarLinks.js'
import RTLNavbarLinks from 'components/Navbars/RTLNavbarLinks.js'

import styles from 'assets/jss/material-dashboard-react/components/sidebarStyle.js'
import { Box } from '@material-ui/core'

const useStyles = makeStyles(styles)

export default function Sidebar(props) {
    const classes = useStyles()
    let location = useLocation()
    const [activeTab, setActiveTab] = useState(null)
    // verifies if routeName is the one active (in browser input)
    function activeRoute(routeName) {
        return location.pathname.includes(routeName)
    }
    const hasVisibleRoutes = (route) => {
        console.log("route", route)
        let visibleRoutes = false;
        const childrenRoutes = route.childrens.filter(e => !e.noshow)
        if (childrenRoutes.length > 0){
            visibleRoutes = true;
        }
        return visibleRoutes
    }
    
    const { color, logo, image, logoText, routes } = props
    var links = (
        <List className={classes.list}>
            {routes.map((prop, key) => {
                var listItemClasses

                listItemClasses = classNames({
                    [' ' + classes[color]]: activeRoute(
                        prop.layout + prop.path
                    ),
                })

                const whiteFontClasses = classNames({
                    [' ' + classes.whiteFont]: activeRoute(
                        prop.layout + prop.path
                    ),
                })

                return (
                    <NavLink
                        to={prop.layout + prop.path}
                        className={classes.item}
                        activeClassName="active"
                        key={key}
                        
                    >
                        <ListItem
                            button
                            className={classes.itemLink + listItemClasses}
                            onClick={()=>setActiveTab(key)}
                        >
                            {typeof prop.icon === 'string' ? (
                                <Icon
                                    className={classNames(
                                        classes.itemIcon,
                                        whiteFontClasses,
                                        {
                                            [classes.itemIconRTL]:
                                                props.rtlActive,
                                        }
                                    )}
                                >
                                    {prop.icon}
                                </Icon>
                            ) : (
                                <prop.icon
                                    className={classNames(
                                        classes.itemIcon,
                                        whiteFontClasses,
                                        {
                                            [classes.itemIconRTL]:
                                                props.rtlActive,
                                        }
                                    )}
                                />
                            )}
                            <ListItemText
                                primary={
                                    props.rtlActive ? prop.rtlName : prop.name
                                }
                                className={classNames(
                                    classes.itemText,
                                    whiteFontClasses,
                                    {
                                        [classes.itemTextRTL]: props.rtlActive,
                                    }
                                )}
                                disableTypography={true}
                            />
                        </ListItem>
                        {prop.childrens && activeTab === key && (
                            hasVisibleRoutes(prop) &&
                           ( <Box className={classes.childrensContainer}>
                                {prop.childrens?.map((e, i) => {
                                    if (e.noshow) return
                                    return (
                                        <NavLink
                                            to={
                                                prop.layout + prop.path + e.path
                                            }
                                            className={classes.item}
                                            activeClassName={
                                                classes.childrenActive
                                            }
                                            style={{
                                                color:
                                                    location.pathname ===
                                                    prop.layout +
                                                        prop.path +
                                                        e.path
                                                        ? '#fff'
                                                        : '#00ACC1',
                                            }}
                                            key={`child-route-${i}`}
                                        >
                                            {e.name}
                                        </NavLink>
                                    )
                                })}
                            </Box>)
                        )}
                    </NavLink>
                )
            })}
        </List>
    )

    return (
        <div>
            <Hidden mdUp implementation="css">
                <Drawer
                    variant="temporary"
                    anchor={props.rtlActive ? 'left' : 'right'}
                    open={props.open}
                    classes={{
                        paper: classNames(classes.drawerPaper, {
                            [classes.drawerPaperRTL]: props.rtlActive,
                        }),
                    }}
                    onClose={props.handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <div className={classes.sidebarWrapper}>
                        {links}
                    </div>
                    {image !== undefined ? (
                        <div
                            className={classes.background}
                            style={{ backgroundImage: 'url(' + image + ')' }}
                        />
                    ) : null}
                </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Drawer
                    anchor={props.rtlActive ? 'right' : 'left'}
                    variant="permanent"
                    open
                    classes={{
                        paper: classNames(classes.drawerPaper, {
                            [classes.drawerPaperRTL]: props.rtlActive,
                        }),
                    }}
                >
                    <div className={classes.sidebarWrapper}>{links}</div>
                    {image !== undefined ? (
                        <div
                            className={classes.background}
                            style={{ backgroundImage: 'url(' + image + ')' }}
                        />
                    ) : null}
                </Drawer>
            </Hidden>
        </div>
    )
}

Sidebar.propTypes = {
    rtlActive: PropTypes.bool,
    handleDrawerToggle: PropTypes.func,
    bgColor: PropTypes.oneOf(['purple', 'blue', 'green', 'orange', 'red']),
    logo: PropTypes.string,
    image: PropTypes.string,
    logoText: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
    open: PropTypes.bool,
}
