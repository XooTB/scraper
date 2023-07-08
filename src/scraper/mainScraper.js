import { RequestQueue, CheerioCrawler, Dataset, enqueueLinks } from "crawlee";
import { addItem, handleItems } from "./controllers/ST_DB.controller.js";
import getDate from "../utils/getDate.js";
import { logger } from "../utils/logger.js";
import getDateTime from "../utils/getDateTime.js";

export async function scrapePage(url) {
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
      $(".p-item-details").each((i, el) => {
        data.push({
          title: $(el).find(".p-item-name a").text(),
          image: $(".p-item-img a img").attr("src"),
          price: $(el).find(".p-item-price>span").first().text(),
        });
      });

      // Link for the next Page.
      let nextPageLink = [];

      // Extract the Link to the next page.
      $(".pagination li a").each((i, el) => {
        if ($(el).text() === "NEXT") {
          nextPageLink.push($(el).attr("href"));
        }
      });

      // Add the Links to the request Queue.
      await enqueueLinks({
        urls: nextPageLink,
        requestQueue,
      });

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
