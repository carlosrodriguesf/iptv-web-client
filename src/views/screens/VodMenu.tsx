import React from 'react'
import ApiService, {Database} from "../../api/ApiService";
import StreamMenu from "../components/StreamMenu/StreamMenu";

export interface LiveMenuProps {
    apiService: ApiService
    database: Database
}

export default function VodMenu({apiService, database}: LiveMenuProps) {
    return <StreamMenu disableEpg
                       apiService={apiService}
                       categories={database.vod.categories}
                       streams={database.vod.streams}
                       headerActions={[
                           {
                               key: "live",
                               text: "LiveTV",
                               path: "/livetv"
                           },
                           {
                               key: "series",
                               text: "Séries",
                               path: "/livetv"
                           }
                       ]}/>
}
