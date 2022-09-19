import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHour } from './utils/convert-hour'
import { convertMinutHour } from './utils/convert-minut-hourt'


const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())


app.get('/games', async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,

                }
            }
        }
    })

    return res.json(games);
})

app.post('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;
    const body: any = req.body;

    const ad = await prisma.ad.create({
        data:{
            gameId,
            name: body.name,
            yearsPlaying: body.name ,
            discord: body.name,
            weekDays: body.name.join(','),
            hourStart: convertHour(body.hourStart),
            hourEnd: convertHour(body.hourEnd),
            useVoiceChannel: body.name, 
        }

    })

    return res.status(201).json(body);
})

app.get('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;
    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,            
        },

        where: {
            gameId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return res.json(ads.map(ad => {
        return{
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutHour(ad.hourStart),
            hourEnd: convertMinutHour(ad.hourEnd),
        }
    }))
})

app.get('/ads/:id/discord', async (req, res) => {
    const adId = req.params.id;
    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
          discord: true,  
        },
        where: {
            id: adId,
        }
    })

    return res.json({
        discord: ad.discord,
    })
})









app.listen(3333)
