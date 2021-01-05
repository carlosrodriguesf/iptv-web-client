import storage from "../functions/storage";
import axios from "axios";
import {toCamelCase} from "../functions/case";
import {get} from 'lodash'

export type Actions = "get_live_streams" | "get_live_categories" | "get_vod_categories" | "get_vod_streams"

export type OutputFormat = "m3u8" | "ts"

export interface Credentials {
    url: string
    username: string
    password: string
}

export interface Category {
    categoryId: string
    categoryName: string
    parentId: string
}

type StreamType = "live" | "movie"

export interface Stream {
    num: number
    name: string
    streamType: StreamType
    streamId: number
    streamIcon: string
    epgChannelId: string
    added: string
    categoryId: string
    customSid: string
    tvArchive: number
    directSource: string
    tvArchiveDuration: number
}

export interface Database {
    live: {
        categories: Category[]
        streams: StreamCollection
        epg: any
    },
    vod: {
        categories: Category[]
        streams: StreamCollection
    }
}

export interface ServerInfo {
    userInfo: {
        username: string
        password: string
        message: string
        auth: number,
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


interface StorageScheme {
    updatedAt: number
    liveCategories: Category[]
    liveStreams: Stream[]
    vodCategories: Category[]
    vodStreams: Stream[]
    epg: any
}

class RequestMaker {
    private credentials: Credentials

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    private get url() {
        return this.credentials.url
    }

    private get username() {
        return this.credentials.username
    }

    private get password() {
        return this.credentials.password
    }

    private path(path: string): string {
        return `${this.url}/${path}`
    }

    public async make(path: string, action?: Actions) {
        const {status, data} = await axios.get(this.path(path), {
            params: {
                username: this.username,
                password: this.password,
                action
            }
        })
        if (status !== 200) {
            throw new Error("Erro")
        }
        return toCamelCase(data)
    }
}

export class StreamCollection extends Array {
    category(category: Category) {
        return this.filter((stream: Stream) => stream.categoryId === category.categoryId)
    }

    static fromArray(stream: Stream[]): StreamCollection {
        const collection = new StreamCollection()
        collection.push(...stream)
        return collection
    }
}

export default class ApiService {
    private readonly credentials: Credentials
    private readonly requestMaker: RequestMaker
    private readonly storage: StorageScheme
    private info: ServerInfo | null = null

    constructor() {
        this.credentials = storage(localStorage, "crd", {
            url: "",
            username: "",
            password: ""
        });
        this.requestMaker = new RequestMaker(this.credentials)
        this.storage = storage(localStorage, "sch", {
            updatedAt: 0,
            liveCategories: [],
            liveStreams: [],
            vodCategories: [],
            vodStreams: [],
            epg: null
        })
    }

    public async authenticated(): Promise<boolean> {
        if (!this.info) {
            await this.loadServerInfo()
        }
        return get(this.info, "userInfo.auth") === 1
    }

    public async setCredentials(credentials: Credentials): Promise<boolean> {
        this.info = null
        Object.assign(this.credentials, credentials)
        return await this.authenticated()
    }

    public async database(): Promise<Database> {
        if (Date.now() - this.storage.updatedAt > 10000000) {
            await this.sync()
        }
        return {
            live: {
                categories: this.storage.liveCategories,
                streams: StreamCollection.fromArray(this.storage.liveStreams),
                epg: this.storage.epg
            },
            vod: {
                categories: this.storage.vodCategories,
                streams: StreamCollection.fromArray(this.storage.vodStreams)
            }
        }
    }

    public async sync() {
        try {
            await Promise.all([
                this.syncLiveCategories(),
                this.syncLiveStreams(),
                this.syncVodCategories(),
                this.syncVodStreams()
            ])
            this.storage.updatedAt = Date.now()
        } catch (e) {
            console.log(e)
        }
    }

    public makeStreamUrl(stream: Stream) {
        const {url, username, password} = this.credentials
        switch (stream.streamType) {
            case "live":
                return `${url}/live/${username}/${password}/${stream.streamId}.m3u8`
            case "movie":
                return `${url}/movie/${username}/${password}/${stream.streamId}.mp4`
            default:
                throw new Error("Invalid stream type")
        }
    }

    private async loadServerInfo() {
        if (!this.credentials.url) {
            return
        }
        this.info = await this.make("player_api.php")
    }

    private async syncVodStreams() {
        this.storage.vodStreams = await this.make("player_api.php", "get_vod_streams")
    }

    private async syncVodCategories() {
        this.storage.vodCategories = await this.make("player_api.php", "get_vod_categories")
    }

    private async syncLiveStreams() {
        this.storage.liveStreams = await this.make("player_api.php", "get_live_streams")
    }

    private async syncLiveCategories() {
        this.storage.liveCategories = await this.make("player_api.php", "get_live_categories")
    }

    private make(path: string, action?: Actions) {
        return this.requestMaker.make(path, action)
    }
}
