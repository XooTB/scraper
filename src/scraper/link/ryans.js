import { RequestQueue, CheerioCrawler, Dataset, enqueueLinks } from "crawlee";
import { addRyansLink } from "../controllers/ryans.controller.js";

export const ryansLinkScraper = async (url) => {
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
      $(".col-megamenu>.list-unstyled>li>a").each((i, el) => {
        data.push({
          category: $(el).text(),
          url: $(el).attr("href"),
        });
      });

      await addRyansLink(data);
    },
  });

  // Finally run the crawler.
  await crawler.run().catch((err) => console.log(err));
};
