# Video Background Removal using Custom Transformer

This repository contains code to modify a video stream using [@vonage/media-processor](https://www.npmjs.com/package/@vonage/media-processor) package.
It allows users to remove background image from a video stream using a [custom transformer](https://github.com/tensorflow/tfjs-models/blob/master/body-segmentation/README.md).

## Features

- Remove background from video using a [custom transformer](https://github.com/tensorflow/tfjs-models/blob/master/body-segmentation/README.md).

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js](https://nodejs.org/en/) and VCR.
- You have a basic understanding of JavaScript.

## Install

1. Run `npm install`
2. Run `vcr debug`

## Usage

Click on the "Apply Transform" button to apply the transparent background. In case you want to clear the transformation applied to the video stream, click on the "Clear Transform" button.

Click on the "Start Screen Sharing" button to start screen sharing and click on the "Stop Screen Sharing" button to stop screen sharing.

## Live Demo

Live demo can be found [here](https://neru-d0cab68b-web-js-custom-bg-removal-dev.apse1.runtime.vonage.cloud/).