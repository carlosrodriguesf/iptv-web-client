import React, {Component} from 'react'
import styles from "./CategoriesList.module.scss";
import classNames from "classnames";
import {Category} from "../../api/ApiService";

interface CategoriesListProps {
    categories: Category[]
    setCategory: (c: Category | null) => void
    activeCategoryId: string | null
}

export default class CategoriesList extends Component<CategoriesListProps> {
    shouldComponentUpdate(next: CategoriesListProps): boolean {
        return next.categories !== this.props.categories || next.activeCategoryId !== this.props.activeCategoryId
    }

    render() {
        const {categories, activeCategoryId, setCategory} = this.props

        function getClasses(categoryId: string | null) {
            return classNames(styles.category, {
                [styles.active]: activeCategoryId === categoryId
            })
        }

        return (
            <div className={styles.categories}>
                <ul>
                    <button className={getClasses(null)}
                            onClick={() => setCategory(null)}>
                        Todos
                    </button>
                    {categories.map((c: Category) => (
                        <button key={c.categoryId}
                                className={getClasses(c.categoryId)}
                                onClick={() => setCategory(c)}>
                            {c.categoryName}
                        </button>
                    ))}
                </ul>
            </div>
        )
    }
}
