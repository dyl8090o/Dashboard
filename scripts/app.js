
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPN115DDQYW8Sf6Cf5utDrvmO1yz7NcxA",
  authDomain: "dashboard-4439b.firebaseapp.com",
  projectId: "dashboard-4439b",
  storageBucket: "dashboard-4439b.firebasestorage.app",
  messagingSenderId: "290756589614",
  appId: "1:290756589614:web:96bd07f19949366a8907bf"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function setupNotifications() {
  try {
    const permission = await Notification.requestPermission();
    alert('Permission: ' + permission); // TEMP debug

    if (permission !== 'granted') {
      return;
    }

    const registration = await navigator.serviceWorker.register('firebase-messaging-sw.js');
    alert('Service worker registered'); // TEMP debug

    const token = await getToken(messaging, {
      vapidKey: 'BGwolCCPb1_zLu4HEV1mRHKzBUei-L7IquG__hxzZiLNhithe80_7VqJMqayTV7ruBxSLhgd9AFrl7X_ZSHT-Vs',
      serviceWorkerRegistration: registration
    });

    alert('Token: ' + token);
  } catch (err) {
    alert('ERROR: ' + err.message); // TEMP debug — this is the important one
  }
}

document.getElementById('enableNotifsButton').addEventListener('click', setupNotifications);
// setupNotifications();