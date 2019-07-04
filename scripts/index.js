var searchButton = document.getElementById('search-button');
var arrowButtonDesktopRight = document.getElementById('arrow-button-desktop-right');
var arrowButtonDesktopLeft = document.getElementById('arrow-button-desktop-left');
var arrowButtonMobileDown = document.getElementById('arrow-button-mobile-down');
var arrowButtonMobileUp = document.getElementById('arrow-button-mobile-up');
var dayDisplayCounter=2;
var previousWidth = window.innerWidth;

function init(){
    var now=new Date();
    inputWeekDays(now.getDay());
    getForecastData('new-york');
}

function inputWeekDays(day){
    var daysContainer = document.getElementById('days-container');
    var weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday','sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    for(var i=1; i<7;i++){
            daysContainer.childNodes[i*2+3].childNodes[1].innerHTML = weekDays[day+i];
    }
}

function getForecastData(city){
    fetch(`https://api.apixu.com/v1/forecast.json?key=94f1ce57c73440d0a7c132103190307&q=${city}&days=7`).then ((res)=> {
        if (res.status === 400) {
            document.getElementById('input-error').style.display='inline-block';
            throw new Error('Error: bad search input');
        }
        return res.json();
    }).then(data=>{
        var daysContainer = document.getElementById('days-container');
        daysContainer.childNodes[1].childNodes[1].innerHTML = city.toUpperCase();
        var i=0;
        for (i=1;i<7;i++){
            daysContainer.childNodes[i*2+3].childNodes[7].innerHTML = data.forecast.forecastday[i].day.condition.text;
            daysContainer.childNodes[i*2+3].childNodes[5].innerHTML = `${Math.round(data.forecast.forecastday[i].day.maxtemp_c)}&#176;/${Math.round(data.forecast.forecastday[i].day.mintemp_c)}&#176;`;
            if(data.forecast.forecastday[i].day.condition.text=='Light rain shower' || data.forecast.forecastday[i].day.condition.text=='Patchy rain possible' ||
            data.forecast.forecastday[i].day.condition.text=='Light drizzle' || data.forecast.forecastday[i].day.condition.text=='Patchy light rain' ||
            data.forecast.forecastday[i].day.condition.text=='Light rain'){
                daysContainer.childNodes[i*2+3].childNodes[3].style.backgroundImage='url(style/graphics/sunny_drizzle.png)';
            }
            if(data.forecast.forecastday[i].day.condition.text=='Partly cloudy'){
                daysContainer.childNodes[i*2+3].childNodes[3].style.backgroundImage='url(style/graphics/partly_cloudy.png)';
            }
            if(data.forecast.forecastday[i].day.condition.text=='Cloudy'){
                daysContainer.childNodes[i*2+3].childNodes[3].style.backgroundImage='url(style/graphics/cloudy.png)';
            }
            if(data.forecast.forecastday[i].day.condition.text=='Sunny' || data.forecast.forecastday[i].day.condition.text=='Clear'){
                daysContainer.childNodes[i*2+3].childNodes[3].style.backgroundImage='url(style/graphics/sunny.png)';
            }
            if(data.forecast.forecastday[i].day.condition.text=='Heavy rain' || data.forecast.forecastday[i].day.condition.text=='Moderate rain' ||
            data.forecast.forecastday[i].day.condition.text=='Moderate rain at times'){
                daysContainer.childNodes[i*2+3].childNodes[3].style.backgroundImage='url(style/graphics/rain.png)';
            }
        }
        daysContainer.childNodes[1].childNodes[7].innerHTML = data.forecast.forecastday[0].day.condition.text;
        daysContainer.childNodes[1].childNodes[5].innerHTML = `${Math.round(data.current.temp_c)}&#176;`;
    }).catch(ex =>{
        console.log(ex);
    });
}

function moveDisplayOneDay(n){
    var daysContainer = document.getElementById('days-container');
    dayDisplayCounter+=2*n;
    dayDisplayCounter=dayDisplayCounter<2?2:dayDisplayCounter;
    if(dayDisplayCounter<=8&&dayDisplayCounter>=2){
        if(n>0){
            daysContainer.childNodes[dayDisplayCounter+1].style.display = 'none';
            daysContainer.childNodes[dayDisplayCounter+7].style.display = 'flex';
        }else{
            daysContainer.childNodes[dayDisplayCounter+3].style.display = 'flex';
            daysContainer.childNodes[dayDisplayCounter+9].style.display = 'none';   
        }
        if(dayDisplayCounter==8){
            arrowButtonDesktopRight.style.display = 'none';
            arrowButtonDesktopLeft.style.marginRight = '20px';
            arrowButtonMobileDown.style.display = 'none';
        }
        if(dayDisplayCounter==2){
            arrowButtonDesktopLeft.style.display = 'none';
            arrowButtonMobileUp.style.display = 'none';
        }
    }
}

arrowButtonDesktopRight.addEventListener('click', function(){
    arrowButtonDesktopRight.style.display = 'inline-block';
    arrowButtonDesktopLeft.style.display = 'inline-block';
    moveDisplayOneDay(1);
});

arrowButtonMobileDown.addEventListener('click', function(){
    arrowButtonMobileDown.style.display = 'inline-block';
    arrowButtonMobileUp.style.display = 'inline-block';
    moveDisplayOneDay(1);
});

arrowButtonDesktopLeft.addEventListener('click', function(){
    arrowButtonDesktopLeft.style.marginRight = '0';
    arrowButtonDesktopRight.style.display = 'inline-block';
    arrowButtonDesktopLeft.style.display = 'inline-block';
    moveDisplayOneDay(-1);
});

arrowButtonMobileUp.addEventListener('click', function(){
    arrowButtonDesktopLeft.style.marginRight = '0';
    arrowButtonMobileDown.style.display = 'inline-block';
    arrowButtonMobileUp.style.display = 'inline-block';
    moveDisplayOneDay(-1);
});

searchButton.addEventListener('click', function(){
    var textInput = document.getElementById('city-input').value;
    if(textInput.replace(/\s+/g, '')!=''){
        getForecastData(textInput);
    }
});

document.getElementById('city-input').addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
        var textInput = document.getElementById('city-input').value;
        if(textInput.replace(/\s+/g, '')!=''){
            getForecastData(textInput);
        } 
    }
}, false);

window.onresize = function(event){
    if(window.innerWidth>600&&previousWidth<=600){
        arrowButtonDesktopRight.style.display=arrowButtonMobileDown.style.display=='none'?'none':'inline-block';
        arrowButtonDesktopLeft.style.display=arrowButtonMobileUp.style.display=='inline-block'?'inline-block':'none';
        arrowButtonMobileDown.style.display = 'none';
        arrowButtonMobileUp.style.display = 'none';
    }
    if(window.innerWidth<=600&&previousWidth>600){
        arrowButtonMobileDown.style.display = arrowButtonDesktopRight.style.display=='none'?'none':'inline-block';
        arrowButtonMobileUp.style.display = arrowButtonDesktopLeft.style.display=='inline-block'?'inline-block':'none';
        arrowButtonDesktopRight.style.display = 'none';
        arrowButtonDesktopLeft.style.display = 'none';
    }
    previousWidth=window.innerWidth;
}

init();