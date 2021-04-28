import React, {useEffect, useRef} from "react";
import {formatSvg} from "../../../core/services/utils";
import useDHIS2Icon from "./hooks/icon";
import PropTypes from 'prop-types';

export default function DHIS2Icon({iconName, size, color, style}) {
    const {icon} = useDHIS2Icon(iconName);
    const iconRef = useRef();
    useEffect(() => {
        if (icon) {
            if (iconRef.current) {
                iconRef.current.innerHTML = formatSvg(icon, {size, color});
            }
        }
    }, [icon])
    return (
        <div style={style} ref={iconRef}/>
    )
}

DHIS2Icon.defaultProps = {
    iconName: '',
    size: 14,
    color: '#000000',
    style: {}
}
DHIS2Icon.propTypes = {
    iconName: PropTypes.string.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.object
}
