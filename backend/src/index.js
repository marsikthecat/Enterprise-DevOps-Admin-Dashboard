import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/**
 * List all servers in the Server.tsx
 */
app.get('/servers', async (req, res) => {
  try {
    const servers = await prisma.server.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(servers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Deploy new server
 */
app.post('/servers', async (req, res) => {
  try {
    const { id, type, cpu, memory, storage, region } = req.body;
    if (!id || !type) {
      return res.status(400).json({ error: 'ID and type are required' });
    }
    const server = await prisma.server.create({
      data: {
        id,
        type,
        status: 'healthy',
        cpu: cpu || 4,
        memory: memory || 8,
        disk: storage || 100,
        network: '1 Gbps',
        uptime: '0d 0h',
        location: region || 'us-east-1a',
        ipAddress: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      }
    });
    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** 
 * Get all containers for a specific Server
 */
app.get('/servers/:id/containers', async (req, res) => {
  try {
    const { id } = req.params;
    const containers = await prisma.container.findMany({
      where: {serverId: id}
    })
    res.status(201).json(containers);
  } catch(error) {
    res.status(500).json({ error: error.message});
  }
}) 

/**
 * Deploy new container inside a server
 */
app.post('/servers/:id/containers', async (req, res) => {
  try {
    const { id } = req.params;
    const { container} = req.body;
    const server = await prisma.server.update({
      where: { id },
      data: { containers: { push: container } }
    });
    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get processes from specific server
 */
app.get('/servers/:id/processes', async (req, res) => {
  try {
    const { id } = req.params;
    const processes = await prisma.process.findMany({
      where: { serverId: id}
    })
    res.status(201).json(processes);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
})

/**
 * Get all processes.
 */
app.get('/processes', async (req, res) => {
  try {
    const processes = await prisma.process.findMany({
      orderBy: { createdAt: 'desc'}
    });
    res.json(processes);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
})

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
app.post('/users', async (req, res) => {
  try {
    const { name, email, role, status, avatar } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'Developer',
        status: status || 'active',
        lastLogin: new Date(),
        sessions: 0,
        avatar: avatar || name.split(' ').map(n => n[0]).join('')
      }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.patch('/users/:id', async (req, res) => {
  try {
    const { name, email, role, status, sessions } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(status && { status }),
        ...(sessions !== undefined && { sessions }),
        lastLogin: new Date()
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
