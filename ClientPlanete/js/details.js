//const PLANET_URL = 'https://api.andromia.science/planets/5f1ef4071d2fd12580bf11c6'; 
const ELEMENT_IMG_URL='https://assets.andromia.science/elements';


//********** bloc pour lire les paramètres passés par l'url*/
const urlParams = {};
(window.onpopstate = function () {
    let match;
    const pl = /\+/g; // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=?([^&]*)/g;
    const decode = function (s) {
    return decodeURIComponent(s.replace(pl, ' '));
    };
    const query = window.location.search.substring(1);

    while ((match = search.exec(query))) urlParams[decode(match[1])] = decode(match[2]);
})();



$(document).ready(() =>{

    console.log(urlParams);
    getPlanet(urlParams.href);

    //Ajout de l'événement sur le bouton ajouter portal
    $('#btnAjouterPortal').click(() => {
        addPortal();
    });

    //Ajout de l'événement clic sur le bouton extracion
    $('#btnExtraction').click(() => {
        minePlanet();
    })

})

async function minePlanet() {
    //TODO: Trouver l'url
    const urlMine = `${urlParams.href}/actions?type=mine`

    //TODO: Faire la requête
    try{
        const response = await axios.get(urlMine)

        //TODO: Traiter la réponse
        if(response.status === 200)
        {
            const extraction = response.data
            // Générer le html
            let extraxtionHtml = '';
            extraction.forEach(e => {
                extraxtionHtml += '<tr class="">';
                extraxtionHtml += `<td><img class="element" src="${ELEMENT_IMG_URL}/${e.element}.png" title="${e.element}" /></td>`;
                extraxtionHtml += `<td>${e.quantity}</td>`;
                extraxtionHtml += '</tr>';
            })

            // Ajouter le html dans le popup
            $('#extraction tbody').html(extraxtionHtml);

        }else{

        }

    }catch(err){
        console.log(err);
    }

}

//Fonction pour ajouter un portail à la planète
async function addPortal(){
    console.log('Add portal');
    console.log($('#txtPortalPosition').val());
    console.log($('#cboAffinity').val());

    //TODO: Ajouter un protail
    try{
        //POST vers notre serveur
        const url = `${urlParams.href}/portals`;
        const requestBody = {
            position: $('#txtPortalPosition').val(),
            affinity: $('#cboAffinity').val()
        };
        
        const response = await axios.post(url, requestBody);
        if(response.status === 201)
        {
            //L'ajout du portsil a été fait sur le serveur
            const portalAjoute =  response.data;
            let portalHtml = '';
            portalHtml += '<tr>';
            portalHtml += `<td>${portalAjoute.position}</td>`;
            portalHtml += `<td><img src="./img/${portalAjoute.affinity}.png"/></td>`;     //Ce code va être lu depuis details.html, donc pas besoin de reculer dans les folders
            portalHtml += '</tr>';

            $('#portals').append(portalHtml);

        }else{
            //Erreur lors de l'ajout
            console.log(response.data);
        }

    }catch(err){
        console.log(err);
    }
}

//Appeler le service pour obtenir les informations d'une planète
async function getPlanet(url){
    const response = await axios.get(url);
    console.log(response);
    const planet = response.data;

    //Afficher les détails
    $('#lblName').html(planet.name);
    $('#imgPlanet').attr('src', planet.icon);

    $('#lblDiscoveredBy').html(planet.discoveredBy);
    $('#lblDiscoveryDate').html(planet.discoveryDate);
    $('#lblTemperature').html(planet.temperature);
    $('#lblPosition').html(`(${planet.position.x.toFixed(3)};${planet.position.y.toFixed(3)};${planet.position.z.toFixed(3) })`);

    //afficher les satellites de la planète dans le ul
    const satellites = planet.satellites;
    let satellitesHtml = '';

    if(satellites.length > 0)
    {
        satellites.forEach(s => {
            satellitesHtml += `<li>${s}</li>`;
        });
    }else{
        satellitesHtml = 'Aucun satellite';
    }

    $("#satellite").html(satellitesHtml);      //.html() remplace ce qui est dans la balise identifiée par l'id


    //Afficher les portails de la planète
    $('#portals').append(showPortals(planet.portals));


}

//Fonction générant le html à ajouter au tableau des portails
function showPortals(portals){
    let portalsHtml = '';

    portals.forEach(p => {
        portalsHtml += '<tr>';
        portalsHtml += `<td>${p.position}</td>`;
        portalsHtml += `<td><img src="./img/${p.affinity}.png"/></td>`;     //Ce code va être lu depuis details.html, donc pas besoin de reculer dans les folders
        portalsHtml += '</tr>';
    });

    return portalsHtml;
}

