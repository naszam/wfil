import React from 'react';
import Filecoin from './Filecoin';

const icons = {
  filecoin: Filecoin
}

const Icon = ({ name }) => {
  const IconComponent = icons[name];
  return <IconComponent />;
}
 
export default Icon;