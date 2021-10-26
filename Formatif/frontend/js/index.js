const SERVICE_URL = 'http://es3e4-a20.us-3.evennode.com/planets/';
const SERVICE_URL_OBSERVATIONS = 'http://es3e4-a20.us-3.evennode.com/planets/5f1ef4071d2fd12580bf11c7?embed=observations';

const HttpCodes = {
    SUCCESS: 200,
    NOT_FOUND: 404,
};

$(document).ready(() => {
    getPlanet();
    $('#btnLoadObservations').click(loadObservations);
});

async function getPlanet() {
    try {
        const response = await axios.get(SERVICE_URL);
        if (response.status === HttpCodes.SUCCESS) {
            const planets = response.data;
            planets.forEach((p) => {
                $('#cboPlanet').append(`<option value='${p.href}?embed=observations'>${p.name}</option>`);
            });
        }
    } catch (err) {
        console.log(err);
    }
}

async function loadObservations() {

    //[3a]
    $('#observations tr:gt(0)').remove(); //Cette ligne efface toutes les lignes du tableau exluant l'en-tête, PAS TOUCHE

    try {
        // Récupérer la valeur de la liste déroulante, si vous n'êtes pas en mesure utiliser la constante SERVICE_URL_OBSERVATIONS
        let planetChoisie = $('#cboPlanet').val();
        //console.log(planetChoisie);

        
        //Faire le requête AJAX avec axios et la valeur de liste déroulante ou la constante SERVICE_URL_OBSERVATIONS
        const response = await axios.get(planetChoisie);
        if (response.status === HttpCodes.SUCCESS) {
            //Utiliser la fonction generateObservationHtml pour afficher chacun des observations dans le tableau #observations
            response.data.observations.forEach(r => {
                //const htmlAInserer = generateObservationHtml(r);
                //$('#observations').append(htmlAInserer);
                $('#observations').append(generateObservationHtml(r));
            })
        }
    } catch (err) {
        console.log(err);
    }
}

function generateObservationHtml(observation) {
    let observationHtml = '<tr>';
    observationHtml += `<td class="align-middle">${observation.location.station}</td>`;
    observationHtml += `<td class="align-middle">${observation.observationDate}</td>`;
    observationHtml += `<td class="align-middle">`;
    observationHtml += `<img class="iconMonster" src="${observation.scientific.assets}" /><br />`; //[3b] Remplacer la propriété src de l'image par celle l'asset du scientific de l'observation
    observationHtml += `${observation.scientific.name}` //[3b]  Afficher ici le nom du scientific de l'observation
    observationHtml += '</td>';
    observationHtml += `<td class="align-middle">${observation.temperature}</td>`;
    observationHtml += `<td class="align-middle">${observation.feelslike}</td>`;
    observationHtml += `<td class="align-middle">${observation.humidity}</td>`;


    observationHtml += `<td class="align-middle">`
    
    //Pour mettre en bold si la pression est + que 100  (utiliser <span class=""> </span> pour un style custom)
    if(observation.pressure > 100){
        observationHtml += `<strong>${observation.pressure}</strong>`
    }else{
        observationHtml += `${observation.pressure}`
    }   
    
    
    observationHtml += `</td>`;


    observationHtml += `<td class="align-middle">${observation.uvIndex}</td>`;
    observationHtml += '</tr>';

    return observationHtml;
}
