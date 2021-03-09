import Box from '@material-ui/core/Box';
import { FilterComponentTypes } from '../../../core/constants/Constants';

export function SelectionWrapper({ type, name }) {
  const componentTypes = {
    [FilterComponentTypes.ORG_UNIT]: {
      text: 'Selected organisation unit',
    },
    [FilterComponentTypes.PERIOD]: {
      text: 'Selected period',
    },
  };
  const selectTextObj = componentTypes[type] || null;
  const selectText =
    selectTextObj && selectTextObj.text ? selectTextObj.text : '';

  return (
    <Box
      component="div"
      style={{
          cursor: 'pointer'
      }}
      borderRadius="8px"
      height="7rem"
      width="25rem"
      bgcolor="#EEEEEE"
      padding="1em"
      display="flex"
      flexDirection="column"
      justifyContent="center"
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
        <p style={{ marginTop: 'auto', marginBottom: 'auto' }}>MOH Tanzania</p>
      </Box>
    </Box>
  );
}
SelectionWrapper.defaultProps = {
  type: '',
  name: '',
};

export default SelectionWrapper;
