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
    "2023-03-21",
    "2023-03-25"
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
        <title>Tarkov Ban Tracker | Keep track of hackers / real money traders that got banned by BSG</title>
        <meta name="description" content="A web app to keep track of hackers / real money traders that got banned by BSG and Battleye" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://fav.farm/💩" />
      </Head>
      <main id="search"  className={styles.main}>
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
        <div id="view" className={styles['sub-meta-info']}>
          <div>
            Displaying {new Intl.NumberFormat("en-US").format(_.filter(bannedUsers, user => user.type !== 'blank').length)} out of {new Intl.NumberFormat("en-US").format(bannedUserCount)} results
          </div>
        </div>
        { isLoading && (<div className={styles['loader-container']}><div className={styles.loader}></div></div>) }
        <div className={styles.grid}>
          { bannedUsers && bannedUsers.length > 0 ? bannedUsers.map( (banned_user, index) => <Dogtag key={`${banned_user.name}-${index}`} banned_player={banned_user} />) : '' }
        </div>
        <div id="about" className={styles.sidebar}>
          <div className={styles.card}>
            <h2>About</h2>
            <p>You've probably seen the tweets from Battlestate Games naming and shaming banned users.</p>
            <p>I had a domain name left over from the Kidnapped Trader Event, and decided to make this tool to search through the dataset to help find the scumbags you are after.</p>
            <p>This website is just for fun, and will only last as long as Battlestate Games keeps releasing these datasets.</p>
          </div>
          <div className={styles.card}>
            <h2>FAQ</h2>
            <p><strong>Whats up with the different coloured dogtags?</strong><br />- Blue dogtags are for cheaters, and Purple ones are for Real Money Traders (RMT).</p>
            <p><strong>Why bother making this?</strong><br />- Got bored waiting for players to run into me on Interchange whilst I grind out chumming, so I'm sitting in bushes slinging some dirty code.</p>
            <p><strong>The filtering can be janky?</strong><br />- It's just you, probably just a skill issue.</p>
            <p><strong>It's not very mobile friendly!</strong><br />- I don't really care too much, its functional.</p>
            <p><strong>Something not working?</strong><br />- You can try and drop an issue in the <a href="https://bit.ly/40IzT3c">discord</a>, if it's a big enough problem I'll fix it.</p>
          </div>
          <div className={styles.card}>
            <h2>Roadmap*</h2>
            <p>- Implement proper pagination system, and move the dataset to a legitmate database service.</p>
            <p>- Implement a tracking/watchlist system, allowing you to add 'dogtags' to see if your report actually ended up getting a sus player banned.</p>
            <p>- Add some more stats to this screen (totals breakdown, average bans per week etc).</p>
            <p>*All roadmap items are unlikely to be implemented due to laziness.</p>
          </div>
          <div className={styles.card}>
            <h2>Other</h2>
            <p>This website is just for funsies, this runs on free services like <a href="https://now.sh">now.sh</a> and <a href="https://cloudflare.com">cloudflare</a> at zero cost, if you feel the need to send money to someone, send it to your charity or a local homeless shelter rather than Video Game tools.</p>
          </div>
        </div>
      </main>
      <div className={styles.mobileNavigation}>
        <div>
          <a href="#search">
          Filter
          </a>
          </div>
        <div><a href="#view">
          View
          </a>
          </div>
        <div><a href="#about">
          About
          </a>
          </div>
      </div>
    </>
  )
}


