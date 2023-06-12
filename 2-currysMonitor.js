const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const CronJob =require('cron').CronJob;
const $ = require('cheerio');

const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook("");
 
const embed = new MessageBuilder()
.setColor('#C8A2C8')
.setFooter('ArJoMonitors')

function displayTime(){
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM: "
    } else {
        str += "AM: "
    }
    return str;
}

let delay = (time) =>{
    return new Promise(function(resolve){
        setTimeout(resolve, time)
    });
}

async function goTo(pURL) {
    try {

        const browser = await puppeteer.launch(({ignoreHTTPSErrors: true , headless: false, slowMo: 0,
            args: [
                '--disable-web-security',
                '--window-size=1400,900',
                '--remote-debugging-port=9222',
                "--remote-debugging-address=0.0.0.0", // You know what your doing?
                '--disable-gpu', "--disable-features=IsolateOrigins,site-per-process", '--blink-settings=imagesEnabled=true',
                //'--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
            ],
            executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
        }));

        const [page] = await browser.pages();

        await page.goto(pURL, { waitUntil: 'networkidle0' });

        await page.waitForSelector("button[id='onetrust-accept-btn-handler']");
        await page.click("button[id='onetrust-accept-btn-handler']", elem => elem.click());
        console.log(displayTime() + 'Accepted cookies for - ' + page.url());

        return page;
    } catch (err) {
        console.error(err);
    }
};

async function stockChecker(page){

    await page.reload();

    let content = await page.evaluate(() => document.body.innerHTML);
    const loaded = $.load(content);

    let itemName = loaded("h1[class='product-name']",content).text()
    let itemPrice = loaded("span[class='sales']",content).first().text()
    itemPrice = itemPrice.replace(/\s\s+/g, ' ');
    let itemImg = loaded("img[itemprop='image']",content).attr('src');

    console.log(displayTime() + itemName + " " + itemPrice);

    embed.setTitle(itemName);
    embed.setDescription('Price: ' + itemPrice);
    embed.setImage(itemImg);

    let oos = loaded("button[class='add-to-cart btn cta-primary-btn out-of-stock-btn']", content)
    if(oos.prop('disabled')){
        console.log("\x1b[31m", "Item out of stock!", "\x1b[0m");
    }
    else{
        console.log("\x1b[32m", "Item in stock", "\x1b[0m");

        embed.setURL(page.url());
        embed.setTimestamp();
        hook.send(embed);
    }
}

async function monitor(){
    const url1 = "https://www.currys.co.uk/products/sony-playstation-5-and-street-fighter-6-bundle-10250156.html";
    const url2 = "https://www.currys.co.uk/products/sony-playstation-5-825-gb-10203370.html";
    const page = await goTo(url1);
    const page2 = await goTo(url2);

    let job = new CronJob("*/1 * * * *", function(){
        stockChecker(page);
        stockChecker(page2);
    }, null, true, null, null, true);
}

monitor();