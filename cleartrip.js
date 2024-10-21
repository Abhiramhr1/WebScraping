const puppeteer = require('puppeteer');

const months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};
const getMonthName = (month) => {
    const monthss = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthss[month];
};
const getDayOfWeek = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    await page.goto('https://www.cleartrip.com/');

    try {
        await page.waitForSelector('.sc-aXZVg .dXdrGF');
        await page.click('body > div.sc-aXZVg.giJDJw.overlay-bg.oy-scroll.p-fixed.flex.w-100p.h-100p.t-0.flex-middle.z-100.c-h-100vh > div > div > div > div > div.sc-aXZVg.fSQLlF.bg-white.brLoginNew-4.o-hidden.flex.flex-column.br-8 > div > div.pt-6.flex.flex-top.flex-between.pb-6 > div.pb-1.px-1.flex.flex-middle.nmx-1 > svg');

        //typing from and to
        // Assuming the placeholder for the "from" field is "From"
    await page.waitForSelector('input[placeholder="Where from?"]',{ visible: true });
    await page.type('input[placeholder="Where from?"]', 'Bangalore', { delay: 50 });
    await delay(500);
    await page.waitForSelector('.airportList')
    const airport = await page.$('.airportList li:first-child');
    if (airport) {
        await airport.click();
    } else {
        console.log('Airport list not found');
    }
    await page.waitForSelector('input[placeholder="Where to?"]',{ visible: true });
    await page.type('input[placeholder="Where to?"]', 'Mumbai', { delay: 50 });
    await delay(500);
    await page.waitForSelector('.airportList')
    const airport1 = await page.$('.airportList li:first-child');
    if (airport1) {
        await airport1.click();
    } else {
        console.log('Airport list not found');
    }
    //moving on to date selection
        console.log('Now clicking the date gui');

        await page.waitForSelector('div.focus\\:bc-secondary-500.t-all.c-pointer.flex');
        await page.click('.sc-aXZVg .kbqZVS .hyPqfo .bqNMow .c-pointer');
        const month = 'December';
        const date = 3;

        await page.waitForSelector('.DayPicker-Caption')
        let currentMonthElement = await page.$eval('.DayPicker-Caption', el => el.textContent);
        console.log('Current Month:', currentMonthElement);
       
        while (true && currentMonthElement) {
            await page.waitForSelector('.DayPicker-Months');
            currentMonthElement = currentMonthElement.split(' ')[0];
        
            if (currentMonthElement === month) {
                break;
            } else {
                await page.click('#__next > div > main > div > div > div.sc-aXZVg.ifGglg.col-19.pl-2.pr-2 > div.sc-aXZVg.kbqZVS.row > div.sc-aXZVg.eesuEu.col-17.pl-2.pr-2 > div > div:nth-child(1) > div.sc-aXZVg.hyPqfo.sc-d927815e-0.iptgEZ.ba-solid.bc-line-500.br-12.bg-neutral-100.p-relative > div > div.sc-aXZVg.bqNMow > div > div > div > div.bg-neutral-100.br-12.p-absolute.z-50.w-100p.l-0.t-48.t-52.br-12 > div.DayPicker.w-100p > div > div.flex.flex-middle.flex-between.p-absolute.w-100p.px-5 > div.flex-1.ta-right > svg > path'); // Click the next month button
                
                console.log('Clicked next month button');

                await delay(500); 
                currentMonthElement = await page.$eval('.DayPicker-Caption', el => el.textContent);
            }
        }
        await delay(500); 

        const targetDate = new Date(`2025-${getMonthName(8)}-${date}`);
        const dayOfWeek = getDayOfWeek(targetDate);
        const year = targetDate.getFullYear();
        console.log(year,targetDate,dayOfWeek);
        const ariaLabel = `${dayOfWeek} ${getMonthName(8)} ${date} ${year}`;
        console.log(`Target aria-label: ${ariaLabel}`);
       
        const dateSelector = `[aria-label="${ariaLabel}"]`;
        const dateElement = await page.$(dateSelector);

        if (dateElement) {
            await dateElement.click();
            console.log(`Clicked on the date: ${ariaLabel}`);
        } else {
            console.log('Date element not found');
        }
        await page.waitForSelector('div.sc-aXZVg.ibOtJI.flex.flex-row.flex-between > button')
        await page.click('div.sc-aXZVg.ibOtJI.flex.flex-row.flex-between > button')
        

        //----> now its time to retrieve flight details
        await page.waitForSelector('.flex-1')

        const flights = await page.$$('[data-testid="airlineBlock"]');
        if(flights)
        {
            console.log(flights.length);
            for(const flight of flights)
            {
                console.log('hello');
                const name = await flight.$eval('.fw-500 .fs-2 .c-neutral-900',el=>el.textContent.textContent);
                console.log(name);
            }
        }
        else{
            console.log('no flights found');
        }


        // page.$eval() is a shorthand method that combines querying a single DOM element and running a function on that element directly.
        // page.$eval(selector, pageFunction)
        // This method takes a selector and a function as arguments. It runs the function in the context of the selected element.
        // - selector: A string to query the element.
        // - pageFunction: A function that runs on the element and returns a value.

        // Example usage:
        // const elementText = await page.$eval('h1', el => el.textContent);
        // page.evaluate is also there refer index.js
    } catch (err) {
        console.log("Error:", err);
    }
})();
