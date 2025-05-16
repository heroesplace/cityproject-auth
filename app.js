import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from './database/postgresql/index.js'
import dotenv from 'dotenv'

dotenv.config()

await pool.migrateDatabase()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET

console.log(bcrypt.hashSync("admin", 10))

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' })
  }

  try {
    const client = await pool.getClient()
    
    const userQuery = await client.query('SELECT * FROM users WHERE username = $1', [username])
    const user = userQuery.rows[0]

    if (!user) {
      // Simuler une vérification afin d'éviter une faille de sécurité basée sur le temps de réponse
      await bcrypt.compare(password, '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
      return res.status(401).json({ error: 'Invalid credentials !' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials !' })
    }

    // Création d'un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.status(200).json({
      status: "valid",
      message: 'Login successful', 
      id: user.id,
      token
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
