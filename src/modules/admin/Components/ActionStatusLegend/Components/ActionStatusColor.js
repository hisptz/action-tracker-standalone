import Box from "@material-ui/core/Box";
import React from 'react';
import Paper from "@material-ui/core/Paper";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";

export default function ActionStatusColor({color = ''}) {
    return (color &&
      <Grid container spacing={1} style={{padding: 0}}>
          <Grid item>
              {color.toUpperCase()}
          </Grid>
          <Grid item>
              <Box width={20} height={20} component={Paper} elevation={0} style={{backgroundColor: color}}/>
          </Grid>
      </Grid>
    )
}

ActionStatusColor.propTypes = {
    color: PropTypes.string
}
