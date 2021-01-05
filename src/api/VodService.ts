import Credentials from "./Credentials";
import {Category, Stream} from "./Types";

export default class VodService {
    private credentials: Credentials

    constructor(credentials: Credentials = Credentials.globals) {
        this.credentials = credentials;
    }

    public async categories(): Promise<Category[]> {
        return this.credentials.get("player_api.php", {action: "get_vod_categories"})
    }

    public async streams(category?: Category): Promise<Stream[]> {
        const categoryId = category && (typeof category === "string" ? category : category.categoryId)
        return this.credentials.get("player_api.php", {action: "get_vod_streams", categoryId})
    }

    public url(stream: Stream): string {
        const {url, username, password} = this.credentials
        return `${url}/movie/${username}/${password}/${stream.streamId}.mp4`
    }
}
