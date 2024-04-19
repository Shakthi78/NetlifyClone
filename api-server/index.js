const express = require('express')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')

const cors = require('cors')

const app = express()
const PORT = 9000

const ecsClient = 'client' // Add client and credentials here

app.use(express.json())
app.use(cors());

app.post('/project', async(req, res)=>{
    const { gitURL } = req.body
    const projectSlug = generateSlug()  
    
    //Spin container on ECS through API calls
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['subnet-05e81e9cef4460a47', 'subnet-060ce9908ffe91626', 'subnet-0d42b1c860357c77a'],
                securityGroups: ['sg-0aa8e5b115aeded9e']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'builder-image',
                    environment: [
                        {name: 'GIT_REPOSITORY_URL', value: gitURL},
                        {name: 'PROJECT_ID', value: projectSlug},
                    ]
                }
            ]
        }
    })

    await ecsClient.send(command)
    return res.json({ status: 'queued', data: {projectSlug, url: `http://${projectSlug}.localhost:8000`}})
})

// async function initRedisSubscribe() {
//     console.log('Subscribed to logs....')
//     subscriber.psubscribe('logs:*')
//     subscriber.get('logs')
//      subscriber.on('pmessage', (pattern, channel, message) => {
//          io.to(channel).emit('message', message)
//     })
    
// }
// initRedisSubscribe()

app.listen(PORT, ()=>{
    console.log(`API Server Runnning...${PORT}`);
})