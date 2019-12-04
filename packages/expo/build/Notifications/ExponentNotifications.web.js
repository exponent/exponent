import badgin from 'badgin';
import UUID from 'uuid-js';
let currentBadgeNumber = 0;
import { guardPermission, getExponentPushTokenAsync, getDevicePushTokenAsync, } from './ExponentNotificationsHelper.web';
// Register `message`'s event listener (side-effect)
import './ExponentNotifications.fx.web';
function transformLocalNotification(notification, tag) {
    const { web = {}, ...abstractNotification } = notification;
    tag = web.tag || tag;
    const nativeNotification = {
        ...abstractNotification,
        tag,
        ...web,
        // Show that this notification is a local notification
        _isLocal: true,
    };
    return [nativeNotification.title, nativeNotification];
}
function generateID() {
    return UUID.create().toString();
}
async function getRegistrationAsync() {
    guardPermission();
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
        throw new Error('Failed to get notification registration!');
    }
    return registration;
}
async function getNotificationsAsync(tag) {
    const registration = await getRegistrationAsync();
    const notifications = await registration.getNotifications(tag ? { tag } : undefined);
    return notifications;
}
export default {
    async presentLocalNotification(notification) {
        const registration = await getRegistrationAsync();
        const tag = generateID();
        registration.showNotification(...transformLocalNotification(notification, tag));
        return tag;
    },
    async scheduleLocalNotification(notification, options = {}) {
        if (options.intervalMs) {
            const registration = await getRegistrationAsync();
            const tag = generateID();
            setTimeout(() => {
                registration.showNotification(...transformLocalNotification(notification, tag));
            }, options.intervalMs);
            return tag;
        }
        else if (options.time) {
            const intervalMs = options.time - Date.now();
            if (intervalMs < 0) {
                throw new Error('Expo.Notifications.scheduleLocalNotification(): options.time must be some time in the future.');
            }
            return this.scheduleLocalNotification(notification, {
                intervalMs,
            });
        }
        throw new Error(`Expo.Notifications.scheduleLocalNotification() options ${JSON.stringify(options, null, 2)} are not supported yet.`);
    },
    async dismissNotification(notificationId) {
        const notifications = await getNotificationsAsync(notificationId);
        for (const notification of notifications) {
            notification.close();
        }
    },
    async dismissAllNotifications() {
        this.dismissNotification();
    },
    async cancelScheduledNotificationAsync(notificationId) {
        this.dismissNotification(notificationId);
    },
    async cancelAllScheduledNotificationsAsync() {
        this.dismissNotification();
    },
    async getExponentPushTokenAsync() {
        return await getExponentPushTokenAsync();
    },
    async getDevicePushTokenAsync() {
        return await getDevicePushTokenAsync();
    },
    async getBadgeNumberAsync() {
        return currentBadgeNumber;
    },
    async setBadgeNumberAsync(badgeNumber) {
        currentBadgeNumber = badgeNumber;
        badgin.set(badgeNumber);
    },
};
//# sourceMappingURL=ExponentNotifications.web.js.map