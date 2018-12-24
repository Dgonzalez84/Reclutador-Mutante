const controller = require('../controller/mutantController');

const mutantService = () => ({
    post: {
        '/mutant': (req, res) => {
            controller.isMutant(req, res);
        },
    },

    get: {
        '/stats': (req, res) => {
            controller.getStats(req, res);
        },
    }
});

module.exports = mutantService;