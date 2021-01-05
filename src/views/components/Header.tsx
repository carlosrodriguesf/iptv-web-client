import React from 'react'
import {Link} from 'react-router-dom'
import styles from './Header.module.scss'

export interface Action {
    key: string
    text: string
    path: string
}

export interface HeaderProps {
    title: string
    actions: Action[]
    onAction: (a: string) => void
}

export default function Header({title, actions, onAction}: HeaderProps) {
    function renderActions() {
        return (
            <div className={styles.actions}>
                {actions.map((action) => (
                    <Link key={action.key} className={styles.action} to={action.path}>
                        {action.text}
                    </Link>
                ))}
            </div>
        )
    }

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {renderActions()}
        </header>
    )
}
