import { RequestQueue, CheerioCrawler } from "crawlee";
import { addSkylandLinks } from "../controllers/skyLand.controller.js";

export async function skyLandLinkScraper(url) {
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
      $(".main-menu>.j-menu>li>.dropdown-toggle").each((i, el) => {
        data.push({
          category: $(el).find(".links-text").text(),
          url: $(el).attr("href"),
        });
      });

      await addSkylandLinks(data);
    },
  });

  await crawler.run().catch((err) => console.log(err));
}
