import React from 'react';

const Filter = ({filter, filterByName}) => {
    return (
      <div>filter shown with <input name='filter' value={filter} onChange={filterByName} /></div>
    )
  }

  export default Filter;