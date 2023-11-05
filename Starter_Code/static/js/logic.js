const geoJSONUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

const myMap = L.map("map").setView([37.09, -95.71], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Function to get color based on depth
function getColorByDepth(depth) {
    return depth > 90 ? "red" :
           depth > 70 ? "orangered" :
           depth > 50 ? "orange" :
           depth > 30 ? "gold" :
           depth > 10 ? "yellow" : "lightgreen";
}

function getRadiusByMagnitude(mag) {
    return mag === 0 ? 1 : mag * 4;
}

d3.json(geoJSONUrl).then(function (data) {
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => L.circleMarker(latlng),
        style: (feature) => ({
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColorByDepth(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadiusByMagnitude(feature.properties.mag),
            stroke: true,
            weight: 0.5
        }),
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}<br>Depth: ${feature.geometry.coordinates[2]}`);
        }
    }).addTo(myMap);

    // Add legend with color indications
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        const depths = [-10, 10, 30, 50, 70, 90];

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += `<i style="background-color:${getColorByDepth(depths[i] + 1)}"></i> ${depths[i]}${depths[i + 1] ? `&ndash;${depths[i + 1]}<br>` : '+'}`;
        }
        return div;
    };
    legend.addTo(myMap);

    // Add legend CSS styles for displaying colors
    const legendStyle = document.createElement("style");
    legendStyle.innerHTML = `
        .info.legend i {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            display: inline-block;
            vertical-align: middle;
        }
    `;
    document.getElementsByTagName("head")[0].appendChild(legendStyle);
});
