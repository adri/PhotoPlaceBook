
# Search for something in textarea

#  - entweder nach lat long und radius oder
#  - noch woe id oder
#  - mit has_geo

# http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2401c0f8c9ce21389a328d9f333558be&text=phuket&woe_id=1226113&extras=+geo%2C+tags%2C+views&format=json&nojsoncallback=1&auth_token=72157633807759400-da3dae63f1a99fde&api_sig=ee835971b2d40ad875b2bdd8ef686863
# URL: http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2361184aed1ac756e674557451085cdd&sort=interestingness-desc%2C&has_geo=1&extras=+geo%2C+tags%2C+views&format=json&nojsoncallback=1

# Example response:

class @PhotoPlaceBookApp
      data: []

      setData: (data) ->
            @data = data

      findClusters: ->
            dbscan = new DBSCAN(@data, @distance)
            dbscan.run(5.0, 2)
            dbscan.cluster

      distance: (id1, id2) =>
            @data[id1].geoPoint.distanceTo(@data[id2].geoPoint)


