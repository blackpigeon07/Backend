
module.exports = {
    createProvider: async (req, res) =>{
        res.send('created new provider');
    },
    getProvider: async (req, res) =>{
        res.send('here a provider');
    },
    updateProvider: async (req, res) =>{
        res.send('provider updated');
    },
    deleteProvider: async (req, res) =>{
        res.send('provider deleted');
    }
}