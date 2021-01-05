import React, {Component, CSSProperties} from "react";
import {difference, findIndex} from "lodash";
import {ChannelTableProps} from "./ChannelTable";
import ChannelButton from "./ChannelButton";
import {Stream} from "../../../api/ApiService";

export interface ChannelChunkProps {
    streams: Stream[]
    rowSize: number
    setStream: (s: Stream) => void
    activeStreamId: number | null
}

export default class ChannelChunk extends Component<ChannelChunkProps> {
    constructor(props: ChannelTableProps, context: any) {
        super(props, context);

        this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this)
    }

    private get cellStyle(): Partial<CSSProperties> {
        const width = (100 / this.props.rowSize).toFixed(0) + "%"
        return {
            width,
            minWidth: width,
            maxWidth: width
        }
    }

    shouldComponentUpdate({activeStreamId, streams}: Readonly<ChannelTableProps>) {
        if (activeStreamId === this.props.activeStreamId) {
            return difference(this.props.streams, streams).length > 0
        }
        if (findIndex(streams, ['streamId', activeStreamId]) !== -1) {
            return true
        }
        return findIndex(this.props.streams, ['streamId', this.props.activeStreamId]) !== -1
    }

    render() {
        const {streams, setStream, activeStreamId} = this.props
        return (
            <tr>
                {streams.map((stream: Stream) => (
                    <td style={this.cellStyle}>
                        <ChannelButton stream={stream}
                                       onClick={() => setStream(stream)}
                                       active={activeStreamId === stream.streamId}/>
                    </td>
                ))}
            </tr>
        )
    }
}
