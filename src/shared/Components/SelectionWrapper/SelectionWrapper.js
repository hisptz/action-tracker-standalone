import Box from '@material-ui/core/Box';
import { FilterComponentTypes } from '../../../core/constants';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n'
export function SelectionWrapper({
  type,
  onClick,
  dataObj,
  periodItems, ...props
}) {
  const componentTypes = {
    [FilterComponentTypes.ORG_UNIT]: {
      text: i18n.t('Selected organisation unit'),
      data: dataObj ? dataObj : null,
    },
    [FilterComponentTypes.PERIOD]: {
      text: i18n.t('Selected period'),
      data: dataObj ? dataObj : null,
    },
  };
  const selectDataObj = componentTypes[type] || null;
  const selectText =
    selectDataObj && selectDataObj.text ? selectDataObj.text : '';


  return (
    <Box
      component="div"
      style={{
        cursor: 'pointer',
      }}
      borderRadius="8px"
      height="6em"
      width="25rem"
      bgcolor="#EEEEEE"
      padding="1em"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      onClick={onClick}
        {...props}
    >
      <p style={{margin: 0, padding: 0, fontSize: '1.05em'}}>{selectText}</p>
      <Box
        component="div"
        marginTop="auto"
        borderLeft="4px solid #28468B"
        marginBottom="auto"
        marginLeft="0.5em"
        width="80%"
        height="40%"
        display="flex"
        flexDirection="row"
        paddingLeft="0.5em"
        textAlign="center"
      >
        <p style={{ marginTop: 'auto', marginBottom: 'auto', fontSize:'0.9em' }}>
          { type === FilterComponentTypes.ORG_UNIT &&
            selectDataObj?.data?.displayName}
          {type === FilterComponentTypes.PERIOD &&
             periodItems.name}
        </p>
      </Box>
    </Box>
  );
}
SelectionWrapper.defaultProps = {
  type: '',
  name: '',
};

SelectionWrapper.poprTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SelectionWrapper;
