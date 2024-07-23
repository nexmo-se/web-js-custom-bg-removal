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
let ssPublisher;

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

// Listener for "Test With Screen Share" button - start screen sharing
document.getElementById("ss-start-btn").addEventListener("click", event => {
	OT.checkScreenSharingCapability(response => {
		if (!response.supported || response.extensionRegistered === false) {
			alert("Screen sharing not supported");
		} else if (response.extensionInstalled === false) {
			alert("Browser requires extension");
		} else {
			document.getElementById("screen").classList.remove("hidden");
			document.getElementById("publisher").classList.add("streamer-mode");

			document.getElementById("ss-start-btn").classList.add("hidden");
			document.getElementById("ss-stop-btn").classList.remove("hidden");

			// Share screen code
			ssPublisher = OT.initPublisher(
				"screen",
				{
					insertMode: "append",
					width: "100%",
					height: "100%",
					videoSource: "screen",
					publishAudio: true
				},
				() => {
					console.log("Publisher initialized");
				}
			);
		}
	});
});

// Listener for "Stop Screen Share" button - stop screen sharing
document.getElementById("ss-stop-btn").addEventListener("click", event => {
	document.getElementById("screen").classList.add("hidden");
	document.getElementById("publisher").classList.remove("streamer-mode");

	document.getElementById("ss-stop-btn").classList.add("hidden");
	document.getElementById("ss-start-btn").classList.remove("hidden");

	ssPublisher.destroy();
});