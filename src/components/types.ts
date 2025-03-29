export type Task = {
	title: string;
	body: string;
};

export type StoredTask = Task & {
	id: string;
	createdAt: number;
	done: boolean;
};
