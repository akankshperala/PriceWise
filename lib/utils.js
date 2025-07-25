import { NextResponse } from "next/server";
import {
  getLowestPrice,
  getHighestPrice,
  getAveragePrice,
  getEmailNotifType
} from "@/lib/utils";
import { connectDb } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    await connectDb();

    const products = await Product.find({});

    if (!products || products.length === 0) {
      throw new Error("No products found in the database.");
    }

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        try {
          const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

          if (
            !scrapedProduct ||
            typeof scrapedProduct.currentPrice !== "number" ||
            isNaN(scrapedProduct.currentPrice)
          ) {
            console.warn(`Skipping invalid scrape for ${currentProduct.url}`);
            return null;
          }

          // Clean and update price history
          const updatedPriceHistory = [
            ...currentProduct.priceHistory,
            {
              price: scrapedProduct.currentPrice,
            },
          ].filter((entry) => typeof entry.price === "number" && !isNaN(entry.price));

          const product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
          };

          // Update product in DB
          const updatedProduct = await Product.findOneAndUpdate(
            { url: product.url },
            product,
            { new: true }
          );

          // Check for email notification
          const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

          if (emailNotifType && updatedProduct?.users?.length > 0) {
            const productInfo = {
              title: updatedProduct.title,
              url: updatedProduct.url,
            };

            const emailContent = await generateEmailBody(productInfo, emailNotifType);
            const userEmails = updatedProduct.users.map((user) => user.email);
            await sendEmail(emailContent, userEmails);
          }

          return updatedProduct;
        } catch (err) {
          console.error("Error while processing product:", currentProduct?.url, err);
          return null;
        }
      })
    );

    return NextResponse.json({
      message: "Cron job executed successfully",
      data: updatedProducts.filter(Boolean),
    });
  } catch (error) {
    console.error("CRON job failed:", error);
    return NextResponse.json(
      { error: `Failed to get all products: ${error.message}` },
      { status: 500 }
    );
  }
}
