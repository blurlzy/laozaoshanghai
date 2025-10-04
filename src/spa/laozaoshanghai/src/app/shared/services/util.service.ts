import { Injectable } from '@angular/core';

// utility service
@Injectable({
	providedIn: 'root'
})
export class UtilService {
	// ctor
	constructor() {

	}

	// move 
	moveToTop(): void {
		window.scroll(0, 0);
		// // Hack: Scrolls to top of Page after page view initialized
		// let top = document.getElementById('top');
		// if (top !== null) {
		// 	top.scrollIntoView();
		// 	top = null;
		// }
	}

	// validate shipment document file type
	isValidPhoto(fileName: string): boolean {
		const supportedTypes = ['.png', '.jpg', '.jpeg', '.gif', '.jfif', '.webp', '.bmp', '.dpg', '.svg', '.psd', '.tiff', '.tif', '.ico'];
		if (fileName.indexOf('.') === -1) {
			return false;
		}

		// get the file extension
		const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
		return supportedTypes.findIndex(m => m === fileExtension.toLocaleLowerCase()) > -1;
	}

	isValidGUID(id: string): boolean {
		const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		return guidRegex.test(id);
	}
}