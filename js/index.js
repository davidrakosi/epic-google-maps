window.onload = function () {
    //this.alert("Hi, I couldn't get my own API key as Google doesn't accept my credit card for some reason. This app still uses the CleverProgrammer API key which is probably either disabled or restricted. Due to the pandemic lockdown ")
}

var map;
var markers = [];
var infoWindow;

function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 5,
        mapTypeId: 'roadmap',
        styles: [
            { elementType: 'geometry', stylers: [{ color: '#000000' }] }, //'#242f3e'}]},
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#263c3f' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#6b9a76' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9ca5b3' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#2f3948' }]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#515c6d' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#17263c' }]
            }
        ]
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

function searchStores() {
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if (zipCode) {
        for (var store of stores) {
            var postal = store['address']['postalCode'].substring(0, 5);
            if (postal == zipCode) {
                foundStores.push(store);
            }
        }
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearSearch(){
    document.getElementById('zip-code-input').value = "";
    searchStores();
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener() {
    var storeElements = document.querySelectorAll('.store-container');

    storeElements.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
            google.maps.event.trigger(markers[index], 'click');
        })
    })
}

function displayStores(stores) {
    var storesHtml = '';
    for (var [index, store] of stores.entries()) {
        var address = store['addressLines'];
        var phone = store['phoneNumber'];
        var storeLatitude = store['coordinates']['latitude'];
        var storeLongitude = store['coordinates']['longitude'];
        storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">
                            ${phone}
                        </div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${++index}
                        </div>
                    </div>
                    <div class="store-direct-contact">
                        <a href="mailto:examplemailaddress@norealemail.com">
                            <i class="far fa-envelope"></i>
                        </a>
                        <a href="tel:${phone}">
                            <i class="fas fa-mobile-alt"></i>
                        </a>
                        <a href="https://www.facebook.com/carderobottega/" target="_blank">
                            <i class="fab fa-safari"></i>
                        </a>
                        <a href="https://www.google.com/maps/dir/?api=1&origin=Current%20Location&destination=${storeLatitude},${storeLongitude}&travelmode=driving" target="_blank">
                            <i class='fas fa-location-arrow'></i>
                        </a>
                    </div>
                </div>
            </div>
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for (var [index, store] of stores.entries()) {
        var latlng = new google.maps.LatLng(
            store['coordinates']['latitude'],
            store['coordinates']['longitude']);
        var storeLatitude = store['coordinates']['latitude'];
        var storeLongitude = store['coordinates']['longitude'];
        var name = store['name'];
        var address = store['addressLines'][0];
        var phone = store['phoneNumber'];
        var openStatusText = store['openStatusText']
        bounds.extend(latlng);
        createMarker(name, address, latlng, storeLatitude, storeLongitude, index + 1, phone, openStatusText);
    }
    map.fitBounds(bounds);
}

function createMarker(name, address, latlng, storeLatitude, storeLongitude, index, phone, openStatusText) {
    var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">    
                    <i class='fas fa-location-arrow'></i>
                </div>
                <a href="https://www.google.com/maps/dir/?api=1&origin=Current%20Location&destination=${storeLatitude},${storeLongitude}&travelmode=driving" target="_blank">
                    ${address}
                </a>
            </div>
            <div class="store-info-phone">
                <div class="circle">    
                    <i class='fas fa-mobile-alt'></i>
                </div>
                <a href="tel:${phone}">
                    ${phone}
                </a>
            </div>
        </div>
    `; // <-- that ; is not necessary to be there


    //  own solution below
    //
    // var html = ("<b>" + name + "</b><br><c>operating hours</c><hr><div class='window-info-container'><c>"
    //     + address + "<br>" + phone +
    //     "</c></div>" +
    //     "<div class='window-icon-continer'>" +
    //     "<i class='fas fa-location-arrow'></i>" +
    //     "<i class='fas fa-mobile-alt'></i>" +
    //     "</div>"
    // );
    var icon = ({
        url: "https://cdn.freebiesupply.com/images/large/2x/starbucks-logo-png-transparent.png",
        scaledSize: new google.maps.Size(40, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    });

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        // label: index.toString(),
        icon: icon,
        animation: google.maps.Animation.DROP

    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
        toggleBounce();
        toggleBounce();
    });
    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
    markers.push(marker);
}