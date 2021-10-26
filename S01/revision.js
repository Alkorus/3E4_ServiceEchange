const name = 'Yannick'; //Définir une variable constante

let age = 32; //Définir une variable qui peut être modifiée
age++;

console.log(age); //Affiche à l'écran/terminal/console

function afficherUtilisateur(nom, age){ //Fonction ave 2 paramètres
    console.log('Mon nom est ' + nom + ' et j\'ai ' + age + ' ans');
}

afficherUtilisateur(name, age); //Appel de Fonction

//Boxing type
const test = 1 + true;
const test2 = false + '9';
console.log(test2);

console.log(('b' + 'a' + + 'a' + 'a'))
//NaN = Not a Number

function additionner(a, b){
    return a+b;
}
const additionnerLambda = (a, b) => /*return*/ a+b;

const resultat = additionnerLambda(2,4);
console.log(resultat);

const fruits = ['Kiwi', 'Banane', 'Fraise', 'Pamplemousse', 'Mangue']

for(let fruit of fruits){
    console.log(fruit);
}

fruits.push('Bleuets');

fruits.forEach(f => console.log(f));

const etudiant = {
    matricule:'0332492',
    nom:'Masse',
    prenom:'Francois',
    cours:[{numero:'3E4', prof: 'Yannick'},
            {numero: '3C3'}]
}

console.log(`Bonjour mon nom est ${etudiant.nom}, ${etudiant.prenom}`)

const afficherNomEtudiant = ({nom}) => console.log(nom);        //Déconstruction d'objet
afficherNomEtudiant(etudiant);