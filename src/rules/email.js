export function email(val, args) {
  // Email regex from Open Web Application Security Project (OWASP) : https://owasp.org/www-community/OWASP_Validation_Regex_Repository
  const regex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/

  return val && regex.test(val);
}