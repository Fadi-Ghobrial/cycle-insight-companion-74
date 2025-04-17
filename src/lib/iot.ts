
import { IoTReminder } from '@/types';

// Interface for IoT device types
export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  isConnected: boolean;
  lastConnected?: Date;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  sendMessage: (message: string) => Promise<boolean>;
}

/**
 * Smart mirror device integration
 */
export class SmartMirrorDevice implements IoTDevice {
  id: string;
  name: string;
  type: string = 'smart_mirror';
  isConnected: boolean = false;
  lastConnected?: Date;
  
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
  
  async connect(): Promise<boolean> {
    // Simulation of connecting to the device
    this.isConnected = true;
    this.lastConnected = new Date();
    return true;
  }
  
  async disconnect(): Promise<boolean> {
    this.isConnected = false;
    return true;
  }
  
  async sendMessage(message: string): Promise<boolean> {
    if (!this.isConnected) {
      console.error('Device not connected');
      return false;
    }
    
    console.log(`[SmartMirror] Displaying message: ${message}`);
    return true;
  }
}

/**
 * Smart lighting integration
 */
export class SmartLightingDevice implements IoTDevice {
  id: string;
  name: string;
  type: string = 'smart_lighting';
  isConnected: boolean = false;
  lastConnected?: Date;
  
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
  
  async connect(): Promise<boolean> {
    // Simulation of connecting to the device
    this.isConnected = true;
    this.lastConnected = new Date();
    return true;
  }
  
  async disconnect(): Promise<boolean> {
    this.isConnected = false;
    return true;
  }
  
  async sendMessage(message: string): Promise<boolean> {
    if (!this.isConnected) {
      console.error('Device not connected');
      return false;
    }
    
    console.log(`[SmartLighting] Setting lights: ${message}`);
    return true;
  }
  
  async setColor(color: string): Promise<boolean> {
    if (!this.isConnected) {
      console.error('Device not connected');
      return false;
    }
    
    console.log(`[SmartLighting] Setting color to: ${color}`);
    return true;
  }
}

/**
 * Smart bathroom scale integration
 */
export class SmartScaleDevice implements IoTDevice {
  id: string;
  name: string;
  type: string = 'smart_scale';
  isConnected: boolean = false;
  lastConnected?: Date;
  
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
  
  async connect(): Promise<boolean> {
    // Simulation of connecting to the device
    this.isConnected = true;
    this.lastConnected = new Date();
    return true;
  }
  
  async disconnect(): Promise<boolean> {
    this.isConnected = false;
    return true;
  }
  
  async sendMessage(message: string): Promise<boolean> {
    if (!this.isConnected) {
      console.error('Device not connected');
      return false;
    }
    
    console.log(`[SmartScale] Message: ${message}`);
    return true;
  }
  
  async getWeight(): Promise<number | null> {
    if (!this.isConnected) {
      console.error('Device not connected');
      return null;
    }
    
    // Simulate getting weight data
    return 65.5; // kg
  }
}

/**
 * IoT service for managing devices and reminders
 */
export class IoTService {
  private devices: Map<string, IoTDevice> = new Map();
  
  constructor() {}
  
  /**
   * Add a device to the service
   */
  addDevice(device: IoTDevice): void {
    this.devices.set(device.id, device);
  }
  
  /**
   * Remove a device
   */
  removeDevice(deviceId: string): boolean {
    return this.devices.delete(deviceId);
  }
  
  /**
   * Get a device by ID
   */
  getDevice(deviceId: string): IoTDevice | undefined {
    return this.devices.get(deviceId);
  }
  
  /**
   * Get all devices
   */
  getAllDevices(): IoTDevice[] {
    return Array.from(this.devices.values());
  }
  
  /**
   * Connect to all devices
   */
  async connectAll(): Promise<boolean[]> {
    const results: boolean[] = [];
    
    for (const device of this.devices.values()) {
      results.push(await device.connect());
    }
    
    return results;
  }
  
  /**
   * Send a reminder to appropriate devices
   */
  async sendReminder(reminder: IoTReminder): Promise<boolean> {
    let success = false;
    
    // Determine which devices should receive this reminder
    switch (reminder.type) {
      case 'smart_mirror':
        const mirror = this.findDeviceByType('smart_mirror');
        if (mirror) {
          success = await mirror.sendMessage(reminder.message);
        }
        break;
        
      case 'smart_light':
        const light = this.findDeviceByType('smart_lighting');
        if (light) {
          success = await light.sendMessage(reminder.message);
          
          // If it's a SmartLightingDevice, we can also set a color based on cycle phase
          if (light instanceof SmartLightingDevice) {
            if (reminder.message.includes('period')) {
              await light.setColor('#D946EF'); // Menstrual phase color
            } else if (reminder.message.includes('fertile')) {
              await light.setColor('#FEF7CD'); // Ovulation phase color
            }
          }
        }
        break;
        
      default:
        // For generic reminders, send to all connected devices
        let anySuccess = false;
        
        for (const device of this.devices.values()) {
          if (device.isConnected) {
            const result = await device.sendMessage(reminder.message);
            anySuccess = anySuccess || result;
          }
        }
        
        success = anySuccess;
        break;
    }
    
    return success;
  }
  
  /**
   * Find a device by type
   */
  private findDeviceByType(type: string): IoTDevice | undefined {
    for (const device of this.devices.values()) {
      if (device.type === type && device.isConnected) {
        return device;
      }
    }
    
    return undefined;
  }
}

/**
 * Create and initialize the IoT service
 */
export function createIoTService(): IoTService {
  const service = new IoTService();
  
  // Add some sample devices
  service.addDevice(new SmartMirrorDevice('mirror-1', 'Bathroom Mirror'));
  service.addDevice(new SmartLightingDevice('light-1', 'Bedroom Light'));
  service.addDevice(new SmartScaleDevice('scale-1', 'Bathroom Scale'));
  
  return service;
}
