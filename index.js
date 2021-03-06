//API Endpoints//
const hikingProjectAPI = 'https://www.hikingproject.com/data/get-trails?maxDistance=15&key=200286023-b9ca1fa5443dea182f47afd678e98a0c'
const openWeatherAPI = 'https://api.openweathermap.org/data/2.5/weather?appid=94c87d2162df8af9977ccbd60872a522'


function hikesTemplate(hike, image){
	$('.hikesSection').append(`
		<a href=${hike.url} target="_blank">
			<img class="trailImage" src=${image} alt="trail image" onerror="this.src='https://images.unsplash.com/uploads/1412533519888a485b488/bb9f9777';">
		<div class="trailInfo">
			<h3 class="trailName">${hike.name}</h3>
			<p>${hike.summary}</p>
			<p>Distance: ${hike.length} mi</p>
            <p>Rating: ${hike.stars}&#9733;</p>   
		</div>
		</a>
		<br/>
	`);
}

function displayHikes(data){
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
	let newView = document.getElementById("weatherSection");
  	newView.scrollIntoView(true);
}

function getHikes (lat, lon){
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
		$('.hikesSection').html(`<h2 class="hikesError">No hikes found. Please try a different search.</h2>`);
	});
}

function weatherTemplate (data) {
	return `
		<div class="localWeather">
			<div class="userCity">
                <h2>${data.name}</h2><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="weather icon" class="weatherIcon"/>
                <p>${data.weather[0].description}</p>
            </div>
            <div class="cityTemp">
                <p>L:${data.main.temp_min}&#8457;</p>
                <h2>${data.main.temp}&#8457;</h2>
                <p>H:${data.main.temp_max}&#8457;	
            </div>
            <div class="weatherConditions">
                <p>Humidity: ${data.main.humidity}&#37;</p>
                <p>Wind: ${data.wind.speed}mph</p>
            </div>
        </div>
	`
}

function weatherDisplay(data){
	getHikes (data.coord.lat, data.coord.lon);
	$(".weatherSection").html(weatherTemplate(data));
}

function getLocalWeather(){
	let place = $("#location").val();

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
		$(".errorMessage").html(`<h2 class="errorText">Please enter a valid location</h2>`);
	});
}

function runHikeToday (){
	$('.searchForm').submit(function(event){
		event.preventDefault();
		getLocalWeather();
	})
}

$(runHikeToday);


