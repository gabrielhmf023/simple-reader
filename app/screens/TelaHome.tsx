import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';

export default function NextScreen() {
  const [texto, setTexto] = useState('');
  const [falando, setFalando] = useState(false);

  const textoBemVindo = 'Seja bem vindo ao Simple Reader';
  const [textoBemVindoAnimado, setAnimatedText] = useState('');

  const index = useRef(0);
  const intervalo = useRef<number | null>(null);

  const opacidadeIcone = useRef(new Animated.Value(0)).current;

  const [pdfNome, setPdfNome] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [textoPdf, setTextoPdf] = useState('');

  useEffect(() => {
    Animated.timing(opacidadeIcone, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setAnimatedText('');
    index.current = 0;

    intervalo.current = setInterval(() => {
      setAnimatedText((prev) => {
        if (index.current < textoBemVindo.length) {
          const updatedText = prev + textoBemVindo[index.current];
          index.current += 1;
          return updatedText;
        } else {
          if (intervalo.current) clearInterval(intervalo.current);
          return prev;
        }
      });
    }, 60);

    return () => {
      if (intervalo.current) clearInterval(intervalo.current);
    };
  }, []);

  const lerTexto = () => {
    if (texto.trim().length > 0) {
      setFalando(true);
      Speech.speak(texto, {
        language: 'pt-BR',
        onDone: () => setFalando(false),
        onStopped: () => setFalando(false),
        onError: () => setFalando(false),
      });
    }
  };

  const pararLeitura = () => {
    Speech.stop();
    setFalando(false);
  };

const CLOUDMERSIVE_API_KEY = 'Adicionar API KEY aqui';

const uploadPdf = async (uri: string) => {
  const apiUrl = 'https://api.cloudmersive.com/convert/pdf/to/txt';

  const response = await FileSystem.uploadAsync(apiUrl, uri, {
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'application/pdf',
      'Apikey': CLOUDMERSIVE_API_KEY,
    },
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });

  return response.body;
};

const selecionarPDF = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setPdfNome(asset.name);
      setCarregando(true);

      const textoExtraido = await uploadPdf(asset.uri);
      setTextoPdf(textoExtraido);

      setCarregando(false);
    }
  } catch (error) {
    console.error('Erro:', error);
    setCarregando(false);
    alert('Erro ao processar o PDF.');
  }
};

  const lerPDF = () => {
    if (textoPdf && textoPdf.trim().length > 0) {
      Speech.speak(textoPdf, {
        language: 'pt-BR',
      });
    } else {
      alert('Texto não encontrado.');
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.topContainer}>
        <Animated.Image
          source={require('../assets/images/simple-reader.png')}
          style={[styles.icon, { opacity: opacidadeIcone }]}
          resizeMode="contain"
        />
        <Text style={styles.header}>{textoBemVindoAnimado}</Text>
      </View>

      <View style={styles.centerContainer}>
        <Text style={styles.prompt}>Digite o texto para ser lido</Text>

        <TextInput
          style={styles.inputTexto}
          placeholder="Digite aqui..."
          value={texto}
          onChangeText={setTexto}
          multiline
        />

        <Pressable style={styles.botao} onPress={lerTexto}>
          <Text style={styles.textoBotao}>Ler</Text>
        </Pressable>

      <View style={styles.botaoLinha}>
        <Pressable style={styles.botao} onPress={selecionarPDF}>
          <Text style={styles.textoBotao}>Selecionar PDF</Text>
        </Pressable>

        <Pressable
          style={[styles.botao, !pdfNome && styles.botaoDesabilitado]}
          onPress={lerPDF}
          disabled={!pdfNome}
        >
          <Text style={styles.textoBotao}>Ler PDF</Text>
        </Pressable>
      </View>

      {carregando && <ActivityIndicator size="large" color="#000" style={{ marginTop: 16 }} />}

      {pdfNome ? (
        <Text style={styles.pdfNome}>📄 {pdfNome}</Text>
      ) : null}

        {falando && (
          <Pressable style={[styles.botao, styles.botaoPararLeitura]} onPress={pararLeitura}>
            <Text style={styles.textoBotao}>Parar Leitura</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prompt: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    color: '#444',
  },
  inputTexto: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    height: 120,
    width: '100%',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 15,
  },
  botaoDesabilitado: {
    backgroundColor: '#94a3b8',
  },
  botaoPararLeitura: {
    backgroundColor: '#FF3B30',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
    topContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  pdfBotao: {
    backgroundColor: '#34C759', 
},
  pdfNome: {
    marginTop: 16,
    fontSize: 16,
    color: '#111827',
  },
  botaoLinha: {
    flexDirection: 'row',
    gap: 12,
  },
});
