import React from 'react';
import { View, Button, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const PdfViewer = () => {
  const openPdf = async () => {
    const uri = 'https://example.com/path-to-your-pdf.pdf'; // Replace with your PDF URL
    if (Platform.OS === 'ios') {
      await MediaLibrary.presentPreviewAsync(uri);
    } else {
      console.log('PDF URI:', uri); // For Android, log the file URI or use an Android PDF viewer library
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open PDF" onPress={openPdf} />
    </View>
  );
};

export default PdfViewer;
