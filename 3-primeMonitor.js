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
        const browser = await puppeteer.launch(({ignoreHTTPSErrors: true , headless: true,
            args: [
                '--disable-web-security',
                //'--proxy-server=85.116.16.179:5892'
            ],
            executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
        }));
        const [page] = await browser.pages();

        /*await page.authenticate({
            username: 'ICE_PEFx5TUxhVWl6pss',
            password: 'RVR9KqYrpa3LCJ3wEm1D'
        });*/

        await page.goto(pURL, { waitUntil: 'networkidle0' });

        console.log(displayTime() + "Page launched - " + page.url());
    
        return page;

    } catch (err) {
        console.error(err);
    }
};

async function stockChecker(page){

    await page.reload();
    let content = await page.evaluate(() => document.body.innerHTML);
    const loaded = $.load(content);
    
    let itemName = loaded("h1[class='ProductMeta__Title Heading u-h2']",content).text()
    let itemPrice = loaded("span[class='ProductMeta__Price Price Text--subdued u-h4']",content).text()
    console.log(displayTime() + itemName + " " + itemPrice);
    embed.setTitle(itemName);
    embed.setDescription('Price: ' + itemPrice);

    let oos = loaded("button[class='ProductForm__AddToCart Button Button--secondary Button--full']", content)
    if(oos.prop('disabled')){
        console.log("\x1b[31m", "Item out of stock!", "\x1b[0m");
    }
    else{
        console.log("\x1b[32m", "Item in stock", "\x1b[0m");

        let itemImg = loaded("img[class='Image--fadeIn lazyautosizes Image--lazyLoaded']",content).attr('data-original-src');
        let imgString = "http:" + itemImg
        embed.setImage(imgString);

        embed.setURL(page.url());
        embed.setTimestamp();
        hook.send(embed);
    }


}

async function monitor(){
    const url1 = "https://drinkprime.uk/products/ice-pop-hydration";
    const url2 = "https://drinkprime.uk/products/meta-moon-hydration";
    const url3 = "https://drinkprime.uk/products/blue-raspberry-hydration";
    const url4 = "https://drinkprime.uk/products/grape-hydration";
    const url5 = "https://drinkprime.uk/products/lemon-lime-hydration";
    const url6 = "https://drinkprime.uk/products/tropical-punch-hydration";
    const url7 = "https://drinkprime.uk/products/orange-hydration";

    const page = await goTo(url1);
    const page2 = await goTo(url2);
    const page3 = await goTo(url3);
    const page4 = await goTo(url4);
    const page5 = await goTo(url5);
    const page6 = await goTo(url6);
    const page7 = await goTo(url7);

    let job = new CronJob("*/1 * * * *", function(){
        stockChecker(page);
        stockChecker(page2);
        stockChecker(page3);
        stockChecker(page4);
        stockChecker(page5);
        stockChecker(page6);
        stockChecker(page7);

    }, null, true, null, null, true);
}

monitor();