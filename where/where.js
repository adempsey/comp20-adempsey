var marker;
var currentLoc;
var infowindow = new google.maps.InfoWindow();

function getMap() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			lat = position.coords.latitude;
			long = position.coords.longitude;
			renderMap();
		});
	} else {
		alert("Your browser does not support geolocation.");
	}
}

function renderMap() {
	/* initialize map */
	var mapOptions = {
	  center: new google.maps.LatLng(lat, long),
	  zoom: 16,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
	/* create current location marker */
	currentLoc = new google.maps.LatLng(lat, long);
	marker = new google.maps.Marker({position: currentLoc, title: "You are here at " + lat.toFixed(3) + ", " + long.toFixed(3)});
	marker.setMap(map);
		
	/* create info window for current location marker */
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
	
	/* create red line markers */
	redLineData();
	stopMarkers = new Array();
	for (i in stopLoc) {
		var stop = stopLoc[i];
		stopCoords = new google.maps.LatLng(stop.lat, stop.long);
		stop = new google.maps.Marker({position: stopCoords, title: stop.name, icon: 'redlogo.png', scale: .5});
		stop.setMap(map);
		
		/* create info window for station location markers */
		var infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(stop, 'click', function() {
			infowindow.setContent("<div class='stationname'>" + this.title + "</div>");
			infowindow.open(map, this);
		});
	}
	
	/* draw polyline between stops */
	var stationCoor = new Array();
	j = 0;
	for (i = 0; i < 17; i++) {
		stationCoor[j] = new google.maps.LatLng(stopLoc[i].lat, stopLoc[i].long);
		j++;
	}
	for (i = 15; i > 11; i--) {
		stationCoor[j] = new google.maps.LatLng(stopLoc[i].lat, stopLoc[i].long);
		j++;
	}
	
	for (i = 17; i < 22; i++) {
		stationCoor[j] = new google.maps.LatLng(stopLoc[i].lat, stopLoc[i].long);
		j++;
	}
	line = new google.maps.Polyline({
		path: stationCoor,
		strokeColor: "#EE0000",
		strokeOpacity: 1,
		strokeWeight: 2
	});
	line.setMap(map);
}

function redLineData() {
	stopLoc = new Array();
	initRedLine();
	
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
	if (redLineRequest == null) {
	  alert("Error creating request object --Ajax not supported?");
	}
	
	/* parse json data and render to map */
	redLineRequest.onreadystatechange = function() {
		if (redLineRequest.readyState == 4) {
			try {
				info = JSON.parse(redLineRequest.response);
				for (i in info) {
			//		console.log(info[i]['Line']);
				}
			} catch (err) {
				redLineRequest.abort();
				/*do error stuff */
				}	
			}
		}
	redLineRequest.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
	redLineRequest.send();
}

function initRedLine() {
	/* static data for mbta station coordinates */
	locdata = "ALEWIFE,Alewife,42.395428,-71.142483,DAVIS,Davis,42.39674,-71.121815,PORTER,Porter Square,42.3884,-71.119149,HARVARD,Harvard Square,42.373362,-71.118956,CENTRAL,Central Square,42.365486,-71.103802,KENDALL,Kendall/MIT,42.36249079,-71.08617653,CHARLES MGH,Charles/MGH,42.361166,-71.070628,PARK,Park St.,42.35639457,-71.0624242,DOWNTOWN CROSSING,Downtown Crossing,42.355518,-71.060225,SOUTH STATION,South Station,42.352271,-71.055242,BROADWAY,Broadway,42.342622,-71.056967,ANDREW,Andrew,42.330154,-71.057655,JFK,JFK/UMass,42.320685,-71.052391,SAVIN HILL,Savin Hill,42.31129,-71.053331,FIELDS CORNER,Fields Corner,42.300093,-71.061667,SHAWMUT,Shawmut,42.29312583,-71.06573796,ASHMONT,Ashmont,42.284652,-71.064489,NORTH QUINCY,North Quincy,42.275275,-71.029583,WOLLASTON,Wollaston,42.2665139,-71.0203369,QUINCY CENTER,Quincy Center,42.251809,-71.005409,QUINCY ADAMS,Quincy Adams,42.233391,-71.007153,BRAINTREE,Braintree,42.2078543,-71.0011385";

	/* parse string into array */
	counter = 0;
	index = 0;
	locarr = locdata.split(",");
	for (i in locarr) {
		switch (counter) {
			case 0:
				stopLoc[index] = new Object();
				stopLoc[index].stationid = locarr[i];
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
}