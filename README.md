<img src='http://res.cloudinary.com/small-change/image/upload/v1477935825/SafeHippo-small_1_m1g8jy.png'/>

# Safe Hippo

> By crunching real time crime data, Safe Hippo will provide google maps directions of the safest route from point A to point B. It can optionally send these details via SMS.

## Web Client
<img src='http://res.cloudinary.com/dqvlfpaev/image/upload/v1480878958/SafeHippo%20Client.png'/>

## Getting Up & Running
Fork this repo

Clone down your forked version down to your local machine

```
git clone https://github.com/<INSERT YOUR GITHUB USERNAME HERE>/giddygoats.git
```

Install Dependancies with `npm install`

Start MongoDB with `mongod`

Start Redis with `redis-server`

Start the server with `npm start`


## API USAGE

The safest route between two points in San Francisco

### Request:
Make a GET request to `https://www.safehippo.com/safestRoute` with the following parameters

**Mandatory**
```
originLat \\ The latitude of the origin (i.e. 37.7764084)
originLon \\ The longitude of the origin (i.e. -122.40834870000003)
destLat \\ The latitude of the destination (i.e 37.7836883)
destLon \\ The longitude of the desitination (i.e. -122.40898400000003)
```

This will produce a URL that looks something like 
```
https://safehippo.com/safestRoute?originLat=37.7765056&originLon=-122.40838450000001&destLat=37.7836883&destLon=-122.40898400000003
```


**Optional**

By specifying a mobile phone, an SMS will be sent to the client in the format "Oink Oink, here is the safest way home: https://goo.gl/3tJ0D0"
```
mobile \\ The mobile number for the safest route to be sent to
```
This will produce a URL that looks something like 
```
https://safehippo.com/safestRoute?originLat=37.7765056&originLon=-122.40838450000001&destLat=37.7836883&destLon=-122.40898400000003&mobile=+16282024506
```

### Response:
Following the above guidlines will yield a response as seen below.
url: The long url which will provide turn by turn directions in google maps
shortURL: The shortened URL for `url`
waypoints: The coordinates of each turn along the route
```
{url: "https://www.google.com/maps?saddr=37.7764379,-122.4082783&daddr=37.77676659999999,-122.4078552+to:37.7804776,-122.4125511+to:37.7832203,-122.4090909+to:37.7836636,-122.4091892&dirflg=w",
shortURL: "https://goo.gl/512tc2",
waypoints:[{"lat":37.7766427,"lng":-122.4080099},{"lat":37.77676659999999,"lng":-122.4078552},{"lat":37.7804776,"lng":-122.4125511},{"lat":37.7832203,"lng":-122.4090909},{"lat":37.7836636,"lng":-122.4091892}]
}
```
## How Safe Hippo Works

  This section explains what happens 'under the hood' when a user interacts with Safe Hippo. When you go to www.safehippo.com, enter your destination, mobile number and click 'Go'. The following will occur:
  - HTML5 geolocater determines your current latitude & longitude
  - A GET request is sent to /safestRoute with the origin, destination & mobile in the params
  - We check the Redis DB if that particular route has been requested before. If it has, we return the safest route straight away.
  - If that route hasn't been requested before, we call the getSafestRoute method which does the following:
    * We query the Google Directions API which provides 3 potential routes to get from A to B.
    * We space the waypoints (lat,long pairs along a given route) out evenly using a helper function called 'david', because David wrote the algorithm. He's a genius.
    * Our database contains every recoreded crime that occured in San Francisco in 2015 with it's latitude and longitude. We populated the DB with data from the SF OpenData API at this endpoint: https://data.sfgov.org/resource/ritf-b9ki.json. For each waypoint on a given route, we query the db to see how many crimes happen within 80 metres of that waypoint. Each waypoint has a crime score equal to how many crimes happened near that point. We then sum up how many crimes happened on each route - each route's score is the sum of all the waypoint's crime score on that route. We then return the route with the lowest crime score. This will be the route where the fewest recorded crimes have occured over the past year.
  - We then SMS the provided mobile number the Google Maps URL of the safest route using Twilio's API
  - We return an object back to the client which contains all the waypoints of the safest route as well as the Google Maps URL.

## Team

  - __Product Owner__: Sam Henderson
  - __Scrum Master__: Guy Thomas
  - __Development Team Members__: David Minehan, Bea Subion 

## Suggested improvements

  - Configure Twilio to receive SMS' containing origin & destination address, and to then reply with the safest route between their current location and their desination address.
  - Assess more 'dummy routes' than the 3 Google Maps Directions gives us. New dummy routes could be suggested by specifying a random waypoint between origin and destination.
  - Connect the back end to a React Native Mobile App.
  - Extend to more cities e.g. Chicago has a crime statistics API (https://data.cityofchicago.org/api/views/ijzp-q8t2/rows.json?accessType=DOWNLOAD). Remember, the DB queries need to be in terms of distance on the Earth rather than latitude degrees because a 1 degree of latitude isn't the same Earth surface distance on the equator as it is at the poles.
  - Validation on the client forms to reject locations outside of SF.

## Contribution Guide

- Fork this repo.
- Clone down your forked version down to your local machine

```
git clone https://github.com/<INSERT YOUR GITHUB USERNAME HERE>/giddygoats.git
```

```
git remote add upstream https://github.com/giddygoats/giddygoats.git
```


- Commit work often and provide informative commit messages

```
git add .
```
```
git commit -m <INSERT INFORMATIVE COMMIT MESSAGE HERE>
```

- Push to your forked repo (by default, the remote name is 'origin'). 

```
git push origin master
```

- Each developer on the team has a branch titled that developers name. As of 31st Oct 2016, Guy Thomas administers the account. Email guythomas721@gmail.com and ask him to create a branch for you.

- Submit a pull request to your branch. After a code review, your new feature can be merged into the main repo! 

