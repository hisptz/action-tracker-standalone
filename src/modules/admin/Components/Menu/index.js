import {Menu, MenuItem} from '@dhis2/ui'
import React from 'react';
import {useHistory, useLocation} from "react-router-dom";
import _ from 'lodash';
import PropTypes from "prop-types";
import i18n from '@dhis2/d2-i18n'
export default function AdminMenu({menu}) {
    const history = useHistory();
    const location = useLocation();

    return (
        <Menu >
            {
                _.map(menu, ({pathname, icon, label}, index) =>
                    <div key={`${pathname}-menu`}>
                        <MenuItem
                            dataTest={`menu-item-${pathname}`}
                            active={location.pathname === pathname}
                            onClick={_ => history.replace(pathname)}
                            icon={icon}
                            label={i18n.t('{{- label }}', {label})}/>
                        {index !== menu.length - 1 &&
                        <div style={{padding: 2}}/>}</div>)
            }
        </Menu>
    )
}


AdminMenu.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.object).isRequired
}
