export function min(val, args) {
  const minValue = parseFloat(args[0]);
  const value = isNaN(val) ? val.length : parseFloat(val);

  return value >= minValue;
}