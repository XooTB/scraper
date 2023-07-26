import { RequestQueue, CheerioCrawler, Dataset, enqueueLinks } from "crawlee";
import getDate from "../utils/getDate.js";
import { logger } from "../utils/logger.js";
import getDateTime from "../utils/getDateTime.js";
import { handleItems } from "./controllers/common.controller.js";
import { KeyValueStore } from "crawlee";

export async function tlScraper(url) {
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
      $(".product-layout>.product-thumb").each((i, el) => {
        data.push({
          title: $(el).find(".caption>.name a").text(),
          image: $(el).find(".image>.product-img div img").attr("src"),
          price: $(el).find(".caption>.price div").children().first().text(),
          productLink: $(el).find(".caption>.name a").attr("href"),
          storeName: "TechLand",
        });
      });

      // Link for the next Page.
      let linkArray = [];

      linkArray.push($(".pagination>li>.next").attr("href"));

      await enqueueLinks({
        urls: linkArray,
        requestQueue,
      });

      // Add the Links to the request Queue.

      for (let i in data) {
        if (await handleItems(data[i])) {
          continue;
        }
      }
    },
  });

  await crawler
    .run()
    .finally(() => {})
    .catch((err) =>
      logger.error(
        `Something went wrong with the scraper! Error Message: ${err.message}`
      )
    );
}
