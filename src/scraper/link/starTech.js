import { RequestQueue, CheerioCrawler, Dataset, enqueueLinks } from "crawlee";
import { addStarTechLink } from "../controllers/starTech.controller.js";

export async function starTechLinkScraper(url) {
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
      $(".drop-menu-1>li").each((i, el) => {
        data.push({
          category: $(el).find("a").first().text(),
          url: $(el).find("a").attr("href"),
        });
      });

      await addStarTechLink(data);
    },
  });

  await crawler.run().catch((err) => console.log(err));
}
