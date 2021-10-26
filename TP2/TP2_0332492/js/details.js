const SERVICE_MONSTRE_URL = 'https://api.andromia.science/monsters';


//********** bloc pour lire les paramèetres passés par l'url*/
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
    getMonstre(urlParams.atlas);

    //Événement click du bouton Generate pour créer un nouveau monstre
    $('#ajouterMonstre').click(() => {
        addMonster();
    })

    //Événement click de bouton pour voir les observations du monstre
    $('#addLocation').click(() => {
        //console.log('Ajouter localisation');
        ajouterLocation(urlParams.atlas);
    })
})


//Méthode obtenant de la base de données les informations propres à un monstre spécifique et affiche les détails de chaque monstre individuel généré
async function getMonstre(atlas){
    try{
        const response = await axios.get(SERVICE_MONSTRE_URL + "/atlas/" + atlas);
        console.log(response);
        if(response.status === 200){
            const monstre = response.data;
            console.log(monstre.monsters[0]);

            console.log(monstre.atlasNumber);
            $('#atlas').html(monstre.atlasNumber);
            $('#iconPoukamon').attr('src', monstre.assets);
            $('#nomPoukamon').html(monstre.name);

            $('#health').append(`[${monstre.health.min} - ${monstre.health.max}]`);
            $('#damage').append(`[${monstre.damage.min} - ${monstre.damage.max}]`);
            $('#speed').append(`[${monstre.speed.min} - ${monstre.speed.max}]`);
            $('#crit').append(`[${(monstre.critical.min*100).toFixed(2)} - ${(monstre.critical.max*100).toFixed(2)}]%`);

            //console.log(monstre.monsters);

            const monstresUniques = monstre.monsters;
            monstresUniques.forEach(m => {
                //console.log(m);
                const htmlAInserer = showMonster(m);
                $('#bodyDetails').append(htmlAInserer);
            })

            //Comme la méthode getMonstre contient toutes les informations du monstre, il m'apparaît préférable de populer le tableau des locations ici, même si il n'est pas tout de suite visible
            const locations = monstre.locations;
            locations.forEach(l => {
                const htmlAInserer = afficherObservations(l);
                $('.tbodyModal').append(htmlAInserer);
            })
        }
    }catch(err){}
}

//Méthode montant tout le code html permettant d'afficher les informations d'un monstre individuel dans un tableau
function showMonster(monster){

    let poukamonHtml = '<tr>';
    poukamonHtml += '<td>';
    poukamonHtml += `<img class="iconDetails" src="../affinities/${monster.affinity}.png">`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    poukamonHtml += `${monster.health}`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    poukamonHtml += `${monster.damage}`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    poukamonHtml += `${monster.speed}`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    poukamonHtml += `${(monster.critical*100).toFixed(2)}%`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    monster.talents.forEach(t => {
        poukamonHtml += `<img class="iconDetails" src="../affinities/${t}.png">`;
    })
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    monster.kernel.forEach(k => {
        poukamonHtml += `<img class="iconKernel" src="../elements/${k}.png">`;
    })
    poukamonHtml += '</td>';
    poukamonHtml += '<td class="colored-hash">';
    poukamonHtml += generateHash(monster.hash);
    poukamonHtml += '</td>';
    poukamonHtml += '</tr>';

    return poukamonHtml;
}

//Méthode générant le code html requis pour afficher le hash d'un monstre par des couleurs
function generateHash(hash){
    let couleur;
    let compteur = 0        //Sert à savoir ou nous sommes dans le hash
    let hashHtml = `${hash[0]}${hash[1]}`;   //Afficher les deux premiers caractères du hash
    compteur += 2;
    for(let i = 0; i < 10; i++){    //Assembler les dix block de couleurs du hash
        couleur = '';       //initialiser le code de couleur comme étant vide
        for(let j = 0; j < 6; j++){
            couleur += hash[compteur];      //Assembler le code de couleur
            compteur++;
        }
        hashHtml += `<span class="block" style="color: #${couleur}; background-color: #${couleur}">${couleur}</span>`
    }
    for(let k = 0; k < 2; k++){     //Afficher les deux derniers caractères du hash
        hashHtml += `${hash[compteur]}`
        compteur++;
    }
    return hashHtml;
}

//Méthode permettant d'ajouter un monstre individuel à l'espèce et d'afficher le nouvel individu dans le tableau
async function addMonster(){
    //console.log("Ajouter un monstre");

    try{
        const url = `${SERVICE_MONSTRE_URL}/${urlParams.atlas}/actions?type=generate`;
        //console.log(url);

        const response = await axios.post(url);
        if(response.status === 201){
            const monstreAjoute = response.data;
            $('#bodyDetails').prepend(showMonster(monstreAjoute));      //Afficher le nouveau monstre au haut du tableau

        }else{
            console.log(response.data);
        }

    }catch(err){
        console.log(err);
    }
}

//Méthode assemblant le code html permettant d'afficher un location dans un tableau
function afficherObservations(location){
    //console.log(location.time);
    let locationHtml = '<tr>';
    locationHtml += `<td>${location.position}</td>`;
    locationHtml += `<td>${location.time}</td>`;
    locationHtml += '<td>';
    locationHtml += `<img class="iconDetails" src="../seasons/${location.season}.png">`;
    locationHtml += '</td>';
    locationHtml += '<td>';
    locationHtml += `<img class="iconDetails" src="../rarities/${location.rates}.png">`;
    locationHtml += '</td>';
    locationHtml += '</tr>';

    return locationHtml;
}

//Méthode ajoutant une observation du monstre et affichant la dernière obseration au haut du tableau
async function ajouterLocation(atlas){
    //console.log("Ajouter une localisation")
    try{
        const url = `${SERVICE_MONSTRE_URL}/atlas/${atlas}/locations`;
        const requestBody = {
            position: $('#txtLocationPosition').val(),
            time: $('#cboTime').val(),
            season: $('#cboSeason').val(),
            rates: $('#cboRaritie').val()
        }

        const response = await axios.post(url, requestBody);
        console.log(response.status);
        if(response.status === 201){
            const locationAjoute = response.data;
            const htmlAInserer = afficherObservations(locationAjoute);
            $('.tbodyModal').prepend(htmlAInserer);
            console.log("Ajouter une localisation")
        }else{
            console.log(response.data);
        }

    }catch(err){
        console.log(err);
    }
}