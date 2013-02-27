var marker;
var currentLoc;
var infowindow = new google.maps.InfoWindow();

function getLoc() {
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
	var mapOptions = {
	  center: new google.maps.LatLng(lat, long),
	  zoom: 16,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	/* create current location marker */
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	currentLoc = new google.maps.LatLng(lat, long);
	marker = new google.maps.Marker({position: currentLoc, title: "I am here at " + lat.toFixed(3) + ", " + long.toFixed(3)});
	marker.setMap(map);
	
	/* create info window for marker */
	google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		});
}