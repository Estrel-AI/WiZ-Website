export function maskEmail(value: string) {
  const [name, domain] = value.split("@");
  if (!domain) {
    return value;
  }
  return `${name.slice(0, 2)}***@${domain}`;
}
