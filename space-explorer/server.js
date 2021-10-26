import chalk from 'chalk';           //même chose que: const chalk = require('chalk');
import app from './src/app.js';

const PORT = 5000;

app.listen(PORT, err => {

    console.log(chalk.blue(`Mon serveur est démarré et écouté sur le port ${PORT}`));
}); 
