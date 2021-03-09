import Box from '@material-ui/core/Box';
import { FilterComponentTypes } from '../../../core/constants/Constants';
import PropTypes from 'prop-types';

export function SelectionWrapper({ type, name, onClick, dataObj }) {
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
  const selectTextObj = componentTypes[type] || null;
  const selectText =
    selectTextObj && selectTextObj.text ? selectTextObj.text : '';
    console.log({dataObj});

  return (
    <Box
      component="div"
      style={{
        cursor: 'pointer',
      }}
      borderRadius="8px"
      height="7rem"
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
          {selectTextObj?.data?.displayName}
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
