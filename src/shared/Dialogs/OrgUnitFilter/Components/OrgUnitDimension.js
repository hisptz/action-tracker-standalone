import useOrgUnitsRoot from "../hooks/useOrgUnitsRoot";
import React from 'react';
import {OrganisationUnitTree, Box, CircularLoader, CenteredContent} from '@dhis2/ui';
import PropTypes from 'prop-types';
import '../styles/styles.css'

export default function OrgUnitDimension({onSelect, selectedOrgUnitPaths = [],   onDeselect, onUpdate}) {
    const {roots, error, loading} = useOrgUnitsRoot();

    function isOrgUnitSelected(orgUnit) {
        return selectedOrgUnitPaths.includes(orgUnit);
    }

    return (
        <Box maxHeight='400px' minHeight='400px'>
            <div className='org-unit-filter-wrapper'>
                {
                    error && <CenteredContent><p>{error?.message || error.toString()}</p></CenteredContent>
                }
                {
                    roots &&
                    <OrganisationUnitTree
                        selected={selectedOrgUnitPaths}
                        roots={roots?.map(({id}) => id)}
                        onChange={(orgUnit) => {
                            onUpdate(orgUnit);
                            if (isOrgUnitSelected(orgUnit.path)) {
                                onDeselect(orgUnit)
                            } else {
                                onSelect(orgUnit)
                            }
                        }
                        }

                        singleSelection
                    />
                }{
                (loading && !error) &&  (<CenteredContent><CircularLoader small/></CenteredContent>)
            }
            </div>
        </Box>
    )

}

OrgUnitDimension.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    selectedOrgUnits: PropTypes.arrayOf(PropTypes.string),
    onUpdate: PropTypes.func
}
