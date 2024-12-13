import mongoose from 'mongoose'

const connection: { isConnected?: number } = {}

async function connectDb() {
  if (connection.isConnected) {
    return
  }

  const db = await mongoose.connect(process.env.DATABASE_URL!, {
    dbName: 'replay_permissionless_db',
  })

  connection.isConnected = db.connections[0].readyState
}

export { connectDb }
