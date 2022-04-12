//URL y KEY - API OPENWEATHERMAP
const api = {
    key: '8d63481a8184b4f80b4dee6c65caed90',
    url: `https://api.openweathermap.org/data/2.5/weather`
};

//VARIABLES
const preload = document.getElementById('preload');
const weatherBox = document.getElementById('weatherbox');
const searchForm = document.getElementById('form-search');
const searchBox = document.getElementById('search-input');
const city = document.getElementById('city');
const temp = document.getElementById('temp');
const tempIcon = document.getElementById('temp-icon');
const weather = document.getElementById('weather');
const descrip = document.getElementById('description');
const rangerMax = document.getElementById('max');
const rangerMin = document.getElementById('min');
let $api;

//PRELOADER
window.onload = () => {
    preload.style.display = 'none';
    preload.style.transition = '0.5s';
}

//Ubicacion del usuario
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSucces, onError);
    } else {
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Su navegador no es compatible con la API de geolocalización',
            showConfirmButton: false,
            timer: 5000
        })
    }
});

//Permiso de geolocalizacion aceptada
function onSucces(position) {
    const { latitude, longitude } = position.coords; //ubicacion del usuario
    //obtener weather de la ubicacion actual con url
    $api = `${api.url}?lat=${latitude}&lon=${longitude}&appid=${api.key}&lang=es`;
    fechData();
}

////Permiso de geolocalizacion rechazada
function onError() {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Permiso denegado de geolocalización',
        showConfirmButton: false,
        timer: 5000
    })
}

// Valor que se ingresa en el INPUT
function requestApi(query) {
    $api = `${api.url}?q=${query}&appid=${api.key}&lang=es`; //ubicacion dada por el usuario
    fechData();
}

//Peticion de datos a la API
async function fechData() {

    Swal.fire({
        position: 'center',
        icon: 'info',
        title: `Obteniendo los resultados...`,
        showConfirmButton: false,
        timerProgressBar: true
    })

    fetch($api)
        .then(response => { return response.json() }) //datos de la url en formato JSON
        .then(data => {
            Swal.close();
            weatherDetail(data);
        })
        .catch(error => { alertErr(); }) //si hay algun error se ejecuta el siguiente codigo

};


//Modificar detalles de weather segun la ciudad
function weatherDetail(data) {
    if (data.cod == '404') {
        weatherBox.style.visibility = 'hidden';
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: `"${searchBox.value}" No es una ciudad valida`,
            showConfirmButton: false,
            timer: 1000
        })
        searchBox.value = "";
    } else {
        //hace visible el box con los datos de la ciudad
        weatherBox.style.visibility = 'visible';
        //modificar los valores por los datos de la API
        city.innerHTML = `${data.name}, ${data.sys.country}`;
        temp.innerHTML = `${toCelcius(data.main.temp)}°C`;
        humidity.innerHTML = `${data.main.humidity}%`
        descrip.innerHTML = data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());
        rangerMax.innerHTML = `${toCelcius(data.main.temp_max)}°C`;
        rangerMin.innerHTML = ` / ${toCelcius(data.main.temp_min)}°C`;
        //weather.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        switch (data.weather[0].icon) {
            case '01d':
                weather.src = 'assets/animated/day.svg'
                break;
            case '01n':
                weather.src = 'assets/animated/night.svg'
                break;
            case '02d':
                weather.src = 'assets/animated/cloudy-day-1.svg'
                break;
            case '02n':
                weather.src = 'assets/animated/cloudy-night-1.svg'
                break;
            case '03d':
            case '03n':
            case '04d':
            case '04n':
                weather.src = 'assets/animated/cloudy.svg'
                break;
            case '09d':
            case '09n':
                weather.src = 'assets/animated/rainy-5.svg'
                break;
            case '10d':
                weather.src = 'assets/animated/rainy-1.svg'
                break;
            case '10n':
                weather.src = 'assets/animated/rainy-6.svg'
                break;
            case '11d':
            case '11n':
                weather.src = 'assets/animated/thunder.svg'
                break;
            case '13d':
            case '13n':
                weather.src = 'assets/animated/snowy-6.svg'
                break;
            default:
                weather.src = ''
        }
        console.log(data)
        updateIcons(data);
    }
}

//CAMBIAR LOS GRADOS KELVIN A CELCIUS
function toCelcius(kelvin) {
    return Math.round(kelvin - 273.15);
}

//SweetAlert Library
function alertErr() {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Ingrese una ciudad',
        showConfirmButton: false,
        timer: 3000
    })
};


//Actualiza el icono de la temperatura segun los centigrados
function updateIcons(data) {
    const temp = toCelcius(data.main.temp);
    let classIcons = 'fa-solid fa-temperature-empty';

    if (temp >= 30) {
        classIcons = 'fa-solid fa-temperature-full';
        tempIcon.style.color = '#E74C3C';
    } else if (temp > 28) {
        classIcons = 'fa-solid fa-temperature-half';
        tempIcon.style.color = '#F39C12';
    } else if (temp > 23) {
        classIcons = 'fa-solid fa-temperature-three-quarters';
        tempIcon.style.color = '#F1C40F';
    } else if (temp > 12) {
        classIcons = 'fa-solid fa-temperature-quarter';
        tempIcon.style.color = '#3498DB';
    } else {
        tempIcon.style.color = "#34495E";
    }
    tempIcon.className = classIcons;
}

//CONTROL DE EVENTO AL PRESIONAR ENTER EN EL FORM
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searchBox.value == '') {
        weatherBox.style.visibility = 'hidden';
        alertErr();
    } else {
        requestApi(searchBox.value);
    }

});