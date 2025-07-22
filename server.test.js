const request = require('supertest');
const { app, cases } = require('./server');

describe('HMCTS Case Management API', () => {
    beforeEach(() => {
        cases.length = 0;
    });

    describe('POST /cases', () => {
        test('should create a new case with required fields', async () => {
            const newCase = {
                title: 'Test Case',
                description: 'Test Description'
            };

            const response = await request(app)
                .post('/cases')
                .send(newCase)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newCase.title);
            expect(response.body.description).toBe(newCase.description);
            expect(response.body.status).toBe('open');
            expect(response.body.priority).toBe('medium');
            expect(response.body.assignedTo).toBe(null);
            expect(response.body).toHaveProperty('createdAt');
            expect(response.body).toHaveProperty('updatedAt');
            expect(cases).toHaveLength(1);
        });

        test('should create a new case with all fields', async () => {
            const newCase = {
                title: 'Complete Test Case',
                description: 'Complete Test Description',
                status: 'in-progress',
                priority: 'high',
                assignedTo: 'judge.test@hmcts.gov.uk'
            };

            const response = await request(app)
                .post('/cases')
                .send(newCase)
                .expect(201);

            expect(response.body.title).toBe(newCase.title);
            expect(response.body.description).toBe(newCase.description);
            expect(response.body.status).toBe(newCase.status);
            expect(response.body.priority).toBe(newCase.priority);
            expect(response.body.assignedTo).toBe(newCase.assignedTo);
        });

        test('should return 400 when title is missing', async () => {
            const newCase = {
                description: 'Test Description'
            };

            const response = await request(app)
                .post('/cases')
                .send(newCase)
                .expect(400);

            expect(response.body.error).toBe('Title and description are required');
            expect(cases).toHaveLength(0);
        });

        test('should return 400 when description is missing', async () => {
            const newCase = {
                title: 'Test Case'
            };

            const response = await request(app)
                .post('/cases')
                .send(newCase)
                .expect(400);

            expect(response.body.error).toBe('Title and description are required');
            expect(cases).toHaveLength(0);
        });
    });

    describe('GET /cases', () => {
        test('should return empty array when no cases exist', async () => {
            const response = await request(app)
                .get('/cases')
                .expect(200);

            expect(response.body).toEqual([]);
        });

        test('should return array of all cases', async () => {
            const testCases = [
                {
                    id: 'test-id-1',
                    title: 'Case 1',
                    description: 'Description 1',
                    status: 'open',
                    priority: 'high',
                    assignedTo: 'judge.1@hmcts.gov.uk',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                },
                {
                    id: 'test-id-2',
                    title: 'Case 2',
                    description: 'Description 2',
                    status: 'closed',
                    priority: 'medium',
                    assignedTo: 'judge.2@hmcts.gov.uk',
                    createdAt: '2024-01-02T00:00:00.000Z',
                    updatedAt: '2024-01-02T00:00:00.000Z'
                }
            ];

            cases.push(...testCases);

            const response = await request(app)
                .get('/cases')
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body).toEqual(expect.arrayContaining(testCases));
        });
    });

    describe('GET /cases/:id', () => {
        test('should return a single case by id', async () => {
            const testCase = {
                id: 'test-id-123',
                title: 'Test Case',
                description: 'Test Description',
                status: 'open',
                priority: 'medium',
                assignedTo: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            };

            cases.push(testCase);

            const response = await request(app)
                .get('/cases/test-id-123')
                .expect(200);

            expect(response.body).toEqual(testCase);
        });

        test('should return 404 when case id does not exist', async () => {
            const response = await request(app)
                .get('/cases/non-existent-id')
                .expect(404);

            expect(response.body.error).toBe('Case not found');
        });
    });

    describe('PUT /cases/:id', () => {
        test('should update an existing case', async () => {
            const originalCase = {
                id: 'test-id-123',
                title: 'Original Title',
                description: 'Original Description',
                status: 'open',
                priority: 'medium',
                assignedTo: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            };

            cases.push(originalCase);

            const updateData = {
                title: 'Updated Title',
                status: 'closed',
                priority: 'high',
                assignedTo: 'judge.updated@hmcts.gov.uk'
            };

            const response = await request(app)
                .put('/cases/test-id-123')
                .send(updateData)
                .expect(200);

            expect(response.body.title).toBe(updateData.title);
            expect(response.body.status).toBe(updateData.status);
            expect(response.body.priority).toBe(updateData.priority);
            expect(response.body.assignedTo).toBe(updateData.assignedTo);
            expect(response.body.description).toBe(originalCase.description);
            expect(response.body.createdAt).toBe(originalCase.createdAt);
            expect(response.body.updatedAt).not.toBe(originalCase.updatedAt);
        });

        test('should return 404 when updating non-existent case', async () => {
            const updateData = {
                title: 'Updated Title'
            };

            const response = await request(app)
                .put('/cases/non-existent-id')
                .send(updateData)
                .expect(404);

            expect(response.body.error).toBe('Case not found');
        });

        test('should update only provided fields', async () => {
            const originalCase = {
                id: 'test-id-123',
                title: 'Original Title',
                description: 'Original Description',
                status: 'open',
                priority: 'medium',
                assignedTo: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            };

            cases.push(originalCase);

            const updateData = {
                status: 'in-progress'
            };

            const response = await request(app)
                .put('/cases/test-id-123')
                .send(updateData)
                .expect(200);

            expect(response.body.status).toBe(updateData.status);
            expect(response.body.title).toBe(originalCase.title);
            expect(response.body.description).toBe(originalCase.description);
            expect(response.body.priority).toBe(originalCase.priority);
            expect(response.body.assignedTo).toBe(originalCase.assignedTo);
        });
    });

    describe('DELETE /cases/:id', () => {
        test('should delete an existing case', async () => {
            const testCase = {
                id: 'test-id-123',
                title: 'Test Case',
                description: 'Test Description',
                status: 'open',
                priority: 'medium',
                assignedTo: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            };

            cases.push(testCase);

            await request(app)
                .delete('/cases/test-id-123')
                .expect(204);

            expect(cases).toHaveLength(0);
        });

        test('should return 404 when deleting non-existent case', async () => {
            const response = await request(app)
                .delete('/cases/non-existent-id')
                .expect(404);

            expect(response.body.error).toBe('Case not found');
        });

        test('should maintain other cases when deleting one', async () => {
            const case1 = {
                id: 'test-id-1',
                title: 'Case 1',
                description: 'Description 1',
                status: 'open',
                priority: 'medium',
                assignedTo: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            };

            const case2 = {
                id: 'test-id-2',
                title: 'Case 2',
                description: 'Description 2',
                status: 'open',
                priority: 'medium',
                assignedTo: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            };

            cases.push(case1, case2);

            await request(app)
                .delete('/cases/test-id-1')
                .expect(204);

            expect(cases).toHaveLength(1);
            expect(cases[0].id).toBe('test-id-2');
        });
    });

    describe('GET /health', () => {
        test('should return health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('timestamp');
            expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
        });
    });
}); 