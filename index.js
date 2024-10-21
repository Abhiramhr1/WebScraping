const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false, //will show the browser
        defaultViewport: null, // adjusts to the screen
        userDataDir: "./tmp" // remembers user data
    });
    const page = await browser.newPage();
    await page.goto('https://www.amazon.in/s?k=mobiles&crid=3KNIB3VBEQIPF&sprefix=mobile%2Caps%2C211&ref=nb_sb_noss_1');

    const products = await page.$$('.s-main-slot .s-result-item');
    console.log(products);
    
    console.log(`Number of products found: ${products.length}`); // Debugging

    if (products.length === 0) {
        console.log('No products found. The selector might need adjustment.');
    }

    for (const product of products) {
        //page.evaluate() runs JavaScript within the browser context, accessing the DOM to perform actions or retrieve data.
        // page.evaluate(pageFunction)
// This method runs the function in the context of the page and has access to the entire DOM.
// - pageFunction: A function that runs in the page context and can return any value.

// Example usage:
//const pageTitle = await page.evaluate(() => document.title);
        //page.$eval is there refer cleartrip.js for it
        const title = await page.evaluate(el => el.querySelector('h2 > a > span')?.textContent, product); 
        const price = await page.evaluate(el => el.querySelector('.a-price >span')?.textContent,product);
        // console.log(title,price);
    }

    // await browser.close();
})();
