// Checks if the Link already exists in the Store entry in the Database.

export default function containsLink(link, arr) {
  return arr.some((item) => {
    if (item.url === link) {
      return true;
    } else {
      return false;
    }
  });
}
