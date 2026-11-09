import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.railverse.signallingworks',
  appName: 'RVS ERP',
  webDir: 'www',
  android: { allowMixedContent: false },
  server: { androidScheme: 'https' }
};
export default config;
