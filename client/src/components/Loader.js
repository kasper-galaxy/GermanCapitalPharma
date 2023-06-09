import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Loader = ({ my }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: my,
        marginBottom: my,
      }}
    >
      <CircularProgress style={{color:'#D30808'}} />
    </div>
  );
};

Loader.defaultProps = {
  my: 40,
};

export default Loader;
