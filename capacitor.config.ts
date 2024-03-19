import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'test-env-app-client-angular',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
