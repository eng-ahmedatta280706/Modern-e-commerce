import 'dotenv/config';

export default {
    schema: './Models/schema.js',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: 'database url',
    },
};