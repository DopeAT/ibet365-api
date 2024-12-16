/**
 * challenge controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::challenge.challenge', ({strapi}) => ({
    async find(ctx) {
        const entity = await strapi.db.query("api::challenge.challenge").findMany({
            select: [
                'id',
                'title',
                'slug',
                'description',
                'challengeStatus',
                'totalBets',
                'bank'
            ],
            where: {
              published_at: {
                  $not: null
              },
              ... await this.sanitizeQuery(ctx)
            },
            populate: {
                bets: {
                    select: ['title'],
                    where: {
                        published_at: {
                            $not: null
                        },
                    }
                },
            }
        })

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
        return this.transformResponse(sanitizedEntity, {})
    },

    async findOne(ctx) {
        const { id: slug } = ctx.params

        const entity = await strapi.db.query("api::challenge.challenge").findOne({
            select: [
                'id',
                'title',
                'slug',
                'description',
                'challengeStatus',
                'totalBets',
                'bank'
            ],
            where: {
                slug,
                published_at: {
                    $not: null
                },
                ... await this.sanitizeQuery(ctx)
            },
            populate: {
                bets: {
                    select: ['title', 'description', 'date', 'betStatus', 'stake'],
                    where: {
                        published_at: {
                            $not: null
                        },
                    },
                    populate: {
                        tips: {
                            select: ['description', 'starts', 'odds'],
                            where: {
                                published_at: {
                                    $not: null
                                },
                            },
                            populate: {
                                homeTeam: {
                                    select: ['name'],
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
                                },
                                awayTeam: {
                                    select: ['name'],
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
                                },
                                tipsSelections: {
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
                                        country: {
                                            select: ['name'],
                                            where: {
                                                published_at: {
                                                    $not: null
                                                },
                                            },
                                            populate: {
                                                flag: {
                                                    select: ['url']
                                                },
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    }
                },
            }
        })

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
        return this.transformResponse(sanitizedEntity, {})
    }
}));
