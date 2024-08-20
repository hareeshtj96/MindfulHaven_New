const serverConfig =(server:any, config:any)=> {
    const startServer =()=> {
        server.listen(config.port, () => {
            console.log(`Server is listening on port ${config.port}`)
        });
    }
    return {
        startServer
    }
}

export default serverConfig;