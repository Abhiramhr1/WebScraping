const express = require('express');
const app = express();
const request = require('request-promise');
const cheerio = require('cheerio');

const scrape = async () => {
    try{
    const url = "https://www.imdb.com/title/tt13207736/?ref_=hm_top_tt_t_1";
    const response = await request({
        uri: url,
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9',
            'referer': 'https://www.imdb.com/title/tt13207736/mediaviewer/rm2683399937/?ref_=tt_ov_i',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
        },
        gzip:true,
    });

    let $ = cheerio.load(response);
    let title = $('div[class="sc-70a366cc-0 bxYZmb"] > h1').text();
    console.log('hi');
    console.log(title);
}
catch(err){
console.log(err);
}
};

scrape();

app.listen(3000, () => {
    console.log('The server is listening at port: 3000');
});
