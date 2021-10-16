import React, {useEffect, useRef} from "react";
import {formatSvg} from "../../../core/helpers/utils/utils";
import PropTypes from 'prop-types';
import {useRecoilValueLoadable} from "recoil";
import {Dhis2IconState} from "../../../core/states";

export default function DHIS2Icon({iconName, size, color, style}) {
    const {contents: icon, state} = useRecoilValueLoadable(Dhis2IconState(iconName));
    const iconRef = useRef();
    useEffect(() => {
        if (icon) {
            if (iconRef.current) {
                iconRef.current.innerHTML = formatSvg(icon, {size, color});
            }
        }
    }, [icon])
    return (
        state === 'loading' ? <div/> : <div id={`dhis2-icon-${iconName}`} style={style} ref={iconRef}/>
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
