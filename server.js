const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

let cases = [];

module.exports = { app, cases };
app.get('/cases', (req, res) => {
    res.json(cases);
});

app.get('/cases/:id', (req, res) => {
    const caseId = req.params.id;
    const foundCase = cases.find(c => c.id === caseId);

    if (!foundCase) {
        return res.status(404).json({ error: 'Case not found' });
    }

    res.json(foundCase);
});

app.post('/cases', (req, res) => {
    const { title, description, status, priority, assignedTo } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const newCase = {
        id: uuidv4(),
        title,
        description,
        status: status || 'open',
        priority: priority || 'medium',
        assignedTo: assignedTo || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    cases.push(newCase);
    res.status(201).json(newCase);
});

app.put('/cases/:id', (req, res) => {
    const caseId = req.params.id;
    const caseIndex = cases.findIndex(c => c.id === caseId);

    if (caseIndex === -1) {
        return res.status(404).json({ error: 'Case not found' });
    }

    const { title, description, status, priority, assignedTo } = req.body;

    cases[caseIndex] = {
        ...cases[caseIndex],
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignedTo !== undefined && { assignedTo }),
        updatedAt: new Date().toISOString()
    };

    res.json(cases[caseIndex]);
});

app.delete('/cases/:id', (req, res) => {
    const caseId = req.params.id;
    const caseIndex = cases.findIndex(c => c.id === caseId);

    if (caseIndex === -1) {
        return res.status(404).json({ error: 'Case not found' });
    }

    cases.splice(caseIndex, 1);
    res.status(204).send();
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        console.log(`API documentation: http://localhost:${PORT}/cases`);
    });
} 