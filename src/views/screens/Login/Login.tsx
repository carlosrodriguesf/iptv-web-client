import React, {FormEvent, useState} from "react";
import styles from './Login.module.scss'
import classNames from "classnames";
import ApiService from "../../../api/ApiService";

interface LoginProps {
    apiService: ApiService
    onAuthenticated: () => void
}

export default function Login({apiService, onAuthenticated}: LoginProps) {
    const [url, setUrl] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    async function submit(e: FormEvent) {
        e.preventDefault()
        try {
            const authenticated = await apiService.setCredentials({
                url, username, password
            })
            if (!authenticated) {
                alert("Os dados de autenticação são inválidos.")
                return false
            }
            onAuthenticated()
        } catch (e) {
            alert(e.message)
        }
        return false
    }

    return (
        <div className={styles.login}>
            <form className={styles.form} onSubmit={submit}>
                <div className={classNames(styles.field, styles.url)}>
                    <label className={styles.title}>Url</label>
                    <input className={styles.input} value={url} onChange={(e) => setUrl(e.target.value)}/>
                </div>
                <div className={classNames(styles.field, styles.user)}>
                    <label className={styles.title}>Username</label>
                    <input className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className={classNames(styles.field, styles.pass)}>
                    <label className={styles.title}>Password</label>
                    <input className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button className={styles.authBtn}>Entrar</button>
            </form>
        </div>
    )
}
