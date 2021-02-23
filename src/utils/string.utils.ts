export const capitalize = (input: string): string => {
  if (typeof input !== 'string') {
    throw new Error('Cannot capitalize non-string value');
  }
  return input.charAt(0).toUpperCase() + input.slice(1);
};
