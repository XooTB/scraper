import { RequestQueue, CheerioCrawler, Dataset, enqueueLinks } from "crawlee";
import { logger } from "../utils/logger.js";
import { handleItems } from "./controllers/common.controller.js";

export async function ryansScraper(url) {
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
      $(".card").each((i, el) => {
        data.push({
          title: $(el).find(".card-body>.list-view-text>a").text().trimStart(),
          image: $(el).find(".image-box>a>img").attr("src"),
          price: $(el).find(".card-body>.pr-text").text(),
          productLink: $(el).find(".image-box>a").attr("href"),
          storeName: "Ryans",
        });
      });

      // Find the Link for the next Page.
      let linkArray = [];

      $(".pagination>li").each((i, el) => {
        if ($(el).find(".page-link").attr("rel") === "next") {
          linkArray.push($(el).find(".page-link").attr("href"));
        }
      });

      // Add the Links to the request Queue.
      await enqueueLinks({
        urls: linkArray,
        requestQueue,
      });

      //   Now send all the to be added or updated to the DB.

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
        `Something went wrong while scraping Ryans! Error Message: ${err.message}`
      )
    );
}
