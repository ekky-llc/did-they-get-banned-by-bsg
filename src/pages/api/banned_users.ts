// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import data from './data'
import * as _ from 'lodash'

type Data = {
  name: string,
  date_banned: string,
  type: string
}

export default function handler( req: NextApiRequest, res: NextApiResponse<Data[]>) {

  let data_to_be_filtered = _.cloneDeep(data);
  
  const name_filter = req.query.name as string;
  if (name_filter) {
    data_to_be_filtered = _.filter(data_to_be_filtered, (banned_player) => {
      if (banned_player.name.toLowerCase().includes(name_filter.toLowerCase())) {
        return banned_player
      }
    }) as Data[]
  }

  const date_filter = req.query.date as string;
  if (date_filter) {
    const whitelisted_dates = ['2023-02-28', '2023-03-02', '2023-03-03', '2023-03-06', '2023-03-11'];
    const isValidDate = whitelisted_dates.includes(date_filter);
    if (!isValidDate) {
      res.status(200).json([])
    }

    data_to_be_filtered = _.filter(data_to_be_filtered, (banned_player) => {
      if (banned_player.date_banned === date_filter) {
        return banned_player
      }
    }) as Data[]
  }

  data_to_be_filtered = data_to_be_filtered.slice(0,100)

  if (90 > data_to_be_filtered.length) {
    const blanksToAdd = 90 - data_to_be_filtered.length;
    for (let i = 0; i < blanksToAdd; i++) {
      data_to_be_filtered.push({
            name : '',
            date_banned : '',
            type: 'blank'
      })            
    }
  }

  if (data_to_be_filtered.length % 10 > 0) {
    let isNotEven = true;
    while (isNotEven) {
      data_to_be_filtered.push({
        name : '',
        date_banned : '',
        type: 'blank'
      });

      isNotEven = data_to_be_filtered.length % 10 > 0;
    }
  }

  res.status(200).json(data_to_be_filtered)
};