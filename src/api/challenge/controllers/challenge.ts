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
            populate: {
                bets: {
                    select: ['title']
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
            populate: {
                bets: {
                    select: ['title', 'description', 'date', 'betStatus', 'stake'],
                    populate: {
                        tips: {
                            select: ['description', 'starts', 'odds'],
                            populate: {
                                homeTeam: {
                                    select: ['name'],
                                    populate: {
                                        logo: {
                                            select: ['url']
                                        },
                                    }
                                },
                                awayTeam: {
                                    select: ['name'],
                                    populate: {
                                        logo: {
                                            select: ['url']
                                        },
                                    }
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
