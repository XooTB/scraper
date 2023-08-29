import validator from "validator";
// Cleans all the array and removes all the invalid links.

export const linkCleaner = (links) => {
  return links.filter((link) => validator.isURL(link["url"]));
};
