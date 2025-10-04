export class ContentItem {
	id: string;
	//tweetId: string;
	text: string;
	authorId: string;
	source: string;
	mediaItems: MediaItem[];
	tags: string[];
	totalComments: number  | null;
	dateCreated: string;
	// default iamge url  (optional)
	defaultImageUrl: string;
	imgLoaded: boolean;

	// ctor
	constructor() {
		this.mediaItems = [];
		this.tags = [];
		this.totalComments = 0;
		this.imgLoaded = false;
	}
}

export class MediaItem {
	type: string
	url: string
	fileName: string
	previewUrl: string
}

export class Comment {
	id: string;
	contentItemId: string;
	//authorId: string;
	name: string;
	commentText: string;
	reviewed: boolean
	dateCreated: string
}


export enum SidenavViewOptions {
	contenteDetails = 1,
	contentComments = 2
}