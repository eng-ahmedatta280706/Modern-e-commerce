import 'dotenv/config';

export default {
    schema: './Models/schema.js',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://postgres:Ahmed1234@localhost:5432/StoreDB',
    },
};