import winston from "winston";
import Transport from "winston-transport";
import config from "../../d2.config.js"

const logsQuery: any = {
    logs: {
        resource: `dataStore/${config.dataStoreNamespace}/logs`,
    }
}

const logsMutation: any = {
    resource: `dataStore/${config.dataStoreNamespace}/logs`,
    type: "update",
    data: ({data}: any) => data
}

class DataStoreTransport extends Transport {
    engine: any;

    constructor({engine, ...opts}: any) {
        super(opts);
        this.engine = engine;
    }

    log(info: any, callback: any) {
        this.engine.query(logsQuery)
            .then((data: any) => {
                const logs = data.logs ?? [];
                logs.push(info);
                return this.engine.query(logsMutation, {data: logs}).then(() => {
                    callback();
                })
            })
    }
}

const logger = winston.createLogger({

    transports: [
        new winston.transports.Console(),
    ]
})


export {
    logger,
    DataStoreTransport
}
