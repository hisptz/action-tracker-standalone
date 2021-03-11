import Box from '@material-ui/core/Box';
import { FilterComponentTypes } from '../../../core/constants/constants';
import PropTypes from 'prop-types';

export function SelectionWrapper({
  type,
  name,
  onClick,
  dataObj,
  periodItems
}) {
  const componentTypes = {
    [FilterComponentTypes.ORG_UNIT]: {
      text: 'Selected organisation unit',
      data: dataObj ? dataObj : null,
    },
    [FilterComponentTypes.PERIOD]: {
      text: 'Selected period',
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
    >
      <strong>{selectText}</strong>
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
        <p style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          { type === FilterComponentTypes.ORG_UNIT &&
            selectDataObj?.data?.displayName}
          {type === FilterComponentTypes.PERIOD &&
             periodItems[0]?.name}
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
  type: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
};

export default SelectionWrapper;
