export default function containsLink(link, arr) {
  return arr.some((item) => {
    if (item.url === link) {
      return true;
    } else {
      return false;
    }
  });
}
