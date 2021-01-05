import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Clappr from 'clappr'
import {PlayerProps} from "./types";
import styles from './ClapprPlayer.module.scss'

export default class ClapprPlayer extends Component<PlayerProps> {
    private player: typeof Clappr.Player | null

    private get wrapper(): HTMLDivElement {
        return ReactDOM.findDOMNode(this) as HTMLDivElement
    }

    shouldComponentUpdate(next: Readonly<PlayerProps>) {
        return next.source !== this.props.source
    }

    componentDidUpdate() {
        const {wrapper, props} = this
        const {source} = props
        let {player} = this
        let video = wrapper.querySelector("video") as HTMLVideoElement | null

        if (player) {
            video?.pause()
            player?.destroy()

            player = null
            video = null
        }

        if (source) {
            player = new Clappr.Player({source})
            player.attachTo(wrapper)
            player.play()

            video = wrapper.querySelector("video")
            video?.play()

            const dtp = wrapper.querySelector("[data-player]") as HTMLDivElement
            dtp.style.height = "100%"
            dtp.style.width = "100%"
        }

        this.player = player
    }

    render() {
        return (
            <div className={styles.clapprPlayer}></div>
        )
    }
}
