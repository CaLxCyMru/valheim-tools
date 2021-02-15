import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Valheim Tools</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Valheim Tools
        </h1>

        <p className={styles.description}>
          Coming Soon
        </p>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/team-solar/valheim-tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Source on Github
    </a>
      </footer>
    </div >
  )
}
