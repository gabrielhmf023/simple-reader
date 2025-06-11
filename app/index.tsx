import { Stack } from 'expo-router';
import { View, Image, Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      <Image source={require('../assets/images/simple-reader.png')} style={styles.icone} resizeMode="contain" />

      <Pressable style={styles.botao} onPress={() => router.push('/screens/TelaHome')}>
        <Text style={styles.textoBotao}>Iniciar</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  icone: {
    width: 160,
    height: 160,
    marginBottom: 30,
    borderRadius: 20
  },
  botao: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
