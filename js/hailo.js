var lat1;
var lon1;
var nearObj = {};
var taxis = [];
var driversNear = 0;
var map = "";
var marker;
//Encoding authtoken
var auth = eval(unescape('%27%74%6F%6B%65%6E%20%6C%76%61%50%4E%54%7A%6A%4D%57%46%63%36%34%36%78%49%38%58%36%69%42%33%66%68%6A%38%74%49%72%43%6A%76%79%73%56%51%4C%4B%4D%38%36%75%45%58%47%6B%73%47%73%70%6F%68%2B%6C%75%4F%72%6F%45%52%33%49%71%70%36%73%4B%52%4F%65%31%6E%45%68%53%6A%46%2B%2F%44%64%35%37%57%56%34%2B%7A%7A%66%4E%59%71%35%48%6D%4F%73%78%72%6E%51%39%63%6F%4D%38%50%76%49%49%4E%75%43%6B%4C%54%51%61%45%32%50%44%37%7A%66%34%6D%36%78%72%65%36%38%38%64%65%6E%39%67%53%54%67%4C%76%62%44%46%64%51%76%6E%64%50%79%36%45%57%51%62%34%74%72%59%4F%6C%6D%51%62%42%50%68%49%6A%38%77%6B%57%4D%56%48%72%69%30%55%30%45%46%61%37%55%4A%6C%58%34%54%72%79%44%78%55%6B%42%51%5A%74%6C%46%7A%6F%4E%48%67%3D%3D%27'));

// Visibility settings

$('#drivers').hide();
$('#eta').hide();

// Geolocation

getLocation = function(position) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
};


showPosition = function(position) {
    lat1 = position.coords.latitude;
    lon1 = position.coords.longitude;
    etaRequest();
    nearRequest();
    success(position);
};

// Hailo eta ajax call

etaRequest = function() {

    $.ajax({
        url: "https://api.hailoapp.com/drivers/eta?latitude=" + lat1 + "&longitude=" + lon1,
        type: "GET",
        headers: {
            'Authorization': auth
        },
        dataType: "JSON",
        success: function(data) {

            var availablility = JSON.stringify(data.etas[0].eta);
            var etaText;

            if (availablility >= 2) {
                etaText = ' minutes away.';
            } else {
                etaText = ' minute away.';
            }
            $('#eta p').html(JSON.stringify(data.etas[0].eta) + etaText);

        },
        error: function() {
            alert('Eta currently unavailable, please try again later.');
        }
    });
    return false;
};


// Hailo nearby ajax call

nearRequest = function() {

    $.ajax({
        url: 'https://api.hailoapp.com/drivers/near?latitude=' + lat1 + '&longitude=' + lon1,
        type: "GET",
        headers: {
            'Authorization': auth
        },
        dataType: "JSON",
        success: function(data) {

            var nearObj = Object.keys(data.drivers);

            var driversNear = Object.keys(data.drivers).length;

            $('#drivers p').html(driversNear + ' drivers nearby.');

            for (var i = 0; i < nearObj.length; ++i) {
                var g = JSON.stringify(data.drivers[i].latitude);
                var h = JSON.stringify(data.drivers[i].longitude);
                taxis = [
                    'Taxi ' + i, g, h
                ];

                generateMarker();


            }

        },
        error: function() {
            alert('Driver locations unavailable, please try again later.');
        }
    });

    return false;
};

//Generate Google map

success = function(position) {

    var coord = new google.maps.LatLng(lat1, lon1);
    var options = {
        zoom: 15,
        center: coord,
        mapTypeControl: false,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), options);

    var marker = new google.maps.Marker({
        position: coord,
        map: map,
        icon: '../img/home-icon.png',
        title: "You are here"
    });


    google.maps.event.addListener(map, 'center_changed', function() {
        var currentCenter = map.getCenter();
        lat1 = currentCenter.lat();
        lon1 = currentCenter.lng();
        etaRequest();
        nearRequest();

    });

};
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
} else {
    error('Geo Location is not supported');
}

// Generate cab markers on map

generateMarker = function() {

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(taxis[1], taxis[2]),
        map: map,
        icon: '../img/cab-icon.png'
    });

};

// Initialise

getLocation();

// A few simple animations for good measure

$('#front-cover').delay(3000).animate({
    'marginTop': '20px'
}, {
    duration: 1000,
    specialEasing: {
        width: "linear",
        height: "circEaseOut"
    }
});


$('#drivers').delay(5000).fadeIn('slow');
$('#eta').delay(6000).fadeIn('slow');