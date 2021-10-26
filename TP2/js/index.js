const SERVICE_POUKAMON_URL = 'https://api.andromia.science/monsters/atlas';

$(document).ready(() => {
    getPoukamon();
})

//Méthode obtenant de la BD les informations générales de toutes les sortes monstres répertoriées
async function getPoukamon(){
    console.log('Début fcn poukamon');
    try{
        const response = await axios.get(SERVICE_POUKAMON_URL);
        console.log(response.status);
        if(response.status === 200){
            const poukamon = response.data;
            //console.log(poukamon)
            poukamon.forEach(p => {
                //console.log(p.name)
                const htmlAInserer = showPoukamon(p);
                $('#body').append(htmlAInserer);
            });
        }
    }catch(err){}
}

//Méthode montant le code html permettant d'afficher les information de chaque sorte de monstre dans un tablean
function showPoukamon(poukamon){
    //console.log(poukamon.name)
    let poukamonHtml = '<tr>';
    poukamonHtml += '<td>';
    poukamonHtml += `${poukamon.atlasNumber}`;
    poukamonHtml += `<img class="iconPoukamon" src="${poukamon.assets}">`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    poukamonHtml += `<a href="./details.html?atlas=${poukamon.atlasNumber}">${poukamon.name}</a>`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    poukamonHtml += `[${poukamon.health.min} - ${poukamon.health.max}]`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    poukamonHtml += `[${poukamon.damage.min} - ${poukamon.damage.max}]`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    poukamonHtml += `[${poukamon.speed.min} - ${poukamon.speed.max}]`;
    poukamonHtml += '</td>';
    poukamonHtml += '<td>';
    poukamonHtml += `[${(poukamon.critical.min*100).toFixed(2)} - ${(poukamon.critical.max*100).toFixed(2)}]%`;
    poukamonHtml += '</td>';
    poukamonHtml += '</tr>';
    //console.log(poukamonHtml)
    return poukamonHtml;
}