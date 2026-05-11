export function maskUserName(name) {
  if (!name) {
    return "익명";
  }

  if (name.length <= 1) {
    return "*";
  }

  if (name.length === 2) {
    return `${name[0]}*`;
  }

  if (name.length === 3) {
    return `${name[0]}*${name[2]}`;
  }

  return `${name.slice(0, 2)}${"*".repeat(name.length - 3)}${name.slice(-1)}`;
}