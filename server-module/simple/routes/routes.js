let uri = "/vctrlui/v1/memdb/reload";

const appRouter = (app) => {
    app.get(uri, (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).send('reload success');
    });
}

module.exports = appRouter;