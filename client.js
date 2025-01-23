import axios from 'axios';
import inquirer from 'inquirer';

const menù = [
    {
        type: 'list',
        name: 'menù',
        message: 'Cosa vuoi fare?',
        choices: ['Inserisci film', 'visuallizza film dal titolo', 'visuallizza film dal genere','visuallizza film dalla durata massima', 'Esci']
    }
];

const domandeInserimento = [
    {
        type: 'input',
        name: 'titolo',
        message: 'titolo film:',
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return 'Inserisci un titolo!';
            }
        }
    },

    {
        type: 'input',
        name: 'genere',
        message: 'genere film:',
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return 'Inserisci un genere!';
            }
        }
    },

    {
        type: 'number',
        name: 'durata',
        message: 'durata film:',
        validate: (value) => {
            if (value >= 0 && Number.isInteger(value)) {
                return true;
            } else {
                return 'Inserisci una durata non negativa e utilizza i minuti!';
            }
        }
    },
    {
        type: 'double',
        name: 'prezzo',
        message: 'prezzo film:',
        validate: (value) => {
            if (value >= 0) {
                return true;
            } else {
                return 'Inserisci un prezzo non negativo!';
            }
        }
    },
    {
        type: 'number',
        name: 'punteggio',
        message: 'punteggio del film:',
        validate: (value) => {
            if (value >= 0 && value <=10) {
                return true;
            } else {
                return 'Inserisci un punteggio tra 0 e 10!';
            }
        }
    }
];

function main() {
    inquirer.prompt(menù).then((answers) => {
        switch(answers.menù) {
            case 'Inserisci film':
                inquirer.prompt(domandeInserimento).then((answers) => {
                    axios.put('http://localhost:3000/film', {
                        titolo: answers.titolo.toLowerCase(),
                        genere: answers.genere.toLowerCase(),
                        durata: answers.durata,
                        prezzo: answers.prezzo,
                        punteggio: answers.punteggio
                    }).then((response) => {
                        console.log(response.data);
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
                break;
            case 'visuallizza film dal titolo':
                inquirer.prompt({
                    type: 'input',
                    name: 'titolo',
                    message: 'Titolo film:'
                }).then((answers) => {
                    axios.get(`http://localhost:3000/film/${answers.titolo}`).then((response) => {
                        console.log(response.data);
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
                break;
            case 'visuallizza film dal genere':
                inquirer.prompt({
                    type: 'input',
                    name: 'genere',
                    message: 'Genere Film:'
                }).then((answers) => {
                    axios.get(`http://localhost:3000/genre/${answers.genere}`).then((response) => {
                        console.log(response.data);
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
                break;
            case 'visuallizza film dalla durata massima':
                inquirer.prompt({
                    type: 'number',
                    name: 'durata',
                    message: 'durata massima film:'
                }).then((answers) => {
                    axios.get(`http://localhost:3000/dur/${answers.durata}`).then((response) => {
                        console.log(response.data);
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
            case 'Esci':
                console.log("Bye!");
                return;
        }
    });
}


main();