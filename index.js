//API Endpoints//
//for hikingProjectAPI, will need to add lat/lon to url based on user input
const hikingProjectAPI = 'https://www.hikingproject.com/data/get-trails?maxDistance=15&key=200286023-b9ca1fa5443dea182f47afd678e98a0c'
//if I can get lat/lon for hikingProjectAPI, can also be used to id location for openWeatherAPI
const openWeatherAPI = 'https://api.openweathermap.org/data/2.5/weather?appid=94c87d2162df8af9977ccbd60872a522'


function hikesTemplate(hike){
	console.log ("hikesTemplate ran");
	$('.hikesSection').append(`
	<div class="trailInfo row col-12">
			<img src=${hike.imgSmall} alt="trail image">
			<h3><a href=${hike.url} target="_blank">${hike.name}</a></h3>
			<p>Distance: ${hike.length} mi</p>
            <p>Rating: ${hike.stars}&#9733;</p>
            <p>Condition: ${hike.conditionStatus}; ${hike.conditionDetails}</p>
		</div>
	`);
}

function displayHikes(data){
	console.log ("displayHikes ran");
	console.log (data);
	$('.hikesSection').html("");
	let trailsFound = data.trails;
	if (trailsFound.length === 0) {
		$('.hikeSection').append(`<h2 class="hikesError">"Oh no! No hikes were found nearby. Try a different location."</h2>`)
	}
	else{
		for (let i=0; i<trailsFound.length; i++){
			hikesTemplate(trailsFound[i]);
		}
	}
}

function getHikes (lat, lon){
	console.log ("getHikes ran");
	console.log ("lat is", lat);
	console.log ("lon is", lon);
	const settings = {
		url: hikingProjectAPI,
		data: {
			sort: 'distance',
			lat: lat,
			lon: lon
		},
		dataType: 'json',
		type: 'GET',
		success: displayHikes
		};
	$.ajax(settings)
	.fail(function(){
		console.log ("getHikes failed");
		$('.hikesSection').html(`<h2 class="hikesError">No hikes found. Please try a different search.</h2>`);
	});
}


//retrieves and displays weather data
function weatherTemplate (data) {
	return `
		<div class="localWeather row col-6">
			<div class="userCity">
                <h2>${data.name}</h2><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="weather icon" />
                <p>${data.weather[0].description}</p>
            </div>
            <div class="row">
            <div class="cityTemp">
                <p>L:${data.main.temp_min}<span>&#8457;</span></p>
                <h2>${data.main.temp}<span>&#8457;</span></h2>
                <p>H:${data.main.temp_max}<span>&#8457;</span>	
            </div>
            <div class="weatherConditions">
                <p>Humidity: ${data.main.humidity}&#37;</p>
                <p>Wind: ${data.wind.speed}mph</p>
            </div>
            </div>
        </div>
	`
}

function weatherDisplay(data){
	console.log ("weatherDisplay ran");
	console.log (data);
	getHikes (data.coord.lat, data.coord.lon);
	$(".weatherSection").html(weatherTemplate(data));

}

function getLocalWeather(){
	let place = $("#location").val();
	console.log ("place is", place);

	const settings = {
		url: openWeatherAPI,
		data: {
			q: place,
			units: "Imperial"
		},
		dataType: 'jsonp',
		type: 'GET',
		success: weatherDisplay
	};

	$.ajax(settings)
	.fail(function(){
		console.log ("getLocalWeather failed");
		$(".weatherSection").html(`<h2 class="weatherError">Please enter a valid location</h2>`)
	});
}

//runs the app
function runHikeToday (){
	$('.searchForm').submit(function(event){
		event.preventDefault();
		console.log ('runHikeToday ran');
		getLocalWeather();
		

		//getHikes(lat, lon)
	})
}

$(runHikeToday);


