var express = require('express');
var app = express();
var http = require('http').Server(app);
var request = require('request-promise');
var urlProccesing = require('url');
var path = require('path');

var cssProcessing = require('./lib/css-processing');

app.use(express.static(path.resolve(__dirname, './public')));
app.set('port', (process.env.PORT || 3000));

app.get('/api/css', (req, res) => {
    if (req.query && req.query.siteUrl) {
        var commonUrl = req.query.siteUrl;
        var parsedCommonUrl = urlProccesing.parse(commonUrl);
        if (!parsedCommonUrl.protocol) {
            commonUrl = 'https://' + commonUrl;
        }
        parsedCommonUrl = urlProccesing.parse(commonUrl);
        request(commonUrl)
            .then(cssProcessing.processHtml)
            .then((cssUrls) => {
                console.log('cssUrls', cssUrls);
                return cssProcessing.processCssUrls(cssUrls, parsedCommonUrl);
            })
            .then((promises) => {
                cssProcessing.processAllCssRequests(promises, res);
            });

    } else {
        res.send({
            error: 'Please enter url'
        });
    }
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
