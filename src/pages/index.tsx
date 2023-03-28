import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import data from '../pages/api/data'
import Dogtag from '@/components/Dogtag'
import * as _ from 'lodash'
import { filterBannedUsers, debounce, DEBOUNCE_DELAY } from '../utils/filterBannedUsers'

type banned_player_type = {
  name: string,
  date_banned: string,
  type: string
}

export async function getServerSideProps() {

  const banned_users = _.cloneDeep(data);
  const first_group = banned_users.slice(0, 500)

  return {
    props: {
      banned_users: first_group,
      count: banned_users.length
    },
  }
}

export default function Home(props : { banned_users : banned_player_type[], count: number }) {
  const [ bannedUsers, setBannedUsers ] = useState(props.banned_users as banned_player_type[]);
  const [ bannedUserCount, setBannedUserCount ] = useState(props.count);

  const [ isLoading, setIsLoading ] = useState(false)

  const [ nameFilter, setNameFilter ] = useState('');
  const [ dateFilter, setDateFilter ] = useState('');
  const [ typeFilter, setTypeFilter ] = useState('');

  const [ focusedUser, setFocusedUser ] = useState('');

  const date_filters = [
    "2023-02-28",
    "2023-03-02",
    "2023-03-03",
    "2023-03-06",
    "2023-03-11",
    "2023-03-18",
    "2023-03-21"
  ];

  const type_filters = [
    'Cheater',
    'RMT'
  ]

  const debouncedSearch = debounce(async (input: string, date_filter : string, type_filter: string) => {
    const { banned_users, count } = await filterBannedUsers(input, date_filter, type_filter)
    setBannedUsers(banned_users);
    setBannedUserCount(count);
    setIsLoading(false)
  }, DEBOUNCE_DELAY);

  function trigger_search(input: string, date_filter : string, type_filter: string) {
    debouncedSearch(input, date_filter, type_filter);
  }

  async function setFilter(value : string, type : string) {
    setIsLoading(true)

    if (type === 'name') {
      setNameFilter(value)
      trigger_search(value, dateFilter, typeFilter);
    }

    if (type === 'date') {
      if (dateFilter === value) {
        setDateFilter('')
        trigger_search(nameFilter, '', typeFilter);
      } else {
        setDateFilter(value)
        trigger_search(nameFilter, value, typeFilter);
      }
    }

    if (type === 'type') {
      console.log(type, value)
      if (typeFilter === value) {
        setTypeFilter('')
        trigger_search(nameFilter, dateFilter, '');
      } else {
        setTypeFilter(value)
        trigger_search(nameFilter, dateFilter, value);
      }
    }

    return;
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
          <input type="text" placeholder='Search for nametag...' value={nameFilter} onChange={e => setFilter(e.target.value, 'name')}/>
        </div>
        <div className={styles['meta-info']}>
          <div>
            <h3>Release Filter</h3>
            <div>
              { date_filters.map((date) => <button key={date} className={ dateFilter === date ? styles.active : ''} onClick={(e) => setFilter(date, 'date')}>{date}</button> )}
            </div>
          </div>
          <div>
            <h3>Type Filter</h3>
            <div>
              { type_filters.map((type) => <button key={type} className={ typeFilter === type ? styles.active : ''} onClick={(e) => setFilter(type, 'type')}>{type}</button> )}
            </div>
          </div>
        </div>
        <div className={styles['sub-meta-info']}>
          <div>
            Displaying {new Intl.NumberFormat("en-US").format(_.filter(bannedUsers, user => user.type !== 'blank').length)} out of {new Intl.NumberFormat("en-US").format(bannedUserCount)} results
          </div>
        </div>
        { isLoading && (<div className={styles['loader-container']}><div className={styles.loader}></div></div>) }
        <div className={styles.grid}>
          { bannedUsers && bannedUsers.length > 0 ? bannedUsers.map( (banned_user, index) => <Dogtag key={`${banned_user.name}-${index}`} banned_player={banned_user} />) : '' }
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


