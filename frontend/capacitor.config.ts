import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alexdavis.taskmanager',
  appName: 'Task Manager',
  webDir: 'dist/frontend/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;