// Import the required packages
import {
	MediaProcessor,
	MediaProcessorConnector,
} from "@vonage/media-processor";
import OT from "@opentok/client";
import TransparentBg from "./transformers/transparent-bg";

// Initialize Opentok publisher
var publisherProperties = {
	width: "100%",
	height: "100%",
	insertMode: "append",
};
const publisher = OT.initPublisher("publisher", publisherProperties, () => {
	console.log("Publisher initialized");
});

// Function to handle "Apply Transformer" button
const applyTransform = () => {
	const mediaProcessor = new MediaProcessor();
	mediaProcessor.setTransformers([new TransparentBg()]);
	const connector = new MediaProcessorConnector(mediaProcessor);
	publisher.setVideoMediaProcessorConnector(connector);
};

// Listener for "Apply Transformer" button - apply transformer
document.getElementById("apply-btn").addEventListener("click", function () {
	applyTransform();
});

// Listener for "Cancel Transformer" button - remove transformer
document.getElementById("clear-btn").addEventListener("click", function () {
	publisher.setVideoMediaProcessorConnector(null);
});