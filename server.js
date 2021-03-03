const express = require('express');
const request = require('request');
const app = express();
const port = 8081;
const ebayID = 'Sreeniva-test-PRD-216de56dc-b2aeb5e9';
const gID = 'AIzaSyBOESQ565TVoWegOyjPAujIG0TlDFVDYWI';
const cx = '000234415106032082356:ax8of-owy3w';
const user = 'sreeni11_2';

app.use(express.static("./"));

app.get('/', function(req, res) {
	res.send();
})

app.get('/img/title/:title', (req, res) =>
	{
		var link = "https://www.googleapis.com/customsearch/v1?q="+ req.params.title +"&cx=" + cx + "&imgSize=huge&imgType=news&num=8&searchType=image&key=" + gID;
		request(link, function(error, response, body) {
			if(!error && response.statusCode == 200)
			{
				res.send(body);
			}
		});	
	})

app.get('/info/id/:id', (req, res) => 
	{
		var link = "http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=" + ebayID + "&siteid=0&version=967&ItemID=";
		link += req.params.id + "&IncludeSelector=Description,Details,ItemSpecifics";
		request(link, function(error, response, body) {
			if(!error && response.statusCode == 200)
			{
				res.send(body);
			}
		});	
	})

app.get('/similar/id/:id', (req, res) => 
	{
		var link = "http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=" + ebayID;
		link += "&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=" + req.params.id + "&maxResults=20";
		
		request(link, function(error, response, body) {
			if(!error && response.statusCode == 200)
			{
				res.send(body);
			}
		});	
	})

app.get('/search/keyword/:kw/:category/new/:new/used/:used/unspec/:unspec/pickup/:pickup/free/:free/dist/:dist/zip/:zip', (req, res) => 
	{
		var link = 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=' + ebayID + '&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50&keywords="';
		link += req.params.kw; 
		var i = 0;

		if(req.params.category != 0)
		{
			link += "&categoryId=" + req.params.category;
		}

		link += '&buyerPostalCode=' + req.params.zip + '&itemFilter(0).name=MaxDistance&itemFilter(0).value=' + req.params.dist;

		if(req.params.pickup != 'false')
		{
			link += "&itemFilter(" + i + ").name=LocalPickupOnly&itemFilter(" + i + ").value=true";
			++i;
		}

		if(req.params.free != 'false')
		{
			link += "&itemFilter(" + i + ").name=FreeShippingOnly&itemFilter(" + i + ").value=true";
			++i;
		}

		link += "&itemFilter(" + i + ").name=HideDuplicateItems&itemFilter(" + i + ").value=true";
		++i;

		var j = 0;
		if(req.params.new != 'false' || req.params.used != 'false' || req.params.unspec != 'false')
		{
			link += "&itemFilter(" + i + ").name=Condition";
		}
		if(req.params.new != 'false')
		{
			link += "&itemFilter(" + i + ").value(" + j + ")=New";
			++j;
		}
		if(req.params.used != 'false')
		{
			link += "&itemFilter(" + i + ").value(" + j + ")=Used";
			++j;
		}
		if(req.params.unspec != 'false')
		{
			link += "&itemFilter(" + i + ").value(" + j + ")=Unspecified";
			++j;
		}
		link += '&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo';
		
		//console.log(link);
		request(link, function(error, response, body) {
			if(!error && response.statusCode == 200)
			{
				res.send(body);
			}
		});

	});

app.listen(port, () => console.log('Listening on port =' + port));