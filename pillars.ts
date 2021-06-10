
import redis from 'redis'
import bluebird from 'bluebird'


import { initializeApollo } from 'lib/apolloClient'
import {
  PillarsQuery,
  StrapiQueryFindParams,
  PillarRelations,
} from 'interfaces'
import { PILLARS_QUERY } from 'lib/queries'



const fetchPillars = async (params = {}) => {
  bluebird.promisifyAll(redis.RedisClient.prototype)
  const cache = redis.createClient()
  let data: any[] = []

  await cache.existsAsync('pillars').then(async (res:any) => {
    if (res !== 1) { // cache miss, need to fetch
      data = await fetchPillar(params)
      await cache.set('pillars', JSON.stringify(data));
    } else { // cache hit, will get data from redis
      data = JSON.parse(await cache.getAsync('pillars'));
    }
  });
  return data
};


const fetchPillar = async <T extends keyof PillarRelations>(params = {}) => {
  console.log(`Pillars Executed`)
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




/*
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
*/

