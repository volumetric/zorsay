module.exports = function(app){

    var querystring = require('querystring');
    // var cheerio = require('cheerio');
    var request = require('request');

    var gis_url = "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&";

    // http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=Apple+Cake
    // http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=Apple+Cake&start=4
    // http://ajax.googleapis.com/ajax/services/search/video?q=SpongeBob%20Full&v=1.0&start=8&rsz=8

    app.get('/image_echo', function(req, res) {
        console.log("inside /image_echo");
        
        var res_html = "<html><head><script src='https://code.jquery.com/jquery.js'></script></head><body>"

        query_string = req.url.substr(req.url.indexOf("?")+1);
        var querystring_parts = querystring.parse(query_string);
        
        //#TODO sanitize this query #IMPORTANT #URGENT
        var input_query = querystring_parts["q"];
        var start = querystring_parts["start"];
        var rsz = querystring_parts["rsz"];
        // console.log(input_query);
        // console.log(start);
        // console.log(rsz);

        // gis_query_url = gis_url+input_query+"&start=4";
        gis_query_url = gis_url;
        gis_query_url += "rsz="+rsz+"&";
        gis_query_url += "start="+start+"&";
        gis_query_url += "q="+input_query+"&";

        request(gis_query_url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            // console.log(body) // Print the google web page.

            json_result = JSON.parse(body);
            
            if (json_result.responseData && json_result.responseData.results){

                // rsz1 = rsz;
                // new_start1 = (parseInt(start) - parseInt(rsz1));
                // if (rsz1 > 8) {
                //     rsz1 = 8;
                // }
                // if (new_start1 < 0) {
                //     new_start1 = 0
                //     rsz1 = start;
                // }
                // prev_url = "/image_echo?";
                // prev_url += "rsz="+rsz1+"&";
                // prev_url += "start="+new_start1+"&";
                // prev_url += "q="+input_query+"&";

                // res_html += "<a href='"+prev_url+"'>Prev</a>";

                for(var i = 0; i < json_result.responseData.results.length; ++i){
                    r = json_result.responseData.results[i];

                    src_url = r.tbUrl
                    // src_url = r.url
                    // src_url = r.visibleUrl
                    // src_url = r.originalContextUrl
                    // src_url = r.unescapedUrl;
                    rhtml = "<a target='_blank' href='"+r.url+"''><img src='"+src_url+"'></a>";
                    res_html += rhtml;
                }

                new_start = (parseInt(start)+parseInt(rsz));
                if (new_start < 64) {
                    // if (start + rsz > 63){
                    //     rsz = 64 - new_start;
                    // }

                    next_url = "/image_echo?";
                    next_url += "rsz="+rsz+"&";
                    next_url += "start="+new_start+"&";
                    next_url += "q="+input_query+"&";

                    res_html += "<a href='"+next_url+"'>Next</a>";
                }
                res_html += "</body></html>";
                // res.send(json_result.responseData.results);
                res.send(res_html);
            } else {
                res.send(json_result);
            }
            
          } else {
            // res.send(error);
            res.send(response.statusCode);
          }
        });

        // res.send(input_query);

        // console.log(querystring_parts["type"]);
        // if(querystring_parts["type"] != undefined && querystring_parts["type"] != "all"){} else {}

  });
} // end module.exports