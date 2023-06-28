import Store from "../../models/Store.js";
import containsLink from "../../utils/containsLink.js";

export const addLink = async (links) => {
  const newStore = {
    storeName: "StarTech",
    websiteUrl: "https://www.startech.com.bd/",
  };

  try {
    const store = await Store.findOne({ storeName: "StarTech" });
    if (!store) {
      await Store.create({
        ...newStore,
        links: [...links],
      });
      return true;
    }

    for (let i in links) {
      if (!containsLink(links[i]["url"], store.links)) {
        store.links.push(links[i]);
        continue;
      }
    }
    await store.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
