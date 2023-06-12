const puppeteer = require('puppeteer');
const CronJob =require('cron').CronJob;
const $ = require('cheerio');

const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook("");
 
const embed = new MessageBuilder()
.setTitle('Item Now In Stock!')
.setColor('#C8A2C8')
.setFooter('ArJoMonitors')

//const url = "https://ninjakitchen.co.uk/product/ninja-foodi-max-dual-zone-air-fryer-af400uk-zidAF400UK";
//const url = "https://ninjakitchen.co.uk/product/nutri-ninja-700w-slim-blender-smoothie-maker-qb3001uks-silver-zidQB3001UKS";
//embed.setURL(url)

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

async function goTo(pURL){
    const browser = await puppeteer.launch({ignoreHTTPSErrors: true , headless: true,
        args: [
            '--disable-web-security',
        ],
        executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
    });
    const page = await browser.newPage();

    await page.goto(pURL);
    return page;
}

async function stockChecker(page){
    await page.reload();
    let content = await page.evaluate(() => document.body.innerHTML);
    const loaded = $.load(content);

    let itemName = loaded("h1[class='js-product-title js-make-bold']",content).text()
    let itemPrice = loaded("div[class='price-container']",content).first().text();
    itemPrice = itemPrice.replace(/\s\s+/g, ' ');
    let itemImg = loaded("img[itemprop='image']",content).attr('src');

    console.log(displayTime() + itemName + " " + itemPrice);
    embed.setTitle(itemName);
    embed.setDescription('Price: ' + itemPrice);
    embed.setImage(itemImg);

    loaded("div[class='product-availability']", content).each(function(){
        let oos = loaded(this).text().toLowerCase();
        if(oos == "out of stock"){
            console.log("\x1b[31m", "Item out of stock!", "\x1b[0m");
        }
        else{
            console.log("\x1b[32m", "Item in stock", "\x1b[0m");

            embed.setURL(page.url());
            embed.setTimestamp();
            hook.send(embed);

        }
    });
}

async function monitor(){
    const url1 = "https://ninjakitchen.co.uk/product/ninja-foodi-max-dual-zone-air-fryer-af400uk-zidAF400UK";
    //const url1 = "https://ninjakitchen.co.uk/product/ninja-foodi-power-nutri-blender-3-in-1-with-smart-torque-auto-iq-1200w-cb350uk-zidCB350UK";
    const url2 = "https://ninjakitchen.co.uk/product/nutri-ninja-700w-slim-blender-smoothie-maker-qb3001uks-silver-zidQB3001UKS";

    const page = await goTo(url1);
    const page2 = await goTo(url2);
    let job = new CronJob("*/1 * * * *", function(){
        stockChecker(page)
        stockChecker(page2)
    }, null, true, null, null, true);
    job.start();
}

monitor();