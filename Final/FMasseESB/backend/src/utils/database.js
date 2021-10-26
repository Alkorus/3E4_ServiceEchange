import mongoose from 'mongoose';
import chalk from 'chalk';

export default () => {

    const url = process.env.DATABASE;
    console.log(chalk.green(`[MONGO] - Establish new connection with url: ${url}`));
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    mongoose.connect(url).then(
        () => { console.log(chalk.green(`[MONGO] - Connected to: ${url}`)); },
        err => { /*TODO:*/ }
    );
}

//https://github.com/Automattic/mongoose/issues/5285
// const flattenObject = (oldObject) => {
//     const setObject = {}
//     Object.keys(oldObject).forEach((key) => {
//       if (typeof oldObject[key] === 'object') {
//         Object.keys(oldObject[key]).forEach((subkey) => {
//           setObject[`${key}.${subkey}`] = oldObject[key][subkey]
//         })
//       } else {
//         setObject[key] = oldObject[key]
//       }
//     })
//     return setObject
//   }
  
//   module.exports = (req, res, next) => {
//     if (typeof req.body === 'object') {
//       req.body = flattenObject(req.body)
//       return next()
//     }
//     return next()
//   }
