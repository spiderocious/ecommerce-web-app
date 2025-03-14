import { Injectable } from '@angular/core';

type StorageType = 'local' | 'session' | 'indexedDB';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private defaultStorage: StorageType = 'local';
  private dbName = 'ecommerceDB';
  private dbVersion = 1;

  async set(key: string, value: any, storage: StorageType = this.defaultStorage): Promise<void> {
    const serializedValue = JSON.stringify(value);
    
    switch (storage) {
      case 'local':
        localStorage.setItem(key, serializedValue);
        break;
      case 'session':
        sessionStorage.setItem(key, serializedValue);
        break;
      case 'indexedDB':
        await this.setIndexedDB(key, value);
        break;
    }
  }

  async get<T>(key: string, storage: StorageType = this.defaultStorage): Promise<T | null> {
    switch (storage) {
      case 'local':
        const localValue = localStorage.getItem(key);
        return localValue ? JSON.parse(localValue) : null;
      case 'session':
        const sessionValue = sessionStorage.getItem(key);
        return sessionValue ? JSON.parse(sessionValue) : null;
      case 'indexedDB':
        return this.getIndexedDB<T>(key);
      default:
        return null;
    }
  }

  async remove(key: string, storage: StorageType = this.defaultStorage): Promise<void> {
    switch (storage) {
      case 'local':
        localStorage.removeItem(key);
        break;
      case 'session':
        sessionStorage.removeItem(key);
        break;
      case 'indexedDB':
        await this.removeIndexedDB(key);
        break;
    }
  }

  private async getIndexedDB<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('keyValueStore', 'readonly');
        const store = transaction.objectStore('keyValueStore');
        const getRequest = store.get(key);

        getRequest.onerror = () => reject(getRequest.error);
        getRequest.onsuccess = () => resolve(getRequest.result || null);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('keyValueStore', { keyPath: 'key' });
      };
    });
  }

  private async setIndexedDB(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('keyValueStore', 'readwrite');
        const store = transaction.objectStore('keyValueStore');
        const putRequest = store.put({ key, value });

        putRequest.onerror = () => reject(putRequest.error);
        putRequest.onsuccess = () => resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('keyValueStore', { keyPath: 'key' });
      };
    });
  }

  private async removeIndexedDB(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('keyValueStore', 'readwrite');
        const store = transaction.objectStore('keyValueStore');
        const deleteRequest = store.delete(key);

        deleteRequest.onerror = () => reject(deleteRequest.error);
        deleteRequest.onsuccess = () => resolve();
      };
    });
  }
}