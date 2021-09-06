import { useState } from 'react';

export default () => {
  const [paletteConfigCollapsed, setPaletteConfigCollapsed] = useState<boolean>(true);
  return {
    paletteConfigCollapsed,
    setPaletteConfigCollapsed,
  };
};
