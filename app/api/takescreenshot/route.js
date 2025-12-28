import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");  // Ensure this matches frontend
    const stringurl = 'http://localhost:3000/stock/66f9bfe39d94d5d534920be5';

    if (!stringurl) {
        return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(stringurl, { waitUntil: "networkidle2" });
        
        // Wait for the body element to ensure the page has loaded
        await page.waitForSelector('body');
        
        // Scroll to the bottom of the page
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        // Wait for a short moment to ensure the page has finished scrolling


        // Take a full-page screenshot
        const screenshot = await page.screenshot({ encoding: "base64", fullPage: true });

        await browser.close();
        
        console.log("Screenshot captured:", screenshot ? "Success" : "Failed");
        return NextResponse.json({ image: `data:image/png;base64,${screenshot}` });
    } catch (error) {
        console.error("Screenshot Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
