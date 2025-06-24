import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import { useRouter } from 'expo-router';

export default function NextScreen() {
  const router = useRouter();

  const [texto, setTexto] = useState('');
  const [falando, setFalando] = useState(false);

  const textoBemVindo = 'Seja bem vindo ao Simple Reader';
  const [textoBemVindoAnimado, setAnimatedText] = useState('');

  const index = useRef(0);
  const intervalo = useRef<number | null>(null);

  const opacidadeIcone = useRef(new Animated.Value(0)).current;

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
        <Pressable style={styles.botao} onPress={() => router.push('/screens/TelaLerPDF')}>
          <Text style={styles.textoBotao}>Ler um PDF</Text>
        </Pressable>
      </View>

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
