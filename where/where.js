var marker;
var currentLoc;
var infowindow = new google.maps.InfoWindow();
var peopleInfo;
var personIcon;
var closestStation;
var closestStationDistance;
var map;

function getMap() {
	closestStationDistance = -1;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			lat = position.coords.latitude;
			long = position.coords.longitude;
			mapRender();
		});
	} else {
		alert("Your browser does not support geolocation.");
	}
}

function mapRender() {
	/* initialize map */
	var mapOptions = {
	     center: new google.maps.LatLng(lat, long),
	       zoom: 16,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	/* create current location marker */
	currentLoc = new google.maps.LatLng(lat, long);
	marker     = new google.maps.Marker({position: currentLoc, title: "You are here at " + lat.toFixed(3) + ", " + long.toFixed(3)});
	marker.setMap(map);

	/* create info window for current location marker */
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

	/* create red line markers */
	redLineInit();

	/* retrieve waldo and carmen */
	peopleInit();
}


function redLineInit() {
	stopLoc = new Array();

	/* static data for mbta station coordinates */
	locdata = "RALE,Alewife,42.395428,-71.142483,RDAV,Davis,42.39674,-71.121815,RPOR,Porter Square,42.3884,-71.119149,RHAR,Harvard Square,42.373362,-71.118956,RCEN,Central Square,42.365486,-71.103802,RKEN,Kendall/MIT,42.36249079,-71.08617653,RMGH,Charles/MGH,42.361166,-71.070628,RPRK,Park St.,42.35639457,-71.0624242,RDTC,Downtown Crossing,42.355518,-71.060225,RSOU,South Station,42.352271,-71.055242,RBRO,Broadway,42.342622,-71.056967,RAND,Andrew,42.330154,-71.057655,RJFK,JFK/UMass,42.320685,-71.052391,RSAV,Savin Hill,42.31129,-71.053331,RFIE,Fields Corner,42.300093,-71.061667,RSHA,Shawmut,42.29312583,-71.06573796,RASH,Ashmont,42.284652,-71.064489,RNQU,North Quincy,42.275275,-71.029583,RWOL,Wollaston,42.2665139,-71.0203369,RQUC,Quincy Center,42.251809,-71.005409,RQUA,Quincy Adams,42.233391,-71.007153,RBRA,Braintree,42.2078543,-71.0011385";

	/* parse string into array */
	counter = 0;
	index = 0;
	locarr = locdata.split(",");
	for (i in locarr) {
		switch (counter) {
			case 0:
				stopLoc[index] = new Object();
				stopLoc[index].stationid = locarr[i];
				stopLoc[index].nTrains = [];
				stopLoc[index].sTrains = [];
				counter++;
				break;
			case 1:
				stopLoc[index].name = locarr[i];
				counter++;
				break;
			case 2:
				stopLoc[index].lat = locarr[i];
				counter++;
				break;
			case 3:
				stopLoc[index].long = locarr[i];
				index++;
				counter = 0;
				break;
		}
	}
	redLineActiveData();
}

function redLineActiveData() {
	/* initiate red line XMLHttpRequest */
	var redLineRequest;
	try {
		redLineRequest = new XMLHttpRequest();
	} catch (ms1) {
		try {
			redLineRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (ms2) {
			try {
				redLineRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (ex) {
				redLineRequest = null;
			}
		}
	}
	if (redLineRequest == null) alert("Error creating request object --Ajax not supported?");

	/* parse json data into info */
	redLineRequest.onreadystatechange = function() {
		redLineRequest.readystate;
		if (redLineRequest.readyState == 4) {
			try {
				document.getElementById("loader").style.visibility = 'hidden';
				trainInfo = JSON.parse(redLineRequest.responseText);
				/* adds active train data to each stop */
				for (i in trainInfo) {
					if (trainInfo[i]['TimeRemaining'].substr(0,1) != "-") {
						key       = trainInfo[i]['PlatformKey'].substr(0,4);
						direction = trainInfo[i]['PlatformKey'].substr(4,5);
						j = 0; while (stopLoc[j].stationid != key) j++; 
						if (direction == 'S') stopLoc[j].sTrains.push(trainInfo[i]['TimeRemaining']);
						else                  stopLoc[j].nTrains.push(trainInfo[i]['TimeRemaining']);
					}
				}
				redLineRender();
			} catch (err) {
				redLineRequest.abort();
				document.getElementById("people_data").innerHTML+="<p class='error'>Error: Could not fetch MBTA data</p>";
			}	
		} else {
			var loader = document.getElementById("loader");
			loader.style.visibility = 'visible';
			loader.innerHTML = "loading MBTA data...";
		}
	}
	redLineRequest.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
	redLineRequest.send();
}


function redLineRender() {
	/* store data in markers */
	for (i in stopLoc) {
		var stop = stopLoc[i];
		stopCoords = new google.maps.LatLng(stop.lat, stop.long);

		/* add live arrival data */
		northTrains = ""; southTrains = "";
		for (j in stopLoc[i].nTrains) northTrains += "<li>Northbound: " + stopLoc[i].nTrains[j] + "</li>";
		for (j in stopLoc[i].sTrains) southTrains += "<li>Southbound: " + stopLoc[i].sTrains[j] + "</li>";
		arrivals = "<ul>" + northTrains + southTrains + "</ul>";
		
		/* compute closest station to user */
		var stationDistanceFromUser = google.maps.geometry.spherical.computeDistanceBetween(currentLoc, stopCoords) * 1.609 / 1000;
		if (closestStationDistance == -1) {
			closestStationDistance = stationDistanceFromUser;
			closestStation = stop.name;
		} else {
			if (closestStationDistance > stationDistanceFromUser) {
				closestStationDistance = stationDistanceFromUser;
				closestStation = stop.name;
			}
		}

		/* create marker object */
		stop = new google.maps.Marker({
			position: stopCoords, 
			   title: stop.name, 
			 content: arrivals, 
			    icon: 'redlogo.png', 
			   scale: .5
		});
		stop.setMap(map);
		
		/* create info window for station location markers */
		var infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(stop, 'click', function() {
			infowindow.setContent("<div class='stationname'>" + this.title + "</div>" + this.content);
			infowindow.open(map, this);
		});
	}
	
	document.getElementById("people_data").innerHTML+="<p>Closest Red Line Station is " + closestStation + " (" + closestStationDistance.toFixed(3) + " miles)</p>";

	/* draw polyline between stops */
	var stationCoor = new Array();

	j = 0;
	for (i =  0; i < 17; i++) { stationCoor[j] = new google.maps.LatLng(stopLoc[i].lat, stopLoc[i].long); j++; }
	for (i = 15; i > 11; i--) { stationCoor[j] = new google.maps.LatLng(stopLoc[i].lat, stopLoc[i].long); j++; }
	for (i = 17; i < 22; i++) { stationCoor[j] = new google.maps.LatLng(stopLoc[i].lat, stopLoc[i].long); j++; }

	line = new google.maps.Polyline({
		         path: stationCoor,
		  strokeColor: "#EE0000",
		strokeOpacity: 1,
		 strokeWeight: 2
	});
	line.setMap(map);
}

function peopleInit() {
	/* initiate waldo and carmen XMLHttpRequest */

	var peopleRequest;
	try {
		peopleRequest = new XMLHttpRequest();
	} catch (ms1) {
		try {
			peopleRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (ms2) {
			try {
				peopleRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (ex) {
				peopleRequest = null;
			}
		}
	}
	if (peopleRequest == null) alert("Error creating request object --Ajax not supported?");

	/* parse json data into peopleInfo */
	peopleRequest.onreadystatechange = function() {
		if (peopleRequest.readyState == 4) {
			try {
				peopleInfo = JSON.parse(peopleRequest.responseText);
				peopleRender();
			} catch (err) {
				peopleRequest.abort();
				document.getElementById("people_data").innerHTML += "<p class='error'>Error: could not connect to Waldo or Carmen</p>";
				}	
			}
		}
	peopleRequest.open("GET", "http://messagehub.herokuapp.com/a3.json", true);
	peopleRequest.send();
}

function peopleRender() {
	/* create markers for people */
	for (i in peopleInfo) {
		personCoords = new google.maps.LatLng(peopleInfo[i]['loc']['latitude'], peopleInfo[i]['loc']['longitude']);
		personMarker = new google.maps.Marker({
			position: personCoords,
			   title: peopleInfo[i]['name'],
			 content: peopleInfo[i]['loc']['note'],
			    icon: peopleInfo[i]['name'] == "Waldo" ? "waldo.png" : "carmen.png"
		});
		personMarker.setMap(map);

		/* create info window for waldo and carmen */
		var infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(personMarker, 'click', function() {
			infowindow.setContent(this.content);
			infowindow.open(map, this);
		});		
		
		document.getElementById("people_data").innerHTML += "<p>Distance to " + peopleInfo[i]['name'] + " is " 
															+ (google.maps.geometry.spherical.computeDistanceBetween(personCoords, currentLoc) * 1.609 /1000).toFixed(3) 
															+ " miles</p>";
	}
}

