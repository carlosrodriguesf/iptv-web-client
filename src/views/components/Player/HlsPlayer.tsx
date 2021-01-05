import React, {PureComponent} from 'react'
import ReactDOM from 'react-dom'
import Hls from 'hls.js'

import styles from './HlsPlayer.module.scss'
import {PlayerProps} from "./types";


export default class HlsPlayer extends PureComponent<PlayerProps> {
    private hls: Hls

    constructor(props: PlayerProps, context: any) {
        super(props, context);

        this.hls = new Hls()
    }

    private get video(): HTMLVideoElement {
        const $node = ReactDOM.findDOMNode(this) as Element
        return $node.querySelector("video") as HTMLVideoElement
    }

    async componentDidUpdate(prev: Readonly<PlayerProps>) {
        const {video, hls, props} = this
        const {source, onError} = props
        if (source === prev.source) {
            return
        }

        hls.stopLoad()
        video.pause()
        video.currentTime = 0
        if (Hls.isSupported()) {
            hls.loadSource(source)
            hls.attachMedia(video)
            await video.play()
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source
        } else {
            onError("Unsupported type")
        }
    }

    render() {
        return (
            <div className={styles.player}>
                <video controls></video>
            </div>
        )
    }
}
