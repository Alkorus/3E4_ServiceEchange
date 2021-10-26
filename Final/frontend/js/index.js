const SERVICE_URL = 'http://es3e4-a20.us-3.evennode.com/teams/';

const HttpCodes = {
    SUCCESS: 200,
    NOT_FOUND: 404,
};

$(document).ready(() => {
    getTeams();
});

async function getTeams() {
    try {
        const response = await axios.get(SERVICE_URL);

        if (response.status === HttpCodes.SUCCESS) {
            console.log(response.data)
            //TODO[3a]: Pour l'ensemble des équipes présentes dans la réponse ajouter une ligne au table #teams
            response.data.forEach(t => {
                $('#teams').append(generateTeamHtml(t));
            })

            $('[data-toggle="tooltip"]').tooltip(); //ATTENTION, on ne touche pas c'est pour les info-bulles
        }
    } catch (err) {
        console.log(err);
    }
}

function generateTeamHtml(team) {
    let teamHtml = '<tr>';
    teamHtml += `<td class="align-middle size18">${team.planet}</td>`;
    teamHtml += '<td class="align-middle">'
    //TODO[3b]: Compléter les propriétés src et title pour afficher les information de l'entraineur
    teamHtml += `<img class="iconMonster" data-toggle="tooltip" data-placement="bottom" src="${team.coach.ancestor.assets}" title="Coach - ${team.coach.name}" />`;
    teamHtml +=  '</td>';
    teamHtml += '<td class="align-middle">'
    //TODO[3c]: Ajouter l'ensemble des joueurs de l'équipe dans le tableau en utilisant la fonction generatePlayerHtml()
    team.players.forEach(p => {
        teamHtml += generatePlayerHtml(p);
    })
    teamHtml +=  '</td>';
    teamHtml += '<td class="align-middle">'
    teamHtml += generateRating(team.rating);
    teamHtml +=  '</td>';
    teamHtml += '</tr>';

    return teamHtml;
}

function generatePlayerHtml(player) {
    let playerHtml = '';
    //TODO[3c]: Compléter les propriétés src et title pour afficher les informations du joueur
    playerHtml = `<img class="iconMonster" data-toggle="tooltip" data-placement="bottom" src="${player.ancestor.assets}" title="${player.position} - ${player.name}" />`
    return playerHtml;
}

function generateRating(rating) {

    let ratingHtml = '';
    //TODO[3d]: Mise en forme du texte de l'évaluation de l'équipe >= 90 classe green sinon classe red
    if(rating < 90){
        ratingHtml += '<span class="red">';
    }else{
        ratingHtml += '<span class="green">';
    }
    ratingHtml += rating;
    ratingHtml += '</span>'
    
    return ratingHtml;
}
