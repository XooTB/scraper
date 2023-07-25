import { RequestQueue, CheerioCrawler, Dataset, enqueueLinks } from "crawlee";
import { addTechLandLink } from "../controllers/techLand.controller.js";

export async function techLandLinkScraper(url) {
  // Initialize the Request Queue.
  const requestQueue = await RequestQueue.open();

  //   Add the supplied URL to the the Request Queue.
  await requestQueue.addRequest({
    url: url,
  });

  // Initialize a new Crawler and Crawl the Request Queue.
  const crawler = new CheerioCrawler({
    requestQueue,
    async requestHandler({ $, request }) {
      // Data Array.
      const data = [];

      // Extract the Product Data from the page.
      $(".j-menu>.flyout-menu-item").each((i, el) => {
        data.push({
          category: $(el).children().first().find(".links-text").text(),
          url: $(el).children().first().attr("href"),
        });
      });

      await addTechLandLink(data);
    },
  });

  await crawler.run().catch((err) => console.log(err));
}
