import {IConfig} from "./conf/IConfig";

export class ConfigLoader {

    constructor(private argv: any) {
    }

    public load(): IConfig {

        const env = this.argv.env || "local";
        const configPath: string = `./conf/${env}Config.js`;
        console.log(`Env: ${env} -> ${configPath}`);
        console.log(`Loading default..`);
        const confClass = require(configPath).default;
        console.log(`Loading class..`);
        const conf = new confClass() as IConfig;
        console.log(`Configuration: ${JSON.stringify(conf, null, 2)}`);
        return conf;
    }
}
