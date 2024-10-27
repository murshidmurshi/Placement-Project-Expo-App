import React, { useEffect, useState } from 'react';
import { View, Button, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token = '';
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Push notification permissions not granted');
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } catch (error) {
      console.error('Error getting push token:', error);
      Alert.alert('Error', 'Failed to get push token for push notification!');
    }
    return token;
  };

  const sendPushNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hello!",
          body: "This is a push notification sent from your app!",
        },
        trigger: { seconds: 1 }, // Send immediately
      });
      console.log('Push notification sent successfully!');
    } catch (error) {
      console.error('Error sending push notification:', error);
      Alert.alert('Error', 'Failed to send push notification!');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Send Push Notification" onPress={sendPushNotification} />
    </View>
  );
}
