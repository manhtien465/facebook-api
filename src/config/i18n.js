import i18n from 'i18n';
import path from 'path';

console.log(path.join(__dirname, '/locales'));

i18n.configure({
    directory: path.join(__dirname, '/locales')
});

export default i18n;
