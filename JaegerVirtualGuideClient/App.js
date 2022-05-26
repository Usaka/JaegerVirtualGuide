import 'react-native-reanimated'
import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera'
import LoadingView from 'react-native-loading-view'
import rfs from 'react-native-fs';
import io from 'socket.io-client'

/**
 * Scans QR codes.
 */
// export function getBufferArray(frame) {
//   'worklet'
//   return __getBufferArray(frame)
// }

const App = () => {
  const socket = io('http://animalgeek.sytes.net:10019');
  const devices = useCameraDevices('wide-angle-camera')
  const device = devices.back

  const cam = useRef(null);
  const fps = useRef(0);

  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet'

  //   console.log(frame)

  //   if (!!cam?.current) {
  //     console.log(cam.current.takeSnapshot().toString())
  //   }
  // }, [])

  setInterval(() => {
    cam?.current?.takeSnapshot({
      quality: 50,
      skipMetadata: true
    })
      .then(image => {
        fps.current += 1

        rfs.readFile(image.path, 'base64')
          .then(result => {
            socket.emit('jeager-video', result)
          })

        // var reader = new FileReader();
        // reader.readAsDataURL(request.response);
        // reader.onload = function (e) {
        //   console.log('DataURL:', e.target.result);
        // };
      })
      .catch(err => {
        console.log('Error ===> ', err)
      })
  }, 1)

  setInterval(() => {
    console.log(fps.current)
    fps.current = 0
  }, 1000)

  if (device == null) return <LoadingView loading={true} />

  return (
    //<View>
    <Camera
      ref={cam}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}>
      <View
        style={{
          position: 'absolute',
          height: 300,
          width: 300,
          top: 0,
          zIndex: 1000,
          backgroundColor: '#c1c1c1'
        }} >
      </View>
    </Camera>
    //</View >
  )
};

export default App;