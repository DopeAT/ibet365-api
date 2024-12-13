/**
 * challenge controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::bet-category.bet-category', ({strapi}) => ({
    async find(ctx) {
        const entity = await strapi.db.query("api::bet-category.bet-category").findMany({
            select: [
                'id',
                'title',
                'description',
                'betStatus',
            ],
            populate: {
                bets: {
                    select: ['title'],
                    populate: {
                        tips: {
                            select: ['description', 'starts', 'odds'],
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
            populate: {
                bets: {
                    select: ['title', 'description', 'date', 'betStatus'],
                    populate: {
                        tips: {
                            select: ['description', 'starts', 'odds'],
                            populate: {
                                homeTeam: {
                                    select: ['name'],
                                    logo: {
                                        select: ['url']
                                    },
                                },
                                awayTeam: {
                                    homeTeam: {
                                        select: ['name']
                                    },
                                    logo: {
                                        select: ['url']
                                    },
                                },
                                tipsSelections: {
                                    select: ['title']
                                },
                                league: {
                                    select: ['title'],
                                    populate: {
                                        logo: {
                                            select: ['url']
                                        },
                                        country: {
                                            select: ['name'],
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
