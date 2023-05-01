var map;
var service;
var infowindow;

function initialize() {
  var pyrmont = new google.maps.LatLng(23.5678, 80.7532);

  map = new google.maps.Map(document.getElementById("map"), {
    center: pyrmont,
    zoom: 15,
  });
  var input = document.getElementById("searchTextField");
  let autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.bindTo("bounds", map);

  let marker = new google.maps.Marker({
    map: map,
  });

  google.maps.event.addListener(autocomplete, "place_changed", () => {
    let place = autocomplete.getPlace();

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    let request = {
      location: place.geometry.location,
      radius: "2000",
      type: ["restaurant"],
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  });

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", function () {
      alert(place.name);
      window.open(place.photos[0].getUrl(), "_blank");
    });
  }
}

google.maps.event.addDomListener(window, "load", initialize);
const getlocation = (search_keyword="restaurant") => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let locationValue = new google.maps.LatLng(latitude, longitude);
      let request = {
        location: locationValue,
        radius: 1000,
        type: search_keyword
      };
      

    map = new google.maps.Map(document.getElementById("map"), {
        center: locationValue,
        zoom: 15,
    });
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
      function callback(results, status) {
         console.log(results)
         
         // for current position marker
         const marker_Currentlocation= new google.maps.Marker({
          map:map,
          position: locationValue,
          title:"my location",
       })
       marker_Currentlocation.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')

       google.maps.event.addListener(marker_Currentlocation, "click", function () {
        alert("my location");
       
      });

        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
          }
        }
      }
      function createMarker(place) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          
        });

        google.maps.event.addListener(marker, "click", function () {
          alert(place.name);
          window.open(place.photos[0].getUrl(), "_blank");
        });
      }
    });
  } else {
    alert("geolocation is not supported by this device or browser");
  }
};