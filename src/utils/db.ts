interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  category: string;
}

const DB_NAME = 'codeManagerDB';
const STORE_NAME = 'codeSnippets';
const DB_VERSION = 1;

class DB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('title', 'title', { unique: false });
          
          // 如果有 chrome.storage 中的数据，迁移到 IndexedDB
          chrome.storage.sync.get(['snippets'], (result) => {
            if (result.snippets) {
              const transaction = db.transaction(STORE_NAME, 'readwrite');
              const objectStore = transaction.objectStore(STORE_NAME);
              
              result.snippets.forEach((snippet: CodeSnippet) => {
                objectStore.add(snippet);
              });

              // 迁移完成后清除 chrome.storage 中的数据
              chrome.storage.sync.remove(['snippets']);
            }
          });
        }
      };
    });
  }

  async getAllSnippets(): Promise<CodeSnippet[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async saveSnippet(snippet: CodeSnippet): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(snippet);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteSnippet(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

export const db = new DB(); 