
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBPN115DDQYW8Sf6Cf5utDrvmO1yz7NcxA",
  authDomain: "dashboard-4439b.firebaseapp.com",
  projectId: "dashboard-4439b",
  storageBucket: "dashboard-4439b.firebasestorage.app",
  messagingSenderId: "290756589614",
  appId: "1:290756589614:web:96bd07f19949366a8907bf"
});

const messaging = firebase.messaging();