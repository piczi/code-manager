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
  private isInitializing: boolean = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    // 防止多次同时初始化
    if (this.isInitializing) {
      return this.initPromise!;
    }

    this.isInitializing = true;
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open database');
        this.isInitializing = false;
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitializing = false;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('title', 'title', { unique: false });
          
          // 存储一个标志，表示需要在 onsuccess 后迁移数据
          this.migrateFromChromeStorage();
        }
      };
    });

    return this.initPromise;
  }

  // 将Chrome Storage迁移逻辑移到单独的方法
  private async migrateFromChromeStorage(): Promise<void> {
    try {
      // 确保数据库已完全初始化
      if (!this.db) await this.init();
      
      // 获取Chrome存储的数据
      const result = await new Promise<{snippets?: CodeSnippet[]}>(resolve => {
        chrome.storage.sync.get(['snippets'], resolve);
      });
      
      if (result.snippets && result.snippets.length > 0) {
        // 创建新的事务来存储数据
        const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        
        for (const snippet of result.snippets) {
          objectStore.add(snippet);
        }
        
        await new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => {
            // 迁移完成后清除Chrome存储数据
            chrome.storage.sync.remove(['snippets'], () => {
              console.log('Data migrated from Chrome Storage to IndexedDB');
              resolve();
            });
          };
          
          transaction.onerror = () => {
            console.error('Error migrating data:', transaction.error);
            reject(transaction.error);
          };
        });
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
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