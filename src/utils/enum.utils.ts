export const getEnumKeyByEnumValue = <T = any>(
  myEnum: T,
  enumValue: number | string,
): string | undefined => {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : undefined;
};
