import LiveService from "../api/LiveService";
import {useEffect, useState} from "react";
import {Category, Stream} from "../api/Types";

export type Return = [Stream[], Category | null, (cat: Category | null) => void]

export default function useLiveStreams(liveService: LiveService): Return {
    const [streams, setStreams] = useState<Stream[]>([])
    const [category, setCategory] = useState<Category | null>(null)

    useEffect(() => {
        loadStreams()
    }, [category])

    async function loadStreams() {
        setStreams(await liveService.streams(category))
    }

    return [(streams || []), category, setCategory]
}
