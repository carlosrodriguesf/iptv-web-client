import styles from './StreamMenu.module.scss'
import {Component} from "react";

import ChannelTable from "../../components/ChannelTable/ChannelTable";
import CategoriesList from "../../components/CategoriesList";
import Header, {Action} from "../../components/Header";
import Player from "../../components/Player/Player";
import ApiService, {Category, Stream, StreamCollection} from "../../../api/ApiService";
import classNames from "classnames";

export interface StreamMenuProps {
    apiService: ApiService
    categories: Category[]
    streams: StreamCollection
    headerActions: Action[]
    disableEpg?: boolean
    epg?: any
}

export interface StreamMenuState {
    filteredStreams: Stream[],
    activeCategory: Category | null
    activeStream: Stream | null
}

export default class StreamMenu extends Component<StreamMenuProps, StreamMenuState> {
    constructor(props: StreamMenuProps, context: any) {
        super(props, context);

        this.state = {
            filteredStreams: props.streams,
            activeCategory: null,
            activeStream: null
        }

        this.setCategory = this.setCategory.bind(this)
        this.setStream = this.setStream.bind(this)
    }

    private setCategory(category: Category | null) {
        let streams: Stream[] = this.props.streams
        if (category) {
            streams = (streams as StreamCollection).category(category)
        }
        this.setState({
            activeCategory: category,
            filteredStreams: streams
        })
    }

    private setStream(stream: Stream) {
        this.setState({activeStream: stream})
    }

    private get activeCategoryId() {
        return this.state.activeCategory?.categoryId || null
    }

    private get activeStreamId() {
        return this.state.activeStream?.streamId || null
    }

    private get activeStreamUrl() {
        const {activeStream} = this.state
        const {apiService} = this.props
        if (!activeStream) {
            return ""
        }
        return apiService.makeStreamUrl(activeStream)
    }

    render() {
        const {props, state, setCategory, setStream, activeCategoryId, activeStreamId, activeStreamUrl} = this
        const {categories, headerActions, disableEpg} = props
        const {filteredStreams} = state

        return (
            <div className={styles.container}>
                <Header title="TV Ao Vivo" actions={headerActions} onAction={(a) => console.log(a)}/>
                <div className={styles.livePlayer}>
                    <nav className={styles.navigation}>
                        <div className={styles.categoryContainer}>
                            <CategoriesList categories={categories}
                                            setCategory={setCategory}
                                            activeCategoryId={activeCategoryId}/>
                        </div>
                        <div className={styles.channelContainer}>
                            <ChannelTable streams={filteredStreams}
                                          rowSize={3}
                                          setStream={setStream}
                                          activeStreamId={activeStreamId}/>
                        </div>
                    </nav>
                    <div className={classNames(styles.playerContainer, {[styles.epgDisabled]: disableEpg})}>
                        <div className={styles.player}>
                            <Player source={activeStreamUrl} onError={() => null}/>
                        </div>
                        {disableEpg ? null : (
                            <div className={styles.epg}>
                                <p>Guia de programação indisponível</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
