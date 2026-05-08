import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAssets } from 'expo-asset';

export default function App() {
    const [assets, error] = useAssets([require('./assets/www/index.html')]);

    if (!assets && !error) return null;

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <WebView
                source={require('./assets/www/index.html')}
                style={styles.webview}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
    },
});
