import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

// Point this to your hosted game or a local file server
// For local testing, you can use the internal IP of your computer
const GAME_URL = 'https://your-hosted-game-url.com'; // Change this!

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <WebView
                source={{ uri: GAME_URL }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e293b',
    },
    webview: {
        flex: 1,
    },
});
