import ReactDOM from "react-dom";
import React from "react";
import PeriodFilter from "./index";


it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<PeriodFilter />, div)
    ReactDOM.unmountComponentAtNode(div)
})
