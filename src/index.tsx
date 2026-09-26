import React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import App from './App';
  import AStarVisualizer from './AStarVisualizer';

  const Stack = createNativeStackNavigator();

  export default function Index() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={App} />
          <Stack.Screen name="AStarVisualizer" component={AStarVisualizer} options={{ title: 'A* Visualizer' }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
