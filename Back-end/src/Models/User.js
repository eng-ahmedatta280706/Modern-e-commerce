import { db } from '../configs/db.js';
import { Users, Addresses, Wishlist } from './schema.js';
import { eq, and } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';

// User Queries
export async function findUserOne(query) {
    const [result] = await db.select().from(Users).where(eq(Users.email, query.email || ''));
    return result || null;
}

export async function findUser(query = {}) {
    if (query.username) {
        return await db.select().from(Users).where(eq(Users.name, query.username));
    }
    if (query.email) {
        return await db.select().from(Users).where(eq(Users.email, query.email));
    }
    if (query.role) {
        return await db.select().from(Users).where(eq(Users.role, query.role));
    }
    return await db.select().from(Users);
}

export async function findUserById(id) {
    const [result] = await db.select().from(Users).where(eq(Users.id, id));
    return result || null;
}

export async function createUser(data) {
    const hashedPassword = await hash(data.password, 12);
    const [result] = await db.insert(Users).values({
        ...data,
        password: hashedPassword,
    }).returning();
    return result;
}

export async function findUserByIdAndUpdate(id, update) {
    if (update.password) {
        update.password = await hash(update.password, 12);
    } else if (update.email) {
        const existingUser = await findUserOne({ email: update.email });
        if (existingUser && existingUser.id !== id) {
            throw new Error('Email already in use');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(update.email)) {
            throw new Error('Invalid email format');
        }
    } else if (update.name) {
        const existingUser = await db.select().from(Users).where(eq(Users.name, update.name)).then(res => res[0]);
        if (existingUser && existingUser.id !== id) {
            throw new Error('Username already in use');
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(update.name)) {
            throw new Error('Username can only contain letters, numbers, and underscores');
        }
    } else if (update.role) {
        const validRoles = ['customer', 'seller', 'admin'];
        if (!validRoles.includes(update.role)) {
            throw new Error('Invalid role');
        }
        const user = await findUserById(id);
        if (user.role === 'admin' && update.role !== 'admin') {
            throw new Error('Cannot change role of an admin user');
        }
    } else if (update.sellerStatus) {
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(update.sellerStatus)) {
            throw new Error('Invalid seller status');
        }
    }
    update.updatedAt = new Date();
    const [result] = await db.update(Users).set(update).where(eq(Users.id, id)).returning();
    return result;
}

export async function countUsers() {
    const result = await db.select().from(Users);
    return result.length;
}

export async function getUserAddresses(userId) {
    return await db.select().from(Addresses).where(eq(Addresses.userId, userId));
}

export async function addUserAddress(userId, addressData) {
    const [result] = await db.insert(Addresses).values({
        userId,
        ...addressData,
    }).returning();
    return result;
}

export async function getUserWishlist(userId) {
    return await db.select().from(Wishlist).where(eq(Wishlist.userId, userId));
}

export async function addToWishlist(userId, productId) {
    const [result] = await db.insert(Wishlist).values({
        userId,
        productId,
    }).returning().catch(() => null);
    return result;
}

export async function removeFromWishlist(userId, productId) {
    return await db.delete(Wishlist).where(
        and(eq(Wishlist.userId, userId), eq(Wishlist.productId, productId))
    );
}

// User helper methods
export async function isAdmin(userId) {
    const user = await findUserById(userId);
    return user?.role === 'admin';
}

export async function isSeller(userId) {
    const user = await findUserById(userId);
    return user?.role === 'seller';
}

export async function isApprovedSeller(userId) {
    const user = await findUserById(userId);
    return user?.role === 'seller' && user?.sellerStatus === 'approved';
}

export async function comparePassword(userId, candidatePassword) {
    const user = await findUserById(userId);
    if (!user) return false;
    return compare(candidatePassword, user.password);
}

export async function toJSON(user) {
    const obj = { ...user };
    delete obj.password;
    delete obj.refreshToken;
    delete obj.passwordResetToken;
    delete obj.passwordResetExpires;
    return obj;
}
