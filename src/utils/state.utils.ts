import React from 'react';

export const useForceUpdate = (): (() => void) => React.useReducer(() => ({}), {})[1] as () => void;
