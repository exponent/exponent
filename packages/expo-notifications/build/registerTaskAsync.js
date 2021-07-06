import { UnavailabilityError } from '@unimodules/core';
import BackgroundNotificationTasksModule from './BackgroundNotificationTasksModule.native';
export default async function registerTaskAsync(taskName) {
    if (!BackgroundNotificationTasksModule.registerTaskAsync) {
        throw new UnavailabilityError('Notifications', 'registerTaskAsync');
    }
    return await BackgroundNotificationTasksModule.registerTaskAsync(taskName);
}
//# sourceMappingURL=registerTaskAsync.js.map