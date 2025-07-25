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