const SERVICE_PLANET_URL = 'https://api.andromia.science/planets/'

$(document).ready(() => {

    console.log('Mon application test');

    //getPlanetPromise();
    getPlanets();

    /*setTimeout(() => {
        console.log('après 1 seconde');
    }, 1000);

    console.log('fin');*/
});

function getPlanetPromise(){
    console.log('Début de la fonction getPlanetPromise');

    axios.get(SERVICE_PLANET_URL).then(response => {
        console.log(response);
    });
    console.log('Fin de la fonction getPlanetPromise');
}

async function getPlanets(){
    //console.log('Début de la fonction getPlanet');
    try{
        const response = await axios.get(SERVICE_PLANET_URL);
        if(response.status === 200){
            const planets = response.data;
            planets.forEach(p => {
                //TODO: Ajouter le html dansla page index
                const htmlAInserer = showPlanets(p);
                $('#planets').append(htmlAInserer)       //va chercher ce qui dans l'id du même nom dans le html
            });
        }
        
    }catch(err){}
    
    //console.log('Fin de la function getPlanet')
    

}

//retourne le html pour une planète
function showPlanets(planet){
    //console.log(planet);
    let planetHtml = '<div class = "col-2">';
    planetHtml += `<img class="iconPlanet" src="${planet.icon}" />`
    planetHtml += `<h5><a href="./details.html?href=${planet.href}">${planet.name}</a></h5>`
    planetHtml += '</div>';
    return planetHtml;
}