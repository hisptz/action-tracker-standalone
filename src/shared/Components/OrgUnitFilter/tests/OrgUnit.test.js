import ReactDOM from "react-dom";
import React from "react";
import OrganisationUnitFilter from "../index";

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<OrganisationUnitFilter />, div)
    ReactDOM.unmountComponentAtNode(div)
})
