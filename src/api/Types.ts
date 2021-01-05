export interface Category {
    categoryId: string
    categoryName: string
    parentId: string
}

export interface Stream {
    num: number
    name: string
    streamType: string
    streamId: number
    streamIcon: string
    epgChannelId: string
    added: string
    categoryId: string
    customSid: string
    tvArchive: number
    directSource: string
    tvArchiveDuration: number
}
