import React from 'react'
import styles from "./styles.module.scss";
import {chunk} from "lodash";
import ChannelChunk from "./ChannelChunk";
import {Stream} from "../../../api/ApiService";

export interface ChannelTableProps {
    streams: Stream[]
    rowSize: number
    setStream: (s: Stream) => void
    activeStreamId: number | null
}

export default function ChannelTable({streams, activeStreamId, rowSize, setStream}: ChannelTableProps) {
    const chunks = chunk(streams, rowSize)
    return (
        <div className={styles.channelTableContainer}>
            <table className={styles.channelTable} cellPadding={0} cellSpacing={0}>
                <tbody>
                {chunks.map((streamChunk: Stream[], index) => (
                    <ChannelChunk key={index}
                                  streams={streamChunk}
                                  activeStreamId={activeStreamId}
                                  setStream={setStream}
                                  rowSize={rowSize}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}
