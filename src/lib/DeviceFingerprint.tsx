interface FingerprintData {
    userAgent: string;
    language: string;
    languages: string;
    platform: string;
    screenResolution: string;
    colorDepth: number;
    pixelRatio: number;
    timezone: string;
    timezoneOffset: number;
    cookiesEnabled: boolean;
    doNotTrack: string;
    onlineStatus: boolean;
    hardwareConcurrency: number;
    maxTouchPoints: number;
    canvas: string;
    fonts: string;
    deviceMemory?: number;
    connection?: {
        downlink?: number;
        effectiveType?: string;
        rtt?: number;
        saveData?: boolean;
    };
    webglVendor?: string;
    webglRenderer?: string;
    webglSupported?: boolean;
    audioFingerprint?: string;
}

interface DeviceRecord {
    id: number;
    deviceId: string;
    timestamp: number;
}

class DeviceFingerprint {
    private readonly storageKey: string = 'device_id_food';
    private readonly dbName: string = 'FoodRank';

    constructor() { }

    /**
     * main - get or generate id
     */
    public async getDeviceId(): Promise<string> {
        try {
            let deviceId = this.getFromStorage();
            if (deviceId) {
                await this.saveToIndexedDB(deviceId);
                return deviceId;
            }

            deviceId = await this.getFromIndexedDB();
            if (deviceId) {
                this.saveToStorage(deviceId);
                return deviceId;
            }

            deviceId = await this.generateUniqueId();

            this.saveToStorage(deviceId);
            await this.saveToIndexedDB(deviceId);

            return deviceId;
        } catch (error) {
            console.warn('Error getting device ID:', error);
            return this.getFallbackId();
        }
    }

    /**
     * Get fingerprint data
     */
    private getFingerprint(): FingerprintData {
        const navAny = navigator as any;
        const connection = navAny?.connection || navAny?.mozConnection || navAny?.webkitConnection;

        return {
            userAgent: navigator.userAgent || '',
            language: navigator.language || '',
            languages: navigator.languages ? navigator.languages.join(',') : '',
            platform: navigator.platform || '',
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth || 0,
            pixelRatio: window.devicePixelRatio || 1,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
            timezoneOffset: new Date().getTimezoneOffset(),
            cookiesEnabled: navigator.cookieEnabled || false,
            doNotTrack: navigator.doNotTrack || '',
            onlineStatus: navigator.onLine || false,
            hardwareConcurrency: navigator.hardwareConcurrency || 0,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            canvas: this.getCanvasFingerprint(),
            fonts: this.detectFonts(),
            deviceMemory: (navigator as any).deviceMemory || undefined,
            connection: connection
                ? {
                    downlink: connection.downlink,
                    effectiveType: connection.effectiveType,
                    rtt: connection.rtt,
                    saveData: connection.saveData,
                }
                : undefined,
        };
    }

    /**
     * generate fingerprint device
     */
    private async generateFingerprint(): Promise<string> {
        const fingerprint: FingerprintData = this.getFingerprint();

        return this.hashObject(fingerprint);
    }

