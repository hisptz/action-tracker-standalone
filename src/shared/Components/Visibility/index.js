import PropTypes from "prop-types";

export default function Visibility({children, visible}) {
    return (
        visible ? <div>
            {children}
        </div> : <></>
    )
}

Visibility.propTypes = {
    children: PropTypes.element.isRequired,
    visible: PropTypes.bool.isRequired
}

Visibility.defaultPropTypes = {
    visible: true,
    children: <></>
}
