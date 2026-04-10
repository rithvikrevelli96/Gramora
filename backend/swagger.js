import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gramora API',
            version: '1.0.0',
            description: 'AI-powered Instagram content generation backend API',
            contact: {
                name: 'Gramora Team',
            },
        },
        servers: [
            {
                url: 'http://localhost:5002',
                description: 'Development server',
            },
            {
                url: 'https://gramora-backend.onrender.com',
                description: 'Production server (Render)',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'User username',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'User password (hashed on server)',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                ContentRequest: {
                    type: 'object',
                    required: ['idea', 'segment'],
                    properties: {
                        idea: {
                            type: 'string',
                            description: 'Content idea or topic',
                        },
                        segment: {
                            type: 'string',
                            description: 'Content segment/category',
                        },
                    },
                },
                ContentResponse: {
                    type: 'object',
                    properties: {
                        captions: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'Generated captions',
                        },
                        hashtags: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'Generated hashtags',
                        },
                    },
                },
            },
        },
    },
    apis: ['./index.js', './routes/instagramRoutes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
