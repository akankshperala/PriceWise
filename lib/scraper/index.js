// "use server"

// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import {  extractDescription, extractPrice } from '../utils';

// export async function scrapeAmazonProduct(url) {
//   if(!url) return;

//   // BrightData proxy configuration
//   const username = String(process.env.BRIGHT_DATA_USERNAME);
//   const password = String(process.env.BRIGHT_DATA_PASSWORD);
//   const port = 22225;
//   const session_id = (1000000 * Math.random()) | 0;

//   const options = {
//     auth: {
//       username: `${username}-session-${session_id}`,
//       password,
//     },
//     host: 'brd.superproxy.io',
//     port,
//     rejectUnauthorized: false,
//   }

//   try {
//     // Fetch the product page
//     const response = await axios.get(url, options);
//     const $ = cheerio.load(response.data);

//     // Extract the product title
//     const title = $('#productTitle').text().trim();
//     const currentPrice = extractPrice(
//       $('.priceToPay span.a-price-whole'),
//       $('.a.size.base.a-color-price'),
//       $('.a-button-selected .a-color-base'),
//     );

//     const originalPrice = extractPrice(
//       $('#priceblock_ourprice'),
//       $('.a-price.a-text-price span.a-offscreen'),
//       $('#listPrice'),
//       $('#priceblock_dealprice'),
//       $('.a-size-base.a-color-price')
//     );

//     const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

//     const images = 
//       $('#imgBlkFront').attr('data-a-dynamic-image') || 
//       $('#landingImage').attr('data-a-dynamic-image') ||
//       '{}'

//     const imageUrls = Object.keys(JSON.parse(images));

//     // const currency = extractCurrency($('.a-price-symbol'))
//     const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

//     const description = extractDescription($)

//     // Construct data object with scraped information
//     const data = {
//       url,
//     //   currency: currency || '$',
//       image: imageUrls[0],
//       title,
//       currentPrice: Number(currentPrice) || Number(originalPrice),
//       originalPrice: Number(originalPrice) || Number(currentPrice),
//       priceHistory: [],
//       discountRate: Number(discountRate),
//       category: 'category',
//       reviewsCount:100,
//       stars: 4.5,
//       isOutOfStock: outOfStock,
//       description,
//       lowestPrice: Number(currentPrice) || Number(originalPrice),
//       highestPrice: Number(originalPrice) || Number(currentPrice),
//       averagePrice: Number(currentPrice) || Number(originalPrice),
//     }

//     return data;
//   } catch (error) {
//     console.log(error);
//   }}





"use server"
import axios from "axios"
import * as cheerio from 'cheerio'
import { extractDescription, extractPrice } from "../utils"
export async function scrapeAmazonProduct(url) {
    if (!url) return
    // curl -i --proxy brd.superproxy.io:33335 --proxy-user brd-customer-hl_a70a227f-zone-datacenter_proxy1:gu8dlsyhgbml "https://geo.brdtest.com/welcome.txt?product=dc&method=native"
    const username = String(process.env.BRIGHT_DATA_USERNAME)
    const password = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 33335
    const session_id = (1000000 * Math.random()) | 0
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }
    try {
        const response = await axios.get(url, options)
        const $ = cheerio.load(response.data)

        const title = $('#productTitle').text().trim()
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('span.a-price-whole')
        )
        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen')
        )

        // const image = $('#main-image').attr('data-a-hires') || $('#main-image').attr('src') 
        const image = $('#landingImage').attr('data-old-hires')
            || $('#landingImage').attr('src')
            || $('img').first().attr('src');
        const discountrate = $('span.reinventPriceSavingsPercentageMargin').text().replace(/[-%]/g,'')
        const stars = $('span#acrPopover').attr('title').substring(0,1)
        const reviewsCount = $('span#acrCustomerReviewText').attr('aria-label').replace(/\D/g,'')
        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable'
        const description=extractDescription($)
        const data={
            url,
            image:image,
            title,
            currentPrice:Number(currentPrice) || Number(originalPrice),
            originalPrice:Number(originalPrice) || Number(currentPrice),
            priceHistory:[],
            discountrate:Number(discountrate),
            category:'category',
            reviewsCount,
            stars,
            isoutOfStock:outOfStock,
            description,
            lowerPrice:Number(currentPrice) || Number(originalPrice),
            highestPrice:Number(originalPrice) || Number(currentPrice),
            averagePrice:Number(currentPrice) || Number(originalPrice),
        }
        return data
    } catch (error) {
        throw new Error(`failed to scrape product: ${error.message}`)
    }
}