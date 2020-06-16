const Stopwatch = require('statman-stopwatch');
const Nightmare = require('nightmare');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const results = await getData();
    res.json({ results, size: results.length });
});

async function getData() {
    console.log('begin');
    const stopwatch = new Stopwatch(true);
    let data = [];
    try {
        const nightmare = Nightmare({
            executionTimeout: 60000,
            waitTimeout: 60000
        });
        let night = nightmare.goto('https://www.livescore.com').wait('div.content');

        console.log('done wait');
         data = night.evaluate(() => {
                console.log('eval');
                let elements = [];
                let raw = document.getElementsByClassName('match-row');
                let length = raw.length;
                console.log('for loop');
                for (let i = 0; i < length; i++) {
                    try {
                        elements.push(
                            {
                                time: raw[i].getElementsByClassName('min')[0].getElementsByTagName('div')[0].getElementsByTagName('span')[0].innerText,
                                home_team: raw[i].getElementsByClassName('tright')[0].getElementsByTagName('span')[0].innerText,
                                score: `${raw[i].getElementsByClassName('sco')[0].getElementsByTagName('span')[0].innerText} - ${raw[i].getElementsByClassName('sco')[0].getElementsByTagName('span')[2].innerText}`,
                                away_team: raw[i].getElementsByClassName('name')[1].getElementsByTagName('span')[0].innerText
                            }
                        )
                    }
                    catch (e) { }
                }
                console.log('end loop');
                return elements;
            })
            .end()
    }
    catch (e) {
        console.log('error: ' + e.message);
    }

    // console.log('data: ' + JSON.stringify(data))
    console.log(`Time: ${Math.round((stopwatch.stop() / 1000))} s`);
    return data;
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Server up on port: ' + port);
})


