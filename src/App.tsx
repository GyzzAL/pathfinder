import React, { useEffect, useRef, useState } from 'react';
  import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
  import * as tf from '@tensorflow/tfjs';
  import * as cocoSsd from '@tensorflow-models/coco-ssd';
  import * as Camera from 'expo-camera';
  import * as Permissions from 'expo-permissions';

  const { width, height } = Dimensions.get('window');

  export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const cameraRef = useRef<Camera.Camera>(null);

    useEffect(() => {
      (async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        setHasPermission(status === 'granted');
      })();
    }, []);

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    const detectObjects = async () => {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        const imageAssetPath = photo.uri;
        const imgTensor = tf.browser.fromPixels(await loadImage(imageAssetPath));
        const model = await cocoSsd.load();
        const predictions = await model.detect(imgTensor);
        console.log(predictions);
      }
    };

    return (
      <View style={styles.container}>
        <Camera ref={cameraRef} style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={detectObjects}>
              <Text style={styles.text}> Detect Objects </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    camera: {
      width: width,
      height: height,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
    },
    button: {
      flex: 0.1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: 'white',
    },
  });

  const loadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
