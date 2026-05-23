import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        // Increase viewport to ensure a full desktop capture before fullPage screenshot
        await page.setViewport({ width: 1440, height: 900 });
        
        await page.goto(url, { waitUntil: "networkidle2" });
        
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
