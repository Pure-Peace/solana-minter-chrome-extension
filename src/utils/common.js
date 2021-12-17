export function cutAddress (address, offset = 6) {
  return address
    ? address.slice(0, offset) +
    '...' +
    address.slice(address.length - offset, address.length)
    : address
}
