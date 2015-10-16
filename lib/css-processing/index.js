var cheerio = require('cheerio');
var urlProccesing = require('url');
var request = require('request-promise');
var CSSJSON = require('cssjson');
var Promise = require('promise');

class CssProccessing {
    constructor() {
        this.processHtml = (html) => {
            var $ = cheerio.load(html);
            var cssUrls = [];
            var links = $('link');
            var re = /.css/;
            var googapiRe = /googleapis/;
            for (let link in links) {
                var attr = links[link].attribs;
                if (attr && re.test(attr.href) && !googapiRe.test(attr.href)) {
                    cssUrls.push(links[link].attribs.href);
                }
            }
            return cssUrls;
        };
        this.processCssUrls = (cssUrls, parsedCommonUrl) => {
            var promises = [];
            cssUrls.forEach((url, index) => {
                var pasedCssUrl = urlProccesing.parse(url);
                var urlArray = url.split('');
                if (urlArray[0] !== '/' && !pasedCssUrl.hostname) {
                    url = '/' + url;
                }
                if (urlArray[0] === '/' && urlArray[1] === '/') {
                    url = 'https:' + url;
                }

                if (!pasedCssUrl.hostname) {
                    url = 'https://' + parsedCommonUrl.host + url;
                }

                promises.push(request(url).promise());
            });
            return promises;
        };
        this.processAllCssRequests = (promises, res) => {
            Promise.all(promises).then((csses) => {
                this.sendResponse(res, this.prepareResponse(csses));
            });
        };

    }
    sendResponse(res, responseObject) {
        res.send({
            response: responseObject
        });
    }
    prepareResponse(csses) {
        var json = [];
        return csses.map((_css) => {
            var parsedCss = CSSJSON.toJSON(_css);
            var obj = parsedCss.children;
            for (let [key, value] of Object.entries(obj)) {
                if (Object.keys(value.attributes).length) {
                    json.push({
                        rule: key,
                        style: value.attributes
                    });
                }
            }
            return json;
        });
    }
};

module.exports = new CssProccessing();
