import { db } from '../configs/db.js';
import { Notifications } from './schema.js';
import { eq, and, desc } from 'drizzle-orm';

// Notification Types
export const NOTIFICATION_TYPES = [
  'new_order',
  'order_status',
  'new_seller',
  'seller_approved',
  'seller_rejected',
  'low_stock',
  'new_review',
  'payment_received',
  'refund_request',
  'system',
];

// Create Notification
export async function createNotification(
  recipientId,
  type,
  title,
  message,
  link = '',
  data = {}
) {
  const [result] = await db.insert(Notifications).values({
    recipientId,
    type,
    title,
    message,
    link,
    data,
  }).returning();
  return result;
}

// Notification Queries
export async function findNotificationById(id) {
  const [result] = await db.select().from(Notifications).where(eq(Notifications.id, id));
  return result || null;
}

export async function getUserNotifications(recipientId, limit = 50) {
  return await db.select().from(Notifications)
    .where(eq(Notifications.recipientId, recipientId))
    .orderBy(desc(Notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotifications(recipientId) {
  return await db.select().from(Notifications).where(
    and(
      eq(Notifications.recipientId, recipientId),
      eq(Notifications.isRead, false)
    )
  ).orderBy(desc(Notifications.createdAt));
}

export async function getUnreadCount(recipientId) {
  const unread = await getUnreadNotifications(recipientId);
  return unread.length;
}

// Mark as Read
export async function markNotificationAsRead(id) {
  const [result] = await db.update(Notifications).set({
    isRead: true,
    updatedAt: new Date(),
  }).where(eq(Notifications.id, id)).returning();
  return result;
}

export async function markAllAsRead(recipientId) {
  return await db.update(Notifications).set({
    isRead: true,
    updatedAt: new Date(),
  }).where(
    and(
      eq(Notifications.recipientId, recipientId),
      eq(Notifications.isRead, false)
    )
  );
}

// Delete Notification
export async function deleteNotification(id) {
  return await db.delete(Notifications).where(eq(Notifications.id, id));
}

export async function deleteUserNotifications(recipientId) {
  return await db.delete(Notifications).where(eq(Notifications.recipientId, recipientId));
}

// Get notifications by type
export async function getNotificationsByType(recipientId, type) {
  return await db.select().from(Notifications).where(
    and(
      eq(Notifications.recipientId, recipientId),
      eq(Notifications.type, type)
    )
  ).orderBy(desc(Notifications.createdAt));
}
