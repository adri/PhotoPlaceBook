class @FlickrSearch
    url: "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2361184aed1ac756e674557451085cdd&per_page=500&sort=interestingness-desc%2C&has_geo=1&extras=+geo%2C+tags%2C+views%2C+url_t&format=json&text=";

    findByKeyword: (keyword) ->
        @doRequest(@url + keyword)

    doRequest: (url) ->
        xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = ->
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                eval(xmlhttp.responseText)
        xmlhttp.open("GET", url, true)
        xmlhttp.send();
