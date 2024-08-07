/*global OT, navigator*/
/*eslint no-undef: ["error"] */

import React from "react";
import "./index.css";

import { MediaProcessor, MediaProcessorConnector } from '@vonage/media-processor';

import TransparentBg from "./transparent-bg-transformer.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transformApplied: false,
      screenSharing: false
    };

    this.opentokPublisher = null;
    this.ssPublisher = null;
  }

  componentDidMount() {
    this.initWorker();
  }

  async initWorker() {
    if (await this.checkMediaStreamSupport()) {
      this.init();
      return;
    }
  }

  async checkMediaStreamSupport() {
    if ( typeof MediaStreamTrackProcessor === 'undefined' ||
         typeof MediaStreamTrackGenerator === 'undefined' ) {
      alert(
          'Your browser does not support the experimental MediaStreamTrack API ' +
          'for Insertable Streams of Media. See the note at the bottom of the ' +
          'page.');
      return false;
    }
    return true;
  }

  applyTransform() {
    this.setState({ transformApplied: true });

    const mediaProcessor = new MediaProcessor();
    mediaProcessor.setTransformers([new TransparentBg()]);
    const connector = new MediaProcessorConnector(mediaProcessor);
    this.opentokPublisher.setVideoMediaProcessorConnector(connector);
  }

  clearTransform() {
    this.setState({ transformApplied: false });

    this.opentokPublisher.setVideoMediaProcessorConnector(null);
  }

  async init() {
    const publisherOptions = {
      insertMode: 'append',
      width: "100%",
	    height: "100%",
    };
    const publisher = await OT.initPublisher(
      'publisher',
      publisherOptions,
      (error) => {
        if (error) {
          console.warn(error);
        }
      }
    );
    this.opentokPublisher = publisher;
  }

  startScreenShare () {
    OT.checkScreenSharingCapability(response => {
      if (!response.supported || response.extensionRegistered === false) {
        alert("Screen sharing not supported");
      } else if (response.extensionInstalled === false) {
        alert("Browser requires extension");
      } else {
        this.setState({ screenSharing: true });

        document.getElementById("screen").classList.remove("hidden");
        document.getElementById("publisher").classList.add("streamer-mode");
  
        // Share screen code
        this.ssPublisher = OT.initPublisher(
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
  }

  stopScreenShare = () => {
    this.setState({ screenSharing: false });

    document.getElementById("screen").classList.add("hidden");
    document.getElementById("publisher").classList.remove("streamer-mode");

	  this.ssPublisher.destroy();
    this.ssPublisher = null;
  }

  render() {
    const { transformApplied, screenSharing } = this.state;
    
    return (
      <div>
        <h1>Transparent Background Demo</h1>
        <div id="screen" class="hidden"></div>
        <div id="publisher"></div>
        <div id="transformTypeWrapper">
            <button class="purple-btn" onClick={() => this.applyTransform()} disabled={transformApplied}>
              Apply Transform
            </button>
            <button class="purple-btn" onClick={() => this.clearTransform()} disabled={!transformApplied}>
              Clear Transform
            </button>
          </div>
          <div id="screenShareWrapper">
            <button class="pink-btn" onClick={() => this.startScreenShare()} disabled={screenSharing}>
              Start Screen Sharing
            </button>
            <button class="pink-btn"onClick={() => this.stopScreenShare()} disabled={!screenSharing}>
              Stop Screen Sharing
            </button>
          </div>
      </div>
    );
  }
}