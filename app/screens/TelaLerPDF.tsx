import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';

const OCR_API_KEY = 'API_KEY'; // ADICIONAR AQUI A CHAVE GERADA LA NO OCR

const PdfOcrScreen: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const extrairTextoComAPIOCR = async (base64: string): Promise<string> => {
    try {
      const formData = new FormData();

      formData.append('base64Image', `data:application/pdf;base64,${base64}`);
      formData.append('language', 'por');
      formData.append('isOverlayRequired', 'false');

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          apikey: OCR_API_KEY,
        },
        body: formData,
      });

      const json = await response.json();

      if (
        json.ParsedResults &&
        json.ParsedResults.length > 0 &&
        json.ParsedResults[0].ParsedText
      ) {
        return json.ParsedResults[0].ParsedText.trim();
      }

      return 'Nenhum texto foi encontrado no PDF.';
    } catch (error: any) {
      return `Erro ao extrair texto: ${error.message}`;
    }
  };

  const handlePdfSelection = async () => {
    setExtractedText('');
    setFileName(null);
    setLoading(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.canceled || !result.assets?.length) {
        Alert.alert('Cancelado', 'Nenhum arquivo selecionado.');
        return;
      }

      const file = result.assets[0];
      setFileName(file.name);

      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const text = await extrairTextoComAPIOCR(base64);
      setExtractedText(text);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao processar o PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadText = () => {
    if (extractedText) {
      Speech.speak(extractedText, { language: 'pt-BR' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transcrever texto de PDF</Text>

      <Button title="Selecionar PDF para transcrever" onPress={handlePdfSelection} />

      {fileName && <Text style={styles.fileName}>📄 {fileName}</Text>}

      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      {!!extractedText && (
        <>
          <Text style={styles.sectionTitle}>Texto Extraído:</Text>
          <ScrollView style={styles.responseContainer}>
            <Text selectable>{extractedText}</Text>
          </ScrollView>

          <View style={styles.readButton}>
            <Button title="🔊 Ler texto" onPress={handleReadText} />
          </View>
        </>
      )}
    </View>
  );
};

export default PdfOcrScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  fileName: {
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  responseContainer: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    maxHeight: 400,
  },
  readButton: {
    marginTop: 20,
  },
});