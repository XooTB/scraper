import { RequestQueue, CheerioCrawler, enqueueLinks } from "crawlee";
import { logger } from "../utils/logger.js";
import { handleItems } from "./controllers/common.controller.js";

export async function slScraper(url) {
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
          title: $(el).find(".caption>.name>a").text(),
          image: $(el)
            .find(".image-group>.image>.product-img div img")
            .attr("data-src"),
          price: $(el).find(".caption>.price div .price-new").text()
            ? $(el).find(".caption>.price div .price-new").text()
            : $(el).find(".caption>.price div .price-normal").text(),
          productLink: $(el)
            .find(".image-group>.image>.product-img")
            .attr("href"),
          storeName: "SkyLand",
        });
      });

      //   Link for the next Page.
      let linkArray = [];

      if ($(".pagination>li>.next").attr("href")) {
        linkArray.push($(".pagination>li>.next").attr("href"));
      }

      // Add the Links to the request Queue.
      await enqueueLinks({
        urls: linkArray,
        requestQueue,
      });

      // Add the Products to the Database.
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
        `Something went wrong while scraping SkyLand! Error Message: ${err.message}`
      )
    );
}
