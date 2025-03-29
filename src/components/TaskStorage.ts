import { writable } from 'svelte/store';
import type { StoredTask } from './types';

export let taskPreview = writable<StoredTask | null>(null);

export let taskIdsPendingRemoval = writable(new Map<string, number>());

