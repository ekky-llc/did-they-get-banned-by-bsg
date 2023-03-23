import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import Dogtag from '@/components/Dogtag'
import { filterBannedUsers, debounce, DEBOUNCE_DELAY } from './filterBannedUsers'

type banned_player_type = {
  name: string,
  date_banned: string,
  type: string
}

export default function Home() {
  const [ bannedUsers, setBannedUsers ] = useState([] as banned_player_type[]);
  const [ focusedUser, setFocusedUser ] = useState(null);

  useEffect(() => {
    (async () => {
      setBannedUsers(await filterBannedUsers())
    })()
  }, []);

  const debouncedSearch = debounce(async (input: string) => {
    setBannedUsers(await filterBannedUsers(input));
  }, DEBOUNCE_DELAY);

  function trigger_search(input: string) {
    debouncedSearch(input);
  }

  return (
    <>
      <Head>
        <title>Did They Get Banned By BSG | Escape From Tarkov</title>
        <meta name="description" content="A web app to keep track of hackers / real money traders that got banned by BSG and Battleye" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.heading}>TARKOV BAN TRACKER</h1>
          <p>This website is not affiliated with Battlestate Games</p>
        </div>
        <div className={styles.search}>
          <input type="text" placeholder='Search for nametag...' onChange={e => trigger_search(e.target.value)}/>
        </div>
        <div className={styles.grid}>
          { bannedUsers && bannedUsers.length > 0 ? bannedUsers.map( banned_user => <Dogtag banned_player={banned_user} />) : '' }
        </div>
        <div className={styles.sidebar}>
          <h2>Welcome to Tarkov Ban Tracker!</h2>
          <p>We're here to help you quickly search through a list of banned users provided by Battlestate games via recent public tweets. Our tool is perfect for players who want to keep track of potential cheaters they had reported due to suspicious behavior and want to know if the player they reported had been potentially banned.</p>
          <p>This should makes it easy to search through the dataset to find the information you are after. Whether you're looking for a specific player or just want to browse through the list, our tool is designed to provide you with reliable and efficient access to the latest information.</p>
          <p>We're committed to providing a valuable resource for gamers who want to stay informed about banned users amongst the Tarkov community. It's really important to have access to this information, and our tool is here to help you stay on top of the latest info.</p>
        </div>
      </main>
    </>
  )
}


