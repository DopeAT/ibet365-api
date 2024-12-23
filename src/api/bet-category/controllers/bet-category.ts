/**
 * challenge controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::bet-category.bet-category', ({strapi}) => ({
    async find(ctx) {
        const today = new Date().toISOString().split('T')

        const entity = await strapi.db.query("api::bet-category.bet-category").findMany({
            select: [
                'id',
                'title',
                'description',
                'betStatus',
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
                        }
                    }
                },
            }
        })

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
        return this.transformResponse(sanitizedEntity, {})
    },

    async findOne(ctx) {
        const { id: slug } = ctx.params

        const entity = await strapi.db.query("api::bet-category.bet-category").findOne({
            select: [
                'id',
                'title',
                'description',
                'betStatus',
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
                    select: ['title', 'description', 'date', 'betStatus'],
                    where: {
                        published_at: {
                            $not: null
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
                                    where: {
                                        published_at: {
                                            $not: null
                                        },
                                    },
                                    logo: {
                                        select: ['url']
                                    },
                                },
                                awayTeam: {
                                    select: ['name'],
                                    where: {
                                        published_at: {
                                            $not: null
                                        },
                                    },
                                    logo: {
                                        select: ['url']
                                    },
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
                        }
                    }
                },
            }
        })

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
        return this.transformResponse(sanitizedEntity, {})
    }
}));
