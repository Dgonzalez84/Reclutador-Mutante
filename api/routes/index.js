const mutant = require('./mutant');

const routes = Application => {
    const Elements = [mutant()];
    Elements.forEach(element => {
        sync(element, Application);
    })
};

const sync = (Element, Application) => {
    Object.entries(Element)
        .forEach(item => {
            const method = item[0];
            const paths = Object.entries(item[1]);
            paths.forEach(p => {
                Application.app[method](p[0], p[1]);
            });
        });
}

module.exports = routes;