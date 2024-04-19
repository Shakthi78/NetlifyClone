const { exec } = require('child_process')
const path = require('path')
const fs  = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')

const s3Client = 'client' // Add client and credentials here

const PROJECT_ID = ''

async function init(){
    // publishLog('Building started...')
    const outDirPath = path.join(__dirname, 'output')
    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function(data){
        console.log(data.toString())
        // publishLog(data.toString())
    })

    p.stdout.on('error', function(data){
        console.log('Error', data.toString())
        // publishLog(`Error: ${data.toString()}`)
    })

    p.on('close', async function(){
        console.log('Build complete')
        // publishLog('Build complete')

        const distFolderPath = path.join(__dirname, 'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, {recursive: true})

        // publishLog('Starting to upload')
        for(const file of distFolderContents){
            const filePath = path.join(distFolderPath, file)
            if(fs.lstatSync(filePath).isDirectory()) continue;

            console.log('Uploading', filePath);
            // publishLog(`Uploading ${file}`)

            const command = new PutObjectCommand({
                Bucket: 'vercel-clone-server',
                Key: `__output/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command)
            // publishLog(`Uploaded ${file}`)
            console.log('Uploaded', filePath);

        }
        // publishLog(`Done`)
        console.log('Done....');
    })
}

init()


