import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::bet-category.bet-category', ({strapi}) => ({
  async bettingTipsToday(ctx){
    const today = new Date().toISOString().split('T')

    const entries = await strapi.db.query("api::bet-category.bet-category").findMany({
      select: [
        'id',
        'title',
        'description',
        'betStatus',
        'stake',
        'bookieSlug'
      ],
      where: {
        published_at: {
          $not: null
        },
        ... await this.sanitizeQuery(ctx)
      },
      populate: {
        bets: {
          select: ['title', 'description', 'date', 'betStatus', 'stake'],
          where: {
            date: {
              $between: [today[0] + 'T' + '00:00:00.000Z', today[0] + 'T' + '23:59:59.999Z']
            },
          },
          populate: {
            tip: {
              select: ['description', 'starts', 'odds', 'homeGoals', 'awayGoals'],
              where: {
                published_at: {
                  $not: null
                },
              },
              populate: {
                homeTeam: {
                  select: ['name'],
                  populate: {
                    logo: {
                      select: ['url']
                    },
                  },
                  where: {
                    published_at: {
                      $not: null
                    },
                  },
                },
                awayTeam: {
                  select: ['name'],
                  populate: {
                    logo: {
                      select: ['url']
                    },
                  },
                  where: {
                    published_at: {
                      $not: null
                    },
                  },
                },
                tipSelections: {
                  select: ['title'],
                  where: {
                    published_at: {
                      $not: null
                    },
                  },
                },
                league: {
                  select: ['title'],
                  where: {
                    published_at: {
                      $not: null
                    },
                  },
                  populate: {
                    logo: {
                      select: ['url']
                    },
                  }
                }
              }
            }
          }
        },
      }
    })

    const sanitizedEntity = await this.sanitizeOutput(entries, ctx)
    return this.transformResponse(sanitizedEntity, {})
  },
}))
