/* eslint-disable no-unused-vars */
/* global VideoFrame */

import '@tensorflow/tfjs-core/dist/tf-core.min.js'
import '@tensorflow/tfjs-backend-webgl/dist/tf-backend-webgl.min.js'
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@mediapipe/selfie_segmentation/selfie_segmentation.js'

export default class Transformer {

	constructor() {
		this.canvas_ = null;
		this.ctx_ = null;    
	}

	setTransformType(transformType) { this.transformType = transformType; }

	// We are using the mediapipe selfie segmentation solution bundle
	// You can use the ones available in this cdn https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation
	//  or copy the files from "node_modules/@mediapipe/selfie-segmentation" after you "npm install node_modules/@mediapipe"
	// More details can also be found here: https://github.com/tensorflow/tfjs-models/blob/master/body-segmentation/README.md
	async start() {
		this.segmenterConfig = {
			runtime: 'mediapipe',
			solutionPath: 'selfie_segmentation/'
		};
		this.segmenter = await bodySegmentation.createSegmenter(bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation, this.segmenterConfig);

		this.canvas_ = new OffscreenCanvas(1, 1);
		this.ctx_ = this.canvas_.getContext('2d', { alpha: true, desynchronized: true });
		
		if (!this.ctx_) {
			throw new Error('Unable to create CanvasRenderingContext2D');
		}
	}

	async transform(frame, controller) {
		this.canvas_.width = frame.displayWidth;
		this.canvas_.height = frame.displayHeight;
		const timestamp = frame.timestamp;

		// Draw video frame image to this.canvas_
		this.ctx_.drawImage(frame, 0, 0);
		const imageData = this.ctx_.getImageData(0, 0, this.canvas_.width, this.canvas_.height);
		frame.close();
		this.ctx_.putImageData(imageData, 0, 0);

		// Segment people from this.canvas_ and draw a binary mask (stored in coloredPartImage) where
		//  pixels which belong to people will be colored { r: 0, g: 0, b: 0, a: 255 } (note, alpha value is 255)
		//  and backgrounds will be colored { r: 255, g: 255, b: 255, a: 0 } (note, alpha value is 0)
		const segmentation = await this.segmenter.segmentPeople(this.canvas_);
		const coloredPartImage = await bodySegmentation.toBinaryMask(segmentation, { r: 0, g: 0, b: 0, a: 255 }, { r: 255, g: 255, b: 255, a: 0 });
		
		// For each pixels in this.canvas_, check if in the mask (coloredPartImage),
		//  whether the alpha value is 0 (which means it's a background).
		// If so, then we will turn the alpha value of the pixel in this.canvas_ to 0 (i.e. transparent)
		var pixel = imageData.data;
		for (var p = 0; p < pixel.length; p += 4) {
			if (coloredPartImage.data[p+3] === 0) {
				pixel[p+3] = 0;
			}
		}
		this.ctx_.imageSmoothingEnabled = true;
		this.ctx_.putImageData(imageData, 0, 0);

		// Use the modified image as the processed video frame
		controller.enqueue(new VideoFrame(this.canvas_, { timestamp, alpha: 'keep' }));
	}

	flush() {
		console.log('Canvas transformer flushed');
	}
}