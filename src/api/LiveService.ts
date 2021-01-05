import Credentials from "./Credentials";
import {Category, Stream} from "./Types";

export default class LiveService {
    private credentials: Credentials

    constructor(credentials: Credentials = Credentials.globals) {
        this.credentials = credentials;
    }

    public async categories(): Promise<Category[]> {
        return this.credentials.get("player_api.php", {action: "get_live_categories"})
    }

    public async streams(category?: string | Category | null): Promise<Stream[]> {
        const categoryId = category && (typeof category === "string" ? category : category.categoryId)
        return this.credentials.get("player_api.php", {action: "get_live_streams", categoryId})
    }

    public async epg() {
        return this.credentials.get("xmltv.php")
    }

    public url(stream: Stream): string {
        const {url, username, password} = this.credentials
        return `${url}/live/${username}/${password}/${stream.streamId}.m3u8`
    }
}
