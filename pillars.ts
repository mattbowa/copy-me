import bluebird from 'bluebird'
import redis from 'redis'

import { initializeApollo } from 'lib/apolloClient'
import {
  PillarsQuery,
  StrapiQueryFindParams,
  PillarRelations,
} from 'interfaces'
import { PILLARS_QUERY } from 'lib/queries'

const fetchPillars = async <T extends keyof PillarRelations>(params = {}) => {
  try {
    const apolloClient = initializeApollo()

    const [
      {
        data: {
          pillars: { records },
        },
      },
    ] = await Promise.all([
      apolloClient.query<PillarsQuery<T>, StrapiQueryFindParams>({
        query: PILLARS_QUERY,
        variables: {
          sort: 'order',
          ...params,
        },
      }),
    ])

    return records
  } catch (e) {
    console.error('Error fetching pillars', e)
    return []
  }
}

export default fetchPillars
