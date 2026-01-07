import axios from 'axios';
import { useFinanceStore } from '../store/memoryStore';
import * as Network from 'expo-network';

const API_URL = 'http://localhost:3000/api'; // Change to actual IP for physical devices

export const syncService = {
    sync: async () => {
        const { syncQueue, lastSyncAt, token, clearSyncQueue, syncWithServer, setLastSyncAt } = useFinanceStore.getState();

        if (!token) return;

        const networkState = await Network.getNetworkStateAsync();
        if (!networkState.isInternetReachable) return;

        try {
            const response = await axios.post(
                `${API_URL}/sync`,
                { lastSyncAt, changes: syncQueue },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { lastSyncAt: newLastSyncAt, changes: serverChanges } = response.data;

            // 1. If successful, clear the items we just sent
            const processedIds = syncQueue.map((q) => q.id);
            clearSyncQueue(processedIds);

            // 2. Apply server changes to local store
            syncWithServer(serverChanges);

            // 3. Update last sync timestamp
            setLastSyncAt(newLastSyncAt);

        } catch (error) {
            console.error('Sync failed:', error);
        }
    },
};
