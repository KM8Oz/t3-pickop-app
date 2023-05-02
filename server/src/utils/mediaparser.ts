export interface MediaObject {
    type: string;
    url: string;
}

export function getMediaObjects(imageUrls: string[]): MediaObject[] {
    const mediaObjects: MediaObject[] = [];

    imageUrls.forEach((url) => {
        const extension = url.split('.').pop()?.toLowerCase();

        let mediaType = '';

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                mediaType = 'image';
                break;
            case 'mp4':
            case 'webm':
                mediaType = 'video';
                break;
            default:
                mediaType = 'unknown';
                break;
        }

        mediaObjects.push({ type: mediaType, url });
    });

    return mediaObjects;
}
