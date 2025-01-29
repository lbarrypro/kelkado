import React, { useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Menu, IconButton, Provider as PaperProvider } from 'react-native-paper'; // Import des composants de react-native-paper
import * as Linking from 'expo-linking'; // Pour ouvrir dans un navigateur externe

const WebViewModal = ({ visible, url, onClose }) => {
    const [isMenuVisible, setMenuVisible] = useState(false); // État pour gérer la visibilité du menu

    const handleOpenInBrowser = () => {
        Linking.openURL(url); // Ouvre le lien dans un navigateur externe
        setMenuVisible(false); // Ferme le menu après l'action
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <PaperProvider> {/* Envelopper avec PaperProvider */}
                <View style={styles.container}>
                    {/* Barre d'outils avec boutons */}
                    <View style={styles.toolbar}>
                        {/* Bouton pour fermer la WebView */}
                        <IconButton
                            icon="close"
                            onPress={onClose}
                            color="#000"
                            size={24}
                        />

                        {/* Menu déroulant */}
                        <Menu
                            visible={isMenuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <IconButton
                                    icon="dots-vertical"
                                    onPress={() => setMenuVisible(true)}
                                    color="#000"
                                    size={24}
                                />
                            }
                        >
                            {/* Option "Ouvrir dans le navigateur" */}
                            <Menu.Item
                                onPress={handleOpenInBrowser}
                                title="Ouvrir dans le navigateur" // Utilisez la prop `title`
                            />
                        </Menu>
                    </View>

                    {/* WebView pour afficher le contenu web */}
                    <WebView
                        source={{ uri: url }}
                        style={styles.webview}
                    />
                </View>
            </PaperProvider>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    webview: {
        flex: 1,
    },
});

export default WebViewModal;
