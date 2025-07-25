"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url) {
  if (!url) return;

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch product page HTML via proxy
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract title
    const title = $("#productTitle").text().trim();

    // Extract prices
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $("span.a-price-whole")
    );

    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    // Out of stock status
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    // Extract image URLs
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    // Extract discount rate
    const discountRate = $(".savingsPercentage")
      .text()
      .replace(/[-%]/g, "");

    // Extract description
    const description = extractDescription($);

    // Mock fallback data if unavailable
    const stars =
      $('span#acrPopover').attr("title")?.substring(0, 3) || "4.5";
    const reviewsCount =
      $('span#acrCustomerReviewText')
        .text()
        .replace(/\D/g, "") || "100";

    // Construct result object
    const data = {
      url,
      image: imageUrls[0] || "",
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate) || 0,
      category: "category",
      reviewsCount: Number(reviewsCount),
      stars: Number(stars),
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error) {
    console.error("Failed to scrape product:", error.message);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
