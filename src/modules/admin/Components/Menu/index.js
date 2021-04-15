import {Menu, MenuItem, MenuDivider} from '@dhis2/ui'
import React from 'react';
import {useHistory, useLocation} from "react-router-dom";
import _ from 'lodash';
import PropTypes from "prop-types";

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
                _.map(menu, ({pathname, icon, label}, index) => <><MenuItem key={`${pathname}-menu`}
                                                                            active={location.pathname === pathname}
                                                                            onClick={_ => history.replace(pathname)}
                                                                            icon={icon}
                                                                            label={label}/>{index !== menu.length - 1 &&
                <MenuDivider dense/>}</>)
            }
        </Menu>
    )
}




AdminMenu.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.object).isRequired
}
