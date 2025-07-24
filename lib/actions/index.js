"use server"

import Product from "../models/product.model";
import { connectDb } from "../mongoose";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreProduct(productUrl) {
    if(!productUrl) return
    try {
        await connectDb()
        const scrapedProduct = await scrapeAmazonProduct(productUrl);

        if(!scrapedProduct) return 

        let product= scrapedProduct
        const existingProduct= await Product.findOne({url:scrapedProduct.url})

        if(existingProduct){
            const updatedPriceHistory=[
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice}
            ]

        product={
            ...scrapedProduct,
            priceHistory:updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
        }
        }

        const newProduct= await Product.findOneAndUpdate({
            url:scrapedProduct.url},
            product,
            {upsert:true,new:true}
        )
        
        const id = newProduct._id.toString();

        // console.log(safeProduct)
        return id
    } catch (error) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}

export async function getProductById(productId){
    try {
        await connectDb()

        const product= await Product.findOne({_id:productId})

        if(!product) return null
        return product
    } catch (error) {
        console.log(error)
    }
}
export async function getAllProducts(){
    try {
        await connectDb()

        const products=await Product.find()
        return products
    } catch (error) {
        console.log(error)
    }
}

export async function getSimilarProducts(productId) {
  try {
    await connectDb();

    const currentProduct = await Product.findById(productId);

    if(!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId,userEmail) {
    try {
        await connectDb()
        const product = await Product.findById(productId)
        if(!product) return
        const userExists = product.users.some((user)=>user.email===userEmail)
        if(!userExists){
            product.users.push({email:userEmail})
            await product.save()

            const emailContent =await generateEmailBody(product,"WELCOME")

            await sendEmail(emailContent,[userEmail])
        }
    } catch (error) {
        console.log(error)
    }
}