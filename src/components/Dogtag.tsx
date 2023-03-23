import { ReactElement, useEffect, useState } from 'react'
import styles from './Dogtag.module.css'

type banned_player_type = {
    name: string,
    date_banned: string,
    type: string
}

export default function Dogtag(props: { banned_player : banned_player_type }) : ReactElement {

  return (
     <div className={`container${props.banned_player.type === 'blank' ? ' blank' : ''}`}>
        <p>
          {props.banned_player.name.slice(0, 12)}
        </p>
     </div>
  )
}
