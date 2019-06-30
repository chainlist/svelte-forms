export function max(val, args) {
  const maxValue = parseFloat(args[0]);
  const value = isNaN(val) ? val.length : parseFloat(val);

  return isNaN(value) ? true : value <= maxValue;
}