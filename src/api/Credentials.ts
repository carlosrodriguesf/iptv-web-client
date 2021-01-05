import axios from "axios";
import {toCamelCase, toSnakeCase} from "../functions/case";

export type OutputFormat = "m3u8" | "ts"

export type Actions = "get_live_streams" | "get_live_categories" | "get_vod_categories" | "get_vod_streams"

export interface ServerInfo {
    userInfo: {
        username: string
        password: string
        message: string
        auth: 1,
        status: string
        expDate: string
        isTrial: number
        active_cons: number
        createdAt: string
        maxConnections: number
        allowedOutputFormats: OutputFormat[]
    },
    serverInfo: {
        url: string
        port: string
        httpsPort: string
        serverProtocol: string
        rtmpPort: string
        timezone: string
        timestampNow: number,
        timeNow: string
    }
}

export interface MountParams {
    action?: Actions
    categoryId?: string | null
}

export default class Credentials {
    private static _globals: Credentials = new Credentials("", "", "")

    public readonly url: string
    public readonly username: string
    public readonly password: string

    private ready: boolean = false;
    private info: ServerInfo = {} as ServerInfo;

    constructor(url: string, username: string, password: string) {
        this.url = url;
        this.username = username;
        this.password = password;
    }

    private async isReady() {
        if (this.ready) {
            return true
        }
        this.info = await this.make("player_api.php")
        this.ready = true
        return true
    }

    public async get(path: string, params?: MountParams) {
        return this.make(path, params)
    }

    private path(path: string): string {
        return `${this.url}/${path}`
    }

    private async make(path: string, params?: MountParams) {
        const {status, data} = await axios.get(this.path(path), {
            params: {
                username: this.username,
                password: this.password,
                ...toSnakeCase(params || {})
            }
        })
        if (status !== 200) {
            throw new Error("Erro")
        }

        return toCamelCase(data)
    }

    public static get globals() {
        return this._globals
    }

    public static setGlobals(url: string, username: string, password: string) {
        this._globals = new Credentials(url, username, password)
    }
}
