import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const myFunction = functions.firestore
  .document('chat/{messageId}')
  .onCreate(async (snapshot, context) => {
    // Return this function's promise to ensure the firebase function
    // will keep running until the notification is scheduled.
    const messaging = admin.messaging();

    const username = snapshot.data()?.username;
    const text = snapshot.data()?.text;

    if (username && text) {
      const notification: admin.messaging.NotificationMessagePayload = {
        title: username,
        body: text,
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      };

      await messaging.sendToTopic('chat', {
        notification,
      });
    }

    return null;
  });
