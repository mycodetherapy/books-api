export const trimStrings = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ])
  );
};
