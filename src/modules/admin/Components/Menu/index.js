import {Menu, MenuItem, MenuDivider} from '@dhis2/ui'
import React from 'react';
import {useHistory, useLocation} from "react-router-dom";
import _ from 'lodash';
import PropTypes from "prop-types";
import BackIcon from "@material-ui/icons/ArrowBack";

export default function AdminMenu({menu}) {
    const history = useHistory();
    const location = useLocation();
    const styles = {
        menu: {
            background: '#F8F9FA'
        }
    }
    return (
        <Menu style={styles.menu}>
            {
                _.map(menu, ({pathname, icon, label}, index) =>
                    <div key={`${pathname}-menu`}>
                        <MenuItem
                            active={location.pathname === pathname}
                            onClick={_ => history.replace(pathname)}
                            icon={icon}
                            label={label}/>
                        {index !== menu.length - 1 &&
                        <div style={{padding: 1}} />}</div>)
            }
        </Menu>
    )
}


AdminMenu.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.object).isRequired
}
