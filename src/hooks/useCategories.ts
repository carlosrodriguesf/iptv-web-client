import LiveService from "../api/LiveService";
import {useEffect, useState} from "react";
import {Category} from "../api/Types";

export default function useCategories(liveService: LiveService): [Category[], () => void] {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        loadCategories()
    }, [])

    async function loadCategories() {
        const categories = await liveService.categories()
        categories.unshift({categoryId: "", categoryName: "TODOS"} as Category)
        setCategories(categories)
    }

    return [(categories || []), loadCategories]
}
