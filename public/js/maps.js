var map;
function initMap1() {
  map = new mappls.Map("map", {
    center: [28.638698386592438, 77.27604556863412],
    zoom: 10,
  });

  new mappls.geoCode(
    {
      address: "Connaught Place, Delhi",
    },
    function (response) {
      if (response.responseCode === "200") {
        console.log(response);
        const lat = response.results[0].latitude;
        const lng = response.results[0].longitude;

        // Add a marker at the geocoded location
        new mappls.Marker({ map, position: [lat, lng] });
        map.setCenter([lat, lng]);
      } else {
        console.error("Geocoding failed:", response);
      }
    }
  );
}

initMap1();