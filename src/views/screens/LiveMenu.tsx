import React from 'react'
import ApiService, {Database} from "../../api/ApiService";
import StreamMenu from "../components/StreamMenu/StreamMenu";

export interface LiveMenuProps {
    apiService: ApiService
    database: Database
}

export default function LiveMenu({apiService, database}: LiveMenuProps) {
    return <StreamMenu apiService={apiService}
                       categories={database.live.categories}
                       streams={database.live.streams}
                       headerActions={[
                           {
                               key: "vod",
                               text: "filmes",
                               path: "/movies"
                           },
                           {
                               key: "series",
                               text: "Séries",
                               path: "/movies"
                           }
                       ]}/>
}
