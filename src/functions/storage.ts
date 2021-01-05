interface GenericObject {
    [key: string]: any | null
}

class ProxyConfig<T extends GenericObject> implements ProxyHandler<T> {
    private readonly loaded: Array<keyof T>
    private readonly suffix: string
    private readonly storage: Storage

    constructor(storage: Storage, suffix: string = "") {
        this.loaded = []
        this.suffix = suffix
        this.storage = storage
    }

    get<K extends keyof T>(target: T, property: K): T[K] | null {
        if (!this.loaded.includes(property)) {
            target[property] = this.getItem(property) as T[K]
            this.loaded.push(property)
        }
        return target[property]
    }

    set<K extends keyof T>(target: T, property: K, value: T[K]): boolean {
        target[property] = value
        return this.setItem(property, value)
    }

    private key(property: keyof T) {
        return `${this.suffix}:${property}`
    }

    private getItem<K extends keyof T>(property: K): T[K] | null {
        const key = this.key(property)
        const item = this.storage.getItem(key) || "null"
        return JSON.parse(item)
    }

    private setItem<K extends keyof T>(property: K, value: T[K]) {
        const key = this.key(property)
        this.storage.setItem(key, JSON.stringify(value))
        return true
    }
}

export default function storage<T extends GenericObject>(storage: Storage, suffix: string, defaults: T): T {
    return new Proxy(defaults, new ProxyConfig(storage, suffix)) as T
}