    /**
     * Canvas fingerprinting
     */
    private getCanvasFingerprint(): string {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) return 'canvas_context_unavailable';

            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('🌟 Device ID 🔒', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('Unique fingerprint', 4, 45);

            return canvas.toDataURL();
        } catch {
            return 'canvas_unavailable';
        }
    }

    /**
     * WebGL GPU vendor/renderer
     */
    private getWebGLInfo(): { vendor: string; renderer: string; supported: boolean } {
        try {
            const canvas = document.createElement('canvas');
            const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
            if (!gl) return { vendor: 'webgl_unavailable', renderer: 'webgl_unavailable', supported: false };

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info') as any;
            const vendor = debugInfo && gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            const renderer = debugInfo && gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

            return {
                vendor: vendor || 'unknown_vendor',
                renderer: renderer || 'unknown_renderer',
                supported: true,
            };
        } catch {
            return { vendor: 'error', renderer: 'error', supported: false };
        }
    }

    /**
     * AudioContext fingerprint via OfflineAudioContext hash
     */
    private async getAudioFingerprint(): Promise<string> {
        try {
            // Prefer OfflineAudioContext to avoid actual audio output
            const OfflineCtx = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
            if (!OfflineCtx) return 'offline_audio_unavailable';

            const sampleRate = 44100;
            const length = 44100;
            const context = new OfflineCtx(1, length, sampleRate);

            const oscillator = context.createOscillator();
            oscillator.type = 'triangle';
            oscillator.frequency.value = 10000;

            const compressor = context.createDynamicsCompressor();
            compressor.threshold.value = -50;
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            compressor.attack.value = 0;
            compressor.release.value = 0.25;

            oscillator.connect(compressor);
            compressor.connect(context.destination);

            oscillator.start(0);

            const buffer = await context.startRendering();
            const channel = buffer.getChannelData(0);

            // Simple hash
            let hash = 0;
            for (let i = 0; i < channel.length; i += 1000) {
                hash = ((hash << 5) - hash) + Math.floor((channel[i] + 1) * 1000);
                hash |= 0;
            }
            return 'af_' + Math.abs(hash).toString(36);
        } catch {
            return 'audio_fp_error';
        }
    }

    /**
     * get fonts available
     */
    private detectFonts(): string {
        const baseFonts: string[] = ['Arial', 'Helvetica', 'Times', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'];
        const testFonts: string[] = ['Calibri', 'Candara', 'Consolas', 'Constantia', 'Corbel', 'Cambria', 'Franklin Gothic Medium', 'Lucida Console', 'Lucida Sans Unicode', 'Microsoft Sans Serif', 'MS Gothic', 'MS PGothic', 'MS Sans Serif', 'MS Serif', 'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Light', 'Segoe UI Semibold', 'Tahoma', 'Times New Roman', 'Wingdings'];

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) return 'canvas_context_unavailable';

        const text = 'mmmmmmmmmmlli';
        const baselineSize = '72px';

        const defaultWidth: Record<string, number> = {};
        const defaultHeight: Record<string, number> = {};

        for (const font of baseFonts) {
            context.font = baselineSize + ' ' + font;
            const metrics = context.measureText(text);
            defaultWidth[font] = metrics.width;
            defaultHeight[font] = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);
        }

        const availableFonts: string[] = [];

        for (const font of testFonts) {
            let detected = false;
            for (const baseFont of baseFonts) {
                context.font = baselineSize + ' ' + font + ',' + baseFont;
                const metrics = context.measureText(text);
                const width = metrics.width;
                const height = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);

                if (width !== defaultWidth[baseFont] || height !== defaultHeight[baseFont]) {
                    detected = true;
                    break;
                }
            }
            if (detected) {
                availableFonts.push(font);
            }
        }

        return availableFonts.sort().join(',');
    }

    /**
     * generate unique id
     */
    private async generateUniqueId(): Promise<string> {
        const fingerprint = await this.generateFingerprint();
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 16);
        const performance = window.performance ? window.performance.now() : 0;

        const combined = `${fingerprint}_${timestamp}_${random}_${performance}`;
        return this.hashString(combined);
    }

    /**
     * Hash object to string
     */
    private hashObject(obj: any): string {
        return this.hashString(JSON.stringify(obj));
    }

    /**
     * Generate Hash string
     */
    private hashString(str: string): string {
        let hash = 0;
        if (str.length === 0) return hash.toString();

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32-bit integer
        }

        return Math.abs(hash).toString(36);
    }

    /**
     * get from localStorage
     */
    private getFromStorage(): string | null {
        return localStorage.getItem(this.storageKey);
    }

    /**
     * Save in localStorage
     */
    private saveToStorage(deviceId: string): void {
        localStorage.setItem(this.storageKey, deviceId);
    }

    /**
     * Get from IndexedDB
     */
    private getFromIndexedDB(): Promise<string | null> {
        return new Promise<string | null>((resolve) => {
            try {
                const request = indexedDB.open(this.dbName);

                request.onerror = () => resolve(null);

                request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                    const db = (event.target as IDBOpenDBRequest).result;
                    if (!db.objectStoreNames.contains('devices')) {
                        db.createObjectStore('devices', { keyPath: 'id' });
                    }
                };

                request.onsuccess = (event: Event) => {
                    const db = (event.target as IDBOpenDBRequest).result;
                    const transaction = db.transaction(['devices'], 'readonly');
                    const store = transaction.objectStore('devices');
                    const getRequest = store.get(1);

                    getRequest.onsuccess = () => {
                        const result: DeviceRecord | undefined = getRequest.result;
                        resolve(result ? result.deviceId : null);
                    };

                    getRequest.onerror = () => resolve(null);
                };
            } catch {
                resolve(null);
            }
        });
    }

    /**
     * Save in IndexedDB
     */
    private saveToIndexedDB(deviceId: string): Promise<void> {
        return new Promise<void>((resolve) => {
            try {
                const request = indexedDB.open(this.dbName);

                request.onerror = () => resolve();

                request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                    const db = (event.target as IDBOpenDBRequest).result;
                    if (!db.objectStoreNames.contains('devices')) {
                        db.createObjectStore('devices', { keyPath: 'id' });
                    }
                };

                request.onsuccess = (event: Event) => {
                    const db = (event.target as IDBOpenDBRequest).result;
                    const transaction = db.transaction(['devices'], 'readwrite');
                    const store = transaction.objectStore('devices');
                    const record: DeviceRecord = {
                        id: 1,
                        deviceId: deviceId,
                        timestamp: Date.now()
                    };
                    store.put(record);
                    resolve();
                };
            } catch {
                resolve();
            }
        });
    }

    /**
     * ID de fallback get only fingerprint
     */
    private getFallbackId(): string {
        try {
            const simpleFingerprint = {
                userAgent: navigator.userAgent || '',
                language: navigator.language || '',
                platform: navigator.platform || '',
                screenResolution: `${screen.width}x${screen.height}`,
                timezone: new Date().getTimezoneOffset()
            };

            return this.hashObject(simpleFingerprint);
        } catch {
            return 'fallback_' + Date.now().toString(36);
        }
    }

    /**
     * verify valid id
     */
    public isValidId(deviceId: string | null): deviceId is string {
        return deviceId !== null && typeof deviceId === 'string' && deviceId.length > 5;
    }

    /**
     * clear ids storage
     */
    public async clearStoredIds(): Promise<void> {
        try {
            localStorage.removeItem(this.storageKey);

            const request = indexedDB.open(this.dbName);
            request.onsuccess = (event: Event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = db.transaction(['devices'], 'readwrite');
                const store = transaction.objectStore('devices');
                store.clear();
            };
        } catch {
            // Ignorar errores
        }
    }

    /**
     * Get detail finger print
     */
    public async getDetailedFingerprint(): Promise<FingerprintData> {
        const base = this.getFingerprint();
        const webgl = this.getWebGLInfo();
        const audioFingerprint = await this.getAudioFingerprint();
        return {
            ...base,
            webglVendor: webgl.vendor,
            webglRenderer: webgl.renderer,
            webglSupported: webgl.supported,
            audioFingerprint,
        };
    }

    /**
     * Get public IP address
     */
    public async getPublicIp(): Promise<string | null> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const data = await res.json();
                    return data?.ip ?? null;
                }
            } catch {}

            // Fallback provider
            const res2 = await fetch('https://ipapi.co/json/');
            if (res2.ok) {
                const data2 = await res2.json();
                return data2?.ip ?? null;
            }
        } catch {
            return null;
        }
        return null;
    }
}

export const deviceFingerprint = new DeviceFingerprint();

export async function getUniqueDeviceId(): Promise<string> {
    return await deviceFingerprint.getDeviceId();
}

export async function getPublicIp(): Promise<string | null> {
    return await deviceFingerprint.getPublicIp();
}

export type { FingerprintData, DeviceRecord };
