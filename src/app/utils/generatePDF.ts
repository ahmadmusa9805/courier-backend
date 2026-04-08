
import puppeteer from "puppeteer"; // or puppeteer-core if you prefer
import { Buffer } from "buffer";


export async function generatePDF(html: string): Promise<Buffer> {
  // ✅ Launch Puppeteer using your local Chrome
  const browser = await puppeteer.launch({
    headless: true, // true = no browser window
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // your installed Chrome
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // helps on Windows
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer as Buffer;  // Cast to Buffer to resolve type mismatch
}