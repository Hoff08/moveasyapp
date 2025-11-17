import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moveasy.app',
  appName: 'Moveasy',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

