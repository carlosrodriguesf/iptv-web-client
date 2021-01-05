import React, {Component} from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";
import tvSolid from "../../../assets/svg/tv-solid.svg";
import {Stream} from "../../../api/ApiService";

export interface ChannelButtonProps {
    stream: Stream
    onClick: () => void
    active: boolean
}

export interface ChannelButtonState {
    iconError: boolean
}

export default class ChannelButton extends Component<ChannelButtonProps, ChannelButtonState> {
    constructor(props: Readonly<ChannelButtonProps>, context: any) {
        super(props, context);

        this.state = {
            iconError: false
        }
    }

    private get className() {
        return classNames(styles.channel, {
            [styles.active]: this.props.active,
            [styles.movie]: this.props.stream.streamType === "movie"
        })
    }

    private get icon() {
        if (this.state.iconError) {
            return tvSolid
        }
        if (!this.props.stream.streamIcon) {
            return tvSolid
        }
        return this.props.stream.streamIcon
    }

    componentDidUpdate(prev: Readonly<ChannelButtonProps>) {
        if (prev.stream !== this.props.stream) {
            this.setState({iconError: false})
        }
    }

    shouldComponentUpdate(next: Readonly<ChannelButtonProps>): boolean {
        return next.stream.streamId !== this.props.stream.streamId || next.active !== this.props.active
    }

    render() {
        const {className, props, icon} = this
        const {stream, onClick} = props

        return (
            <button key={stream.streamId}
                    className={className}
                    onClick={onClick}>
                <div className={styles.logo}>
                    <img src={icon}
                         alt={stream.name}
                         onError={() => this.setState({iconError: true})}/>
                </div>
                <label className={styles.title}>{stream.name}</label>
            </button>
        )
    }
}
