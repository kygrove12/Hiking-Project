//API Endpoints//
//for hikingProjectAPI, will need to add lat/lon to url based on user input
const hikingProjectAPI = 'https://www.hikingproject.com/data/get-trails?maxDistance=15&key=200286023-b9ca1fa5443dea182f47afd678e98a0c'
//if I can get lat/lon for hikingProjectAPI, can also be used to id location for openWeatherAPI
const openWeatherAPI = 'https://api.openweathermap.org/data/2.5/weather?appid=94c87d2162df8af9977ccbd60872a522'



function hikesTemplate(hike, image){
	console.log ("hikesTemplate ran");
	$('.hikesSection').append(`
			<img class="trailImage" src=${image} alt="trail image" onerror="this.src='https://images.unsplash.com/uploads/1412533519888a485b488/bb9f9777';">
		<div class="trailInfo">
			<h3 class="trailName"><a href=${hike.url} target="_blank">${hike.name}</a></h3>
			<p>${hike.summary}</p>
			<p>Distance: ${hike.length} mi</p>
            <p>Rating: ${hike.stars}&#9733;</p>
            
		</div>
		<br/>
	`);
}

function displayHikes(data){
	console.log ("displayHikes ran");
	console.log (data);
	$('.hikesSection').html("");
	let trailsFound = data.trails;
	let trailImageArr = ['https://images.unsplash.com/uploads/1412533519888a485b488/bb9f9777','https://images.unsplash.com/photo-1436918671239-a2b72ace4880','https://images.unsplash.com/photo-1420802498636-9d647b43d2eb','https://images.unsplash.com/photo-1444583791700-0bd8d26df657','https://images.unsplash.com/uploads/1411949218166d2b71460/5f516109','https://images.unsplash.com/photo-1458170143129-546a3530d995','https://images.unsplash.com/photo-1476979735039-2fdea9e9e407','https://images.unsplash.com/photo-1519309621146-2a47d1f7103a','https://images.unsplash.com/photo-1525474089639-b5fff4440315','https://images.unsplash.com/photo-1526078192901-a5f41bf14eab'];
	if (trailsFound.length === 0) {
		$('.hikesSection').append(`<h2 class="hikesError">"Oh no! No hikes were found nearby. Try a different location."</h2>`)
	}
	else{
		for (let i=0; i<trailsFound.length; i++){
			hikesTemplate(trailsFound[i], trailImageArr[i]);
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
		<div class="localWeather">
			<div class="userCity">
                <h2>${data.name}</h2><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="weather icon" class="weatherIcon"/>
                <p>${data.weather[0].description}</p>
            </div>
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
	`
}

function weatherDisplay(data){
	console.log ("weatherDisplay ran");
	console.log (data);
	getHikes (data.coord.lat, data.coord.lon);
	$(".weatherSection").html(weatherTemplate(data));
  	let newView = document.getElementById("weatherSection");
  	newView.scrollIntoView(true);
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


